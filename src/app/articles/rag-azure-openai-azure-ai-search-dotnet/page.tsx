import type { Metadata } from 'next';
import Link from 'next/link';
import ArticlePage, { articleMetadata } from '@/components/home/ArticlePage';
import { article } from '@/lib/articles';

const meta = article('rag-azure-openai-azure-ai-search-dotnet');
export const metadata: Metadata = articleMetadata(meta);

// Illustrations of the pattern, not code from any project. Packages: Azure.AI.OpenAI 2.x, Azure.Search.Documents, Azure.Identity.
const CLIENTS = `using Azure.AI.OpenAI;
using Azure.Identity;
using Azure.Search.Documents;
using Azure.Search.Documents.Indexes;
using OpenAI.Chat;
using OpenAI.Embeddings;

var credential = new DefaultAzureCredential();          // managed identity in Azure, your login locally

var openAi = new AzureOpenAIClient(new Uri("https://my-openai.openai.azure.com"), credential);
EmbeddingClient embeddings = openAi.GetEmbeddingClient("text-embedding-3-small");   // deployment names, not model names
ChatClient chat = openAi.GetChatClient("gpt-4o-mini");

var searchEndpoint = new Uri("https://my-search.search.windows.net");
var indexClient = new SearchIndexClient(searchEndpoint, credential);
var searchClient = new SearchClient(searchEndpoint, "docs", credential);`;

const INDEX = `using Azure.Search.Documents.Indexes.Models;

const int Dimensions = 1536;   // text-embedding-3-small; ada-002 is also 1536, 3-large is up to 3072

var index = new SearchIndex("docs")
{
    Fields =
    {
        new SimpleField("id", SearchFieldDataType.String) { IsKey = true, IsFilterable = true },
        new SearchableField("title") { IsFilterable = true },
        new SearchableField("content"),
        new SimpleField("source", SearchFieldDataType.String) { IsFilterable = true },
        new SimpleField("tenantId", SearchFieldDataType.String) { IsFilterable = true },
        new VectorSearchField("contentVector", Dimensions, "default-profile"),
    },
    VectorSearch = new()
    {
        Algorithms = { new HnswAlgorithmConfiguration("hnsw") },          // cosine by default, which Azure OpenAI embeddings expect
        Profiles = { new VectorSearchProfile("default-profile", "hnsw") },
    },
    SemanticSearch = new()
    {
        Configurations =
        {
            new SemanticConfiguration("default-semantic", new()
            {
                TitleField = new SemanticField("title"),
                ContentFields = { new SemanticField("content") },
            }),
        },
    },
};

await indexClient.CreateOrUpdateIndexAsync(index);`;

const INGEST = `using Azure.Search.Documents.Models;

static IEnumerable<string> Split(string text, int size = 1200, int overlap = 200)
{
    for (var start = 0; start < text.Length; start += size - overlap)
    {
        var length = Math.Min(size, text.Length - start);
        yield return text.Substring(start, length);
        if (start + length >= text.Length) yield break;
    }
}

// documentKey: letters, digits, underscore, dash or equals only; it becomes part of each chunk id
async Task IndexDocumentAsync(string documentKey, string title, string source, string tenantId, string text)
{
    var batch = new List<SearchDocument>();
    var n = 0;
    foreach (var piece in Split(text))
    {
        OpenAIEmbedding embedding = await embeddings.GenerateEmbeddingAsync(piece);
        batch.Add(new SearchDocument
        {
            ["id"] = $"{documentKey}-{n++}",
            ["title"] = title,
            ["content"] = piece,
            ["source"] = source,
            ["tenantId"] = tenantId,
            ["contentVector"] = embedding.ToFloats().ToArray(),
        });
    }
    await searchClient.UploadDocumentsAsync(batch);
}`;

const RETRIEVE = `public sealed record Passage(string Id, string Title, string Content, string Source);

async Task<List<Passage>> RetrieveAsync(string question, string tenantId, int take = 5)
{
    OpenAIEmbedding q = await embeddings.GenerateEmbeddingAsync(question);

    var options = new SearchOptions
    {
        Filter = SearchFilter.Create($"tenantId eq {tenantId}"),   // the caller's data only; the handler quotes the value
        Size = take,
        Select = { "id", "title", "content", "source" },
        VectorSearch = new()
        {
            Queries = { new VectorizedQuery(q.ToFloats()) { KNearestNeighborsCount = 50, Fields = { "contentVector" } } },
        },
        QueryType = SearchQueryType.Semantic,                      // rerank the fused list; needs k of 50 to work with
        SemanticSearch = new() { SemanticConfigurationName = "default-semantic" },
    };

    // The same question goes in as text too: keyword recall plus vector recall, fused with reciprocal rank fusion
    SearchResults<SearchDocument> results = await searchClient.SearchAsync<SearchDocument>(question, options);

    var passages = new List<Passage>();
    await foreach (SearchResult<SearchDocument> hit in results.GetResultsAsync())
    {
        var d = hit.Document;
        passages.Add(new Passage((string)d["id"], (string)d["title"], (string)d["content"], (string)d["source"]));
    }
    return passages;
}`;

const ANSWER = `public sealed record Answer(string Text, IReadOnlyList<Passage> Sources);

async Task<Answer> AnswerAsync(string question, string tenantId)
{
    var passages = await RetrieveAsync(question, tenantId);
    if (passages.Count == 0)
        return new Answer("I could not find that in the documents.", passages);

    var context = string.Join("\\n\\n", passages.Select(p => $"[{p.Id}] {p.Title}\\n{p.Content}"));

    ChatCompletion completion = await chat.CompleteChatAsync(
    [
        new SystemChatMessage(
            "Answer using only the passages provided. After each claim, cite the passage id in square brackets. " +
            "If the passages do not contain the answer, say that you could not find it and do not guess."),
        new UserChatMessage($"Passages:\\n{context}\\n\\nQuestion: {question}"),
    ]);

    return new Answer(completion.Content[0].Text, passages);
}`;

const STREAM = `// Blazor Server or an API endpoint can forward each delta as it arrives
await foreach (StreamingChatCompletionUpdate update in chat.CompleteChatStreamingAsync(messages))
{
    foreach (ChatMessageContentPart part in update.ContentUpdate)
        await WriteToClientAsync(part.Text);
}`;

const ON_YOUR_DATA = `#pragma warning disable AOAI001   // the data-source API is marked as subject to change

ChatCompletionOptions options = new();
options.AddDataSource(new AzureSearchChatDataSource
{
    Endpoint = searchEndpoint,
    IndexName = "docs",
    Authentication = DataSourceAuthentication.FromSystemManagedIdentity(),
});

ChatCompletion completion = await chat.CompleteChatAsync([new UserChatMessage(question)], options);

ChatMessageContext context = completion.GetMessageContext();
foreach (ChatCitation citation in context?.Citations ?? [])
    Console.WriteLine($"{citation.Title}: {citation.Content}");`;

const TESTS = `public sealed class RetrievalTests(RagFixture rag)
{
    [Fact]
    public async Task Refund_window_question_retrieves_the_refund_policy()
    {
        var passages = await rag.RetrieveAsync("How many days does a customer have to ask for a refund?", "tenant-1");

        Assert.Contains(passages, p => p.Source == "refund-policy.md");
    }

    [Fact]
    public async Task A_question_outside_the_corpus_is_declined()
    {
        var answer = await rag.AnswerAsync("Who won the 2022 World Cup?", "tenant-1");

        Assert.Contains("could not find", answer.Text, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task Tenants_never_see_each_other()
    {
        var passages = await rag.RetrieveAsync("What is in the tenant two handbook?", "tenant-1");

        Assert.DoesNotContain(passages, p => p.Source.StartsWith("tenant-2/"));
    }
}`;

export default function Page() {
  return (
    <ArticlePage article={meta}>
      <p>
        On Qatar&apos;s national event platforms I built Azure OpenAI (GPT) integrations across the API and data contracts, and the Microsoft certification I hold, <Link href="/certifications">Azure AI Apps and Agents Developer Associate (AI-103)</Link>, covers retrieval-augmented generation with Azure AI Search. What follows is the RAG design I would build in .NET today: the pieces, the code for each, and the tests that keep a chat feature honest once real documents meet a real model.
      </p>

      <h2>What RAG is, and what it is not</h2>
      <p>
        A language model knows what it was trained on. Your refund policy, your incident runbooks and last month&apos;s contracts are not in there, and fine-tuning does not put them there reliably either. Retrieval-augmented generation sidesteps the problem: for each question, the application first <strong>retrieves</strong> the few passages from your own documents that are most relevant, then asks the model to answer <strong>using those passages</strong>. The model supplies language and reasoning; your index supplies the facts.
      </p>
      <p>
        Two consequences follow. The quality of the answer is capped by the quality of retrieval, so retrieval is the part to test. And because the passages are in the prompt, the model can cite them, which is what makes the answer checkable by a person.
      </p>

      <h2>The four pieces</h2>
      <ul>
        <li><strong>An embedding deployment</strong> in Azure OpenAI turns text into a vector of numbers whose distance reflects meaning.</li>
        <li><strong>An Azure AI Search index</strong> stores each chunk of text, its vector, and the fields you will filter on.</li>
        <li><strong>A chat deployment</strong> writes the answer from the retrieved passages.</li>
        <li><strong>Your code</strong> chunks documents, calls the three services, builds the prompt and shows the citations.</li>
      </ul>
      <p>
        Everything below uses the current SDKs: <code>Azure.AI.OpenAI</code> 2.x, which wraps the official OpenAI library, and <code>Azure.Search.Documents</code>. Authenticate with a managed identity in Azure and <code>DefaultAzureCredential</code> in code, so no key is ever in configuration.
      </p>
      <pre><code>{CLIENTS}</code></pre>

      <h2>Design the index around the questions</h2>
      <p>
        The vector field is the headline, but the other fields decide whether the feature is usable. A <code>content</code> field holds the readable chunk the model will see. A <code>source</code> field is what the citation points at. A <code>tenantId</code> field, or whatever your permission boundary is, must be filterable, because retrieval has to respect who is asking. The dimension count must match the embedding model exactly.
      </p>
      <pre><code>{INDEX}</code></pre>
      <p>
        The semantic configuration enables Azure AI Search&apos;s reranker, which rescores the top results with a language model trained for relevance. It is optional, costs a little latency, and Microsoft describes it as promoting the most relevant results to the top of the list, which is exactly where a RAG prompt looks.
      </p>

      <h2>Chunk, embed, upload</h2>
      <p>
        A document is embedded in pieces, not whole: one vector for a forty-page manual averages everything into nothing. Chunks of a few hundred tokens with overlap keep each vector specific while making sure a sentence cut at a boundary still appears intact in one of its neighbours. Split on paragraphs or headings when you have them; the character-based splitter below is the fallback.
      </p>
      <pre><code>{INGEST}</code></pre>
      <p>
        For PDFs and scanned documents, Azure AI Document Intelligence extracts the text with its layout, which keeps tables readable. Embeddings are the slow, metered step, so store the vector and re-embed a document only when its content hash changes.
      </p>

      <h2>Retrieve with a hybrid query</h2>
      <p>
        Vector search finds passages that say the same thing in different words. Keyword search finds exact product codes, error identifiers and names that embeddings blur together. A hybrid query runs both and fuses the two ranked lists with reciprocal rank fusion, so the result is better than either alone. The filter runs inside the service, which means a user can never retrieve another tenant&apos;s passage, however the question is phrased.
      </p>
      <pre><code>{RETRIEVE}</code></pre>
      <p>
        Two numbers matter. <code>KNearestNeighborsCount</code> is how many vector matches feed the fusion; Microsoft&apos;s guidance is 50 when the semantic reranker is on, because the reranker needs that many candidates. <code>Size</code> is how many passages you actually hand to the model, and five is a sensible start: enough to cover a question, few enough that the prompt stays focused.
      </p>

      <h2>Ground the answer and cite the source</h2>
      <p>
        The prompt does three jobs: it tells the model to use only the passages, it asks for a citation after each claim, and it gives the model permission to say &quot;not found&quot;. Without the third instruction, a model asked about something outside the corpus will produce a fluent and wrong answer.
      </p>
      <pre><code>{ANSWER}</code></pre>
      <p>
        Return the passages with the answer, not just the text. The screen can then render each citation as a link to the source document, and a reviewer can check a claim in seconds. For a chat interface, stream the response so the first words appear before the whole answer is written:
      </p>
      <pre><code>{STREAM}</code></pre>

      <h2>The shortcut: Azure OpenAI On Your Data</h2>
      <p>
        Azure OpenAI can do the retrieval for you. Attach an Azure AI Search index as a data source on the chat request and one call returns an answer with citations. It is the fastest way to a working demo.
      </p>
      <pre><code>{ON_YOUR_DATA}</code></pre>
      <p>
        I build retrieval myself once the feature is real, for three reasons: I can test retrieval on its own, I control the filter that enforces permissions, and I decide how many passages and which prompt. On Your Data also cannot be combined with function calling on the same request, which matters as soon as the assistant needs to do more than answer.
      </p>

      <h2>Test retrieval, then test the answer</h2>
      <p>
        A RAG feature fails quietly: the answer reads well and is wrong. The defence is a small golden set of questions with the passage that should come back, run as integration tests against a copy of the index. Retrieval tests are deterministic and cheap. Answer tests are not, because models vary, so keep them to the behaviours that must hold: declining questions outside the corpus, and never crossing a permission boundary.
      </p>
      <pre><code>{TESTS}</code></pre>
      <p>
        Log every question, the passage ids retrieved and the answer, with the same care as any other personal data. The log is where the next golden-set entries come from, and where you discover that users ask in a vocabulary your documents do not use.
      </p>

      <h2>Cost and latency</h2>
      <ul>
        <li><strong>Cache question embeddings</strong> for a short time. Users retry the same question with small edits.</li>
        <li><strong>Keep passages short.</strong> Five chunks of 1,200 characters is about 1,500 tokens of context; the prompt cost scales with it on every call.</li>
        <li><strong>Pick the smaller chat model first.</strong> With good passages a small model answers well; move up only when the evaluation set says so.</li>
        <li><strong>Measure the three legs separately:</strong> embedding call, search call, chat call. The slow one is rarely the one you assumed.</li>
      </ul>

      <h2>Mistakes I would check for first</h2>
      <ul>
        <li><strong>Whole documents as one chunk.</strong> Retrieval returns the manual, not the paragraph, and the model skims.</li>
        <li><strong>Vector-only search.</strong> Exact identifiers stop matching. Pass the question as text too.</li>
        <li><strong>Permissions applied after retrieval.</strong> Filtering in code leaks through the citations and through k. Filter in the query.</li>
        <li><strong>No &quot;not found&quot; path.</strong> Every question gets an answer, including the ones that should not.</li>
        <li><strong>Different embedding models for indexing and querying.</strong> The vectors are not comparable; everything matches equally badly.</li>
        <li><strong>Keys in appsettings.</strong> Use a managed identity for both services and assign the search roles it needs.</li>
      </ul>

      <p>
        The permission filter above is the same rule as server-side redaction in an API: the caller gets only what they may see, decided before the data leaves the service. <Link href="/articles/role-based-access-control-data-redaction-dotnet">Role-based data redaction in ASP.NET Core</Link> covers that side for ordinary endpoints.
      </p>
    </ArticlePage>
  );
}
