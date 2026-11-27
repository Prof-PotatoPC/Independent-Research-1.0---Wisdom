export const MODEL_VERSION = '1.0.0';

export const DEFAULTS = Object.freeze({
  rateRatio: 0.5, stretch: 0.04, earlyTime: 0.05, dose: 0.40,
  actuatorStiffness: 12, backoff: 0.025, seed: 23, replicates: 40, steps: 240,
});

const FIBERS = 72;
const HOLD = 0.12;
const TRIGGER = 0.004;
const SAMPLES = 60;

function probability(hazard) {
  return -Math.expm1(-hazard);
}

export function earlyCleavage({ rateRatio, earlyTime }) {
  const points = Array.from({ length: SAMPLES + 1 }, (_, index) => {
    const time = earlyTime * index / SAMPLES;
    return { time, relaxed: probability(time), stretched: probability(time * rateRatio) };
  });
  const last = points.at(-1);
  return {
    points,
    relaxed: last.relaxed,
    stretched: last.stretched,
    difference: last.stretched - last.relaxed,
    earlyLimit: Math.max(last.relaxed, last.stretched) <= 0.10,
  };
}

function makeFibers(seed) {
  let state = seed >>> 0;
  function uniform() {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return (state + 0.5) / 4294967296;
  }
  return Array.from({ length: FIBERS }, (_, index) => ({
    index,
    slack: 0.023 * uniform(),
    projection: 0.48 + 0.52 * uniform(),
    stiffness: (0.65 + 0.70 * uniform()) / FIBERS,
    failure: 0.062 + 0.064 * uniform(),
    budget: -Math.log(uniform()),
  }));
}

function strainAt(fiber, tooth) {
  return Math.max(0, fiber.projection * tooth - fiber.slack);
}

function ligamentForce(fibers, tooth) {
  let force = 0;
  for (const fiber of fibers) {
    force += fiber.projection * fiber.stiffness * strainAt(fiber, tooth);
  }
  return force;
}

function equilibrate(fibers, command, actuatorStiffness) {
  let low = 0;
  let high = command;
  for (let iteration = 0; iteration < 30; iteration += 1) {
    const x = (low + high) / 2;
    if (ligamentForce(fibers, x) < actuatorStiffness * (command - x)) low = x;
    else high = x;
  }
  const tooth = (low + high) / 2;
  return { tooth, force: ligamentForce(fibers, tooth) };
}

function tracePoint(time, fibers, readings, command, retreats, mechanical, capture) {
  return {
    time, command, tooth: readings.tooth, force: readings.force, retreats,
    mechanical: mechanical / FIBERS,
    cleaved: (FIBERS - fibers.length - mechanical) / FIBERS,
    alive: capture ? fibers.map(fiber => fiber.index) : undefined,
  };
}

function condition(original, settings, feedback, capture) {
  const { dose, rateRatio, stretch, actuatorStiffness, backoff, steps } = settings;
  let fibers = original.map(fiber => ({ ...fiber, cumulative: 0 }));
  let releases = 0;
  let mechanical = 0;
  let lastTrigger = -Infinity;
  const delta = 1 / steps;
  const coefficient = Math.log(rateRatio) / stretch;
  const points = [];

  for (let index = 0; index <= steps; index += 1) {
    const time = index * delta;
    const remaining = Math.max(0, 1 - (time - lastTrigger) / HOLD);
    const retreat = feedback ? backoff * remaining : 0;
    const command = Math.max(0, 0.041 + 0.030 * time - retreat);
    let state = equilibrate(fibers, command, actuatorStiffness);

    if (index > 0) {
      const preCutForce = state.force;
      fibers = fibers.filter(fiber => {
        // The exponential waiting budget is shared across both controller arms.
        fiber.cumulative += dose * delta * Math.exp(coefficient * strainAt(fiber, state.tooth));
        return fiber.cumulative < fiber.budget;
      });
      state = equilibrate(fibers, command, actuatorStiffness);
      // Resolve any immediate mechanical cascade at the same command.
      while (true) {
        const surviving = fibers.filter(fiber => strainAt(fiber, state.tooth) < fiber.failure);
        if (surviving.length === fibers.length) break;
        mechanical += fibers.length - surviving.length;
        fibers = surviving;
        state = equilibrate(fibers, command, actuatorStiffness);
      }
      if (feedback && backoff > 0 && preCutForce - state.force >= TRIGGER / FIBERS) {
        releases += 1;
        lastTrigger = time;
      }
    }
    if (capture && (index % Math.max(1, Math.floor(steps / SAMPLES)) === 0 || index === steps)) {
      points.push(tracePoint(time, fibers, state, command, releases, mechanical, true));
    }
  }
  return {
    fibers, points, releases, mechanical: mechanical / FIBERS,
    cleaved: (FIBERS - fibers.length - mechanical) / FIBERS,
  };
}

function finalPull(fibers, capture) {
  const sorted = fibers
    .map(fiber => ({ fiber, end: (fiber.slack + fiber.failure) / fiber.projection }))
    .sort((a, b) => a.end - b.end);
  const contacts = capture
    ? fibers.map(fiber => fiber.slack / fiber.projection).sort((a, b) => a - b)
    : [];
  let nextContact = 0;
  let survivors = [...fibers];
  let peak = 0;
  const points = capture ? [{ displacement: 0, force: 0 }] : [];
  for (const { fiber, end } of sorted) {
    while (nextContact < contacts.length && contacts[nextContact] < end) {
      const displacement = contacts[nextContact++];
      points.push({ displacement, force: ligamentForce(survivors, displacement) });
    }
    const force = ligamentForce(survivors, end);
    peak = Math.max(peak, force);
    survivors = survivors.filter(candidate => candidate.index !== fiber.index);
    if (capture) {
      points.push({ displacement: end, force });
      points.push({ displacement: end, force: ligamentForce(survivors, end) });
    }
  }
  return { peak, points };
}

function mean(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function summarize(runs, key) {
  const pairs = runs.map(run => run.backoff[key] - run.continue[key]);
  const avg = mean(pairs);
  const sd = pairs.length > 1
    ? Math.sqrt(pairs.reduce((sum, pair) => sum + (pair - avg) ** 2, 0) / (pairs.length - 1))
    : 0;
  return {
    continue: mean(runs.map(run => run.continue[key])),
    backoff: mean(runs.map(run => run.backoff[key])),
    difference: avg,
    monteCarloSE: sd / Math.sqrt(pairs.length),
  };
}

function runArm(fibers, settings, feedback, baseline, capture) {
  const conditioning = condition(fibers, settings, feedback, capture);
  const pull = finalPull(conditioning.fibers, capture);
  return {
    cleaved: conditioning.cleaved,
    mechanical: conditioning.mechanical,
    releases: conditioning.releases,
    normalizedPeak: pull.peak / baseline.peak,
    traces: capture ? { conditioning: conditioning.points, pull: pull.points } : undefined,
  };
}

export function socketExperiment(options = {}) {
  const settings = { ...DEFAULTS, ...options };
  const runs = [];
  let sample;
  for (let index = 0; index < settings.replicates; index += 1) {
    const seed = (settings.seed + Math.imul(index, 0x9e3779b9)) >>> 0;
    const fibers = makeFibers(seed);
    const capture = index === 0;
    const baseline = finalPull(fibers, capture);
    const continued = runArm(fibers, settings, false, baseline, capture);
    const backoff = runArm(fibers, settings, true, baseline, capture);
    runs.push({ seed, continue: continued, backoff });
    if (capture) sample = { baseline: baseline.points, fibers };
  }
  return {
    settings, runs, sample,
    cleavage: summarize(runs, 'cleaved'),
    peak: summarize(runs, 'normalizedPeak'),
    releases: summarize(runs, 'releases'),
  };
}

export function exportCSV(early, result) {
  const settings = result.settings;
  const parameters = Object.keys(settings);
  const header = [
    'model_version', 'series', 'program', 'seed', 'time', 'displacement',
    'treatment_force_units', 'final_force_units', 'cleaved_fraction',
    'mechanical_fraction', 'controller_releases', 'peak_over_intact', ...parameters,
  ];
  const rows = [header];
  function add(series, program, seed, values) {
    rows.push([MODEL_VERSION, series, program, seed, ...values, ...parameters.map(key => settings[key])]);
  }
  for (const point of early.points) {
    add('early', 'relaxed', '', [point.time, '', '', '', point.relaxed, '', '', '']);
    add('early', 'stretched', '', [point.time, '', '', '', point.stretched, '', '', '']);
  }
  for (const run of result.runs) {
    for (const program of ['continue', 'backoff']) {
      const arm = run[program];
      add('paired_run', program, run.seed, ['', '', '', '', arm.cleaved, arm.mechanical, arm.releases, arm.normalizedPeak]);
      for (const point of arm.traces?.conditioning ?? []) {
        add('conditioning', program, run.seed, [point.time, point.tooth, point.force, '', point.cleaved, point.mechanical, point.retreats, '']);
        add('actuator_command', program, run.seed, [point.time, point.command, '', '', '', '', '', '']);
      }
      for (const point of arm.traces?.pull ?? []) {
        add('final_pull', program, run.seed, ['', point.displacement, '', point.force, '', '', '', '']);
      }
    }
  }
  for (const point of result.sample.baseline) {
    add('final_pull', 'intact', result.runs[0].seed, ['', point.displacement, '', point.force, '', '', '', '']);
  }
  return rows.map(row => row.join(',')).join('\n') + '\n';
}
