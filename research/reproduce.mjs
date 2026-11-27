import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { DEFAULTS, earlyCleavage, exportCSV, socketExperiment } from '../docs/model.mjs';

const path = process.argv[2];
if (path) await mkdir(path, { recursive: true });
const fixed = value => (100 * value).toFixed(2);

console.log('rate ratio | virtual pairs | early relaxed % | early stretched % | continued cleaved % | retreat cleaved % | continued peak % of intact | retreat peak % of intact | paired peak difference pp | Monte Carlo SE pp');
for (const rateRatio of [0.5, 1, 2]) {
  const settings = { ...DEFAULTS, rateRatio };
  const early = earlyCleavage(settings);
  const socket = socketExperiment(settings);
  const results = [
    early.relaxed, early.stretched, socket.cleavage.continue, socket.cleavage.backoff,
    socket.peak.continue, socket.peak.backoff, socket.peak.difference, socket.peak.monteCarloSE,
  ];
  console.log([rateRatio, settings.replicates, ...results.map(fixed)].join(' | '));
  if (path) await writeFile(resolve(path, `rate-ratio-${rateRatio}.csv`), exportCSV(early, socket));
}
