import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

test('published benchmark medians and ranges match every recorded condition', () => {
  const benchmark = JSON.parse(readFileSync(new URL('../public/benchmarks/react-virtualization-2026-10-15/results.json', import.meta.url), 'utf8'));
  assert.equal(benchmark.samples.length, 64);
  assert.deepEqual(benchmark.summaries.map(s => s.transition), ['blank-to-EUR', 'EUR-to-blank']);
  for (const block of [1, 2, 3, 4]) {
    const samples = benchmark.samples.filter(s => s.block === block);
    assert.equal(samples.length, 16);
    assert.equal(samples.filter(s => s.phase === 'warmup').length, 6);
    assert.equal(samples.filter(s => s.phase === 'measured').length, 10);
    assert.ok(samples.every(s => s.virtual === (block === 2 || block === 3)));
  }
  for (const result of benchmark.summaries) {
    for (const [mode, virtual] of [['off', false], ['on', true]]) {
      const samples = benchmark.samples.filter(s => s.phase === 'measured' && s.virtual === virtual && s.transition === result.transition);
      assert.equal(samples.length, 10);
      const rows = result.transition === 'blank-to-EUR' ? 2361 : 20000;
      assert.ok(samples.every(s => s.data_rows === rows && s.dom_rows === (virtual ? 18 : rows)));
      const times = samples.map(s => s.elapsed_ms).sort((a, b) => a - b);
      assert.ok(times.every(t => Number.isInteger(t) && t >= 0));
      assert.deepEqual(result[mode], { n: 10, median_ms: (times[4] + times[5]) / 2, min_ms: times[0], max_ms: times[9] });
    }
  }
});
