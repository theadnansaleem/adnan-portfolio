import type { Metadata } from 'next';
import Link from 'next/link';
import PageFrame from '@/components/home/PageFrame';
import { hxArabic } from '@/components/home/fonts';
import { jobs, profile, skills, stats } from '@/lib/data';
import { pageJsonLd } from '@/lib/seo';

const TITLE = 'محمد عدنان سليم | مهندس برمجيات أول Full-Stack';
const DESCRIPTION =
  'مهندس برمجيات أول بخبرة ثماني سنوات في بناء منصات مؤسسية لجهات حكومية وشركات تقنية مالية وأمن سيبراني، متاح فورًا ومنفتح على الانتقال إلى دول الخليج.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: '/ar', languages: { en: '/', ar: '/ar', 'x-default': '/' } },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/ar', locale: 'ar_AR', images: ['/opengraph-image'] },
};

// Arabic for the fixed labels in data.ts. Company, product and technology names stay in Latin script.
const STAT_LABELS: Record<string, string> = {
  'Years of Experience': 'سنوات من الخبرة',
  'Years Fully Remote': 'سنوات عمل عن بُعد بالكامل',
  'Government Entities Served': 'جهات حكومية',
  'Junior Developers Mentored': 'مطوّرًا مبتدئًا تم إرشادهم',
};
const ROLES: Record<string, string> = {
  'Senior Fullstack Developer': 'مطوّر Full-Stack أول',
  'Freelance Full-Stack Developer': 'مطوّر Full-Stack مستقل',
  'Mid-Level Fullstack Developer': 'مطوّر Full-Stack متوسط الخبرة',
  'JavaScript / TypeScript Developer': 'مطوّر JavaScript / TypeScript',
  'Frontend Developer': 'مطوّر واجهات أمامية',
};
const PLACES: Record<string, string> = {
  'Doha, Qatar': 'الدوحة، قطر',
  'London, United Kingdom': 'لندن، المملكة المتحدة',
  Canada: 'كندا',
  'Bavaria, Germany': 'بافاريا، ألمانيا',
  'Palo Alto, United States': 'بالو ألتو، الولايات المتحدة',
  'Karachi, Pakistan': 'كراتشي، باكستان',
};
// The same six results as the English page, with the numbers taken from the CV
const IMPACT = [
  ['~40%', 'دورة إصدار أسرع', 'إعادة هيكلة واجهة React متجانسة إلى واجهات مصغّرة (Micro Frontends) باستخدام Module Federation.', 'Supreme Committee for Delivery & Legacy'],
  ['~70%', 'زمن عرض أقل', 'العرض الافتراضي (virtualization) والتخزين المؤقت لجداول تتجاوز 20,000 صف.', 'Volopa Financial Services'],
  ['42', 'سير عمل مالي تم ترحيله', 'من Visual FoxPro إلى C#/.NET Core مع واجهات Angular و Blazor، كمهندس وحيد على المشروع.', 'Benington Financials Canada'],
  ['~35%', 'تحسّن في LCP', 'استيفاء معايير Core Web Vitals عبر التحميل المؤجّل وتقسيم الشيفرة.', 'Supreme Committee for Delivery & Legacy'],
  ['60M+', 'سطر من برمجيات المركبات', 'لوحات لحظية لرصد التهديدات عبر WebSocket لمنصة Codex للأمن السيبراني.', 'Primary Target GmbH'],
  ['180+', 'دولة', 'منصة مدفوعات وبطاقات متعددة العملات متوافقة مع WCAG 2.1 ولوائح التقنية المالية البريطانية.', 'Volopa Financial Services'],
];

export default function ArabicPage() {
  return (
    <PageFrame>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageJsonLd('/ar', TITLE, DESCRIPTION, 'WebPage', 'ar') }} />
      <div className={`hx-ar ${hxArabic}`} dir="rtl" lang="ar">
        <header className="hx-head">
          <p className="hx-cap"><b>النسخة العربية</b> متاح فورًا · منفتح على الانتقال</p>
          <h1>محمد عدنان سليم<br /><em>مهندس برمجيات أول</em></h1>
          <p>
            ثماني سنوات في بناء منصات مؤسسية لجهات حكومية وشركات تقنية مالية وأمن سيبراني.
            الواجهات باستخدام <span dir="ltr">React</span> و <span dir="ltr">Next.js</span> و <span dir="ltr">Angular</span>،
            والخوادم باستخدام <span dir="ltr">Node.js</span> و <span dir="ltr">C#</span> و <span dir="ltr">.NET</span> و <span dir="ltr">AWS</span>.
          </p>
          <div className="hx-actions">
            <a className="hx-pill is-solid is-big" href={profile.resume} target="_blank" rel="noopener noreferrer">تحميل السيرة الذاتية</a>
            <a className="hx-pill is-big" href={`mailto:${profile.email}`}>راسلني</a>
            <a className="hx-pill is-big" href={profile.linkedin} target="_blank" rel="noopener noreferrer" dir="ltr">LinkedIn ↗</a>
          </div>
        </header>

        <dl className="hx-stats hx-card">
          {stats.map((stat) => (
            <div key={stat.label}><dt>{stat.number}</dt><dd>{STAT_LABELS[stat.label] ?? stat.label}</dd></div>
          ))}
        </dl>

        <section>
          <p className="hx-cap"><b>٠١</b> خبرة في الخليج</p>
          <h2>عملت في الدوحة على منصات قطر الوطنية</h2>
          <p>
            مع اللجنة العليا للمشاريع والإرث عملت على منصة «هيّا» للتأشيرات الإلكترونية، ومنصة فعاليات قطر،
            ومنصة «الطريق إلى قطر»، وهي منصات تخدم أكثر من عشر جهات حكومية.
          </p>
        </section>

        <section>
          <p className="hx-cap"><b>٠٢</b> نتائج بالأرقام</p>
          <ul className="hx-grid-3" style={{ marginTop: 18 }}>
            {IMPACT.map(([figure, label, detail, where]) => (
              <li key={label} className="hx-card">
                <strong>{figure}</strong>
                <h3>{label}</h3>
                <p>{detail}</p>
                <span className="hx-cap" dir="ltr">{where}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="hx-grid-2">
          <div className="hx-facts hx-card">
            <p className="hx-cap"><b>٠٣</b> الخبرة العملية</p>
            <ol>
              {jobs.map((job) => (
                <li key={job.id}>
                  <strong>{ROLES[job.role] ?? job.role}</strong>
                  <span><span dir="ltr">{job.company}</span> · {PLACES[job.location] ?? job.location}</span>
                  <span className="hx-cap" dir="ltr">{job.period}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="hx-facts hx-card">
            <p className="hx-cap"><b>٠٤</b> التقنيات</p>
            <ol>
              {skills.slice(0, 5).map((group) => (
                <li key={group.category}>
                  <span className="hx-cap" dir="ltr">{group.category}</span>
                  <span dir="ltr">{group.tags.slice(0, 8).join(' · ')}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="hx-study-cta hx-card">
          <div>
            <p className="hx-cap">للتواصل</p>
            <h2>لنتحدث</h2>
            <p>مقيم في لاهور، باكستان. خمس سنوات من العمل عن بُعد مع فرق في الولايات المتحدة والمملكة المتحدة وألمانيا.</p>
            <p>تفاصيل المشاريع ودراسات الحالة متاحة باللغة الإنجليزية.</p>
          </div>
          <div className="hx-actions">
            <a className="hx-pill is-solid is-big" href={`mailto:${profile.email}`} dir="ltr">{profile.email}</a>
            <Link className="hx-pill is-big" href="/">English</Link>
            <Link className="hx-pill is-big" href="/work">دراسات الحالة</Link>
          </div>
        </section>
      </div>
    </PageFrame>
  );
}
