import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DEFAULTS, earlyCleavage, exportCSV, socketExperiment } from '../docs/model.mjs';

test('matched early samples agree exactly under the null', () => {
  const result = earlyCleavage({ ...DEFAULTS, rateRatio: 1 });
  assert.equal(result.difference, 0);
  assert.equal(result.relaxed, -Math.expm1(-DEFAULTS.earlyTime));
  assert.ok(result.points.every(point => point.relaxed === point.stretched));
});

test('early comparison follows the assumed rate direction and flags excess cleavage', () => {
  assert.ok(earlyCleavage(DEFAULTS).difference < 0);
  const fast = earlyCleavage({ ...DEFAULTS, rateRatio: 2 });
  assert.ok(fast.difference > 0);
  assert.equal(fast.earlyLimit, true);
  assert.equal(earlyCleavage({ ...DEFAULTS, rateRatio: 4 }).earlyLimit, false);
});

test('tension-independent cleavage is matched even when the motor retreats', () => {
  const result = socketExperiment({ rateRatio: 1, replicates: 8 });
  assert.ok(result.releases.backoff > 0);
  assert.equal(result.cleavage.difference, 0);
  assert.equal(result.peak.difference, 0);
});

test('a zero retreat gives matched arms even for a strain-dependent rate', () => {
  const result = socketExperiment({ rateRatio: 2, backoff: 0, replicates: 8 });
  assert.equal(result.cleavage.difference, 0);
  assert.equal(result.peak.difference, 0);
  assert.equal(result.releases.backoff, 0);
});

test('zero exposure leaves both default sockets intact', () => {
  const result = socketExperiment({ dose: 0, replicates: 8 });
  assert.equal(result.cleavage.continue, 0);
  assert.equal(result.cleavage.backoff, 0);
  assert.equal(result.peak.continue, 1);
  assert.equal(result.peak.backoff, 1);
  assert.equal(result.releases.backoff, 0);
});

test('default opposite scenarios reverse the predicted peak-force change', () => {
  assert.ok(socketExperiment().peak.difference < 0);
  assert.ok(socketExperiment({ rateRatio: 2 }).peak.difference > 0);
});

test('doubling the time resolution preserves the default paired effect within 1 percentage point', () => {
  const coarse = socketExperiment();
  const fine = socketExperiment({ steps: 480 });
  assert.ok(Math.abs(coarse.peak.difference - fine.peak.difference) < 0.01);
  assert.ok(Math.abs(coarse.cleavage.difference - fine.cleavage.difference) < 0.01);
});

test('the paired simulation is deterministic and exported rows retain settings and units', () => {
  const settings = { ...DEFAULTS, replicates: 4 };
  const first = socketExperiment(settings);
  assert.deepEqual(first, socketExperiment(settings));
  const [header, ...rows] = exportCSV(earlyCleavage(settings), first).trimEnd().split('\n');
  const columns = header.split(',');
  assert.ok(columns.includes('final_force_units') && columns.includes('rateRatio'));
  assert.ok(rows.every(row => row.split(',').length === columns.length));
  assert.equal(rows.filter(row => row.startsWith('1.0.0,paired_run,')).length, 8);
  assert.equal(Math.max(...first.sample.baseline.map(point => point.force)) > 0, true);
  for (const arm of ['continue', 'backoff']) {
    const run = first.runs[0][arm];
    assert.ok(run.traces.pull.every(({ displacement }, i, arr) => i === 0 || displacement >= arr[i - 1].displacement));
    assert.ok(Math.abs(Math.max(...run.traces.pull.map(point => point.force)) / Math.max(...first.sample.baseline.map(point => point.force)) - run.normalizedPeak) < 1e-12);
  }
});
