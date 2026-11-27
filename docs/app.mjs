import { DEFAULTS, earlyCleavage, exportCSV, socketExperiment } from './model.mjs';

const get = id => document.getElementById(id);
const colors = { main: '#067569', comparison: '#7046ac', baseline: '#5f7180' };
const solid = [];
const dashed = [6, 4];
const dotted = [2, 4];
const percent = value => `${(value * 100).toFixed(1)}%`;
const points = value => `${value > 0 ? '+' : ''}${(value * 100).toFixed(1)} pp`;
const mapping = {
  rateRatio: 'ratio', stretch: 'stretch', earlyTime: 'early-time', dose: 'dose',
  actuatorStiffness: 'actuator', backoff: 'backoff', seed: 'seed', replicates: 'replicates',
};
let current;

function canvasContext(canvas) {
  const rect = canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * scale);
  canvas.height = Math.round(rect.height * scale);
  const context = canvas.getContext('2d');
  context.setTransform(scale, 0, 0, scale, 0, 0);
  return { context, width: rect.width, height: rect.height };
}

function chart(id, series, config) {
  const { context: ctx, width, height } = canvasContext(get(id));
  const { xLabel, yLabel, xMax, yMax, xText, yText } = config;
  const left = 56;
  const right = width - 18;
  const top = 18;
  const bottom = height - 48;
  const x = value => left + (right - left) * value / xMax;
  const y = value => bottom - (bottom - top) * value / yMax;
  const ticks = width < 320 ? 3 : 4;

  ctx.font = '12px system-ui, sans-serif';
  ctx.fillStyle = '#526674';
  ctx.textBaseline = 'middle';
  for (let i = 0; i <= ticks; i += 1) {
    const value = yMax * i / ticks;
    ctx.strokeStyle = '#dbe5e8';
    ctx.beginPath();
    ctx.moveTo(left, y(value));
    ctx.lineTo(right, y(value));
    ctx.stroke();
    ctx.textAlign = 'right';
    ctx.fillText(yText(value), left - 7, y(value));
    ctx.textAlign = 'center';
    ctx.fillText(xText(xMax * i / ticks), x(xMax * i / ticks), bottom + 12);
  }

  ctx.fillStyle = '#334c59';
  ctx.fillText(xLabel, (left + right) / 2, height - 10);
  ctx.save();
  ctx.translate(10, (top + bottom) / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(yLabel, 0, 0);
  ctx.restore();

  for (const item of series) {
    ctx.setLineDash(item.pattern);
    ctx.strokeStyle = item.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    item.values.forEach(([a, b], index) => {
      if (index === 0) ctx.moveTo(x(a), y(b));
      else ctx.lineTo(x(a), y(b));
    });
    ctx.stroke();
  }
}

function drawResults() {
  if (!current) return;
  const { early, socket } = current;
  const first = socket.runs[0];
  chart('early-chart', [
    { values: early.points.map(p => [p.time, p.relaxed]), color: colors.main, pattern: solid },
    { values: early.points.map(p => [p.time, p.stretched]), color: colors.comparison, pattern: dashed },
  ], {
    xLabel: 'Scaled time', yLabel: 'Cleaved fraction', xMax: socket.settings.earlyTime,
    yMax: Math.ceil(Math.max(early.relaxed, early.stretched, .04) * 20) / 20,
    xText: value => value.toFixed(3), yText: value => `${Math.round(value * 100)}%`,
  });

  const treatment = [first.continue.traces.conditioning, first.backoff.traces.conditioning];
  const pull = [first.continue.traces.pull, first.backoff.traces.pull, socket.sample.baseline];
  const drawForce = (id, traces, horizontalKey, xLabel) => {
    const styles = [[colors.main, solid], [colors.comparison, dashed], [colors.baseline, dotted]];
    const series = traces.map((trace, index) => ({
      values: trace.map(point => [point[horizontalKey], point.force]),
      color: styles[index][0], pattern: styles[index][1],
    }));
    chart(id, series, {
      xLabel, yLabel: 'Force (model units)',
      xMax: Math.max(.01, ...series.flatMap(s => s.values.map(([x]) => x))),
      yMax: Math.ceil(Math.max(.002, ...series.flatMap(s => s.values.map(([, y]) => y))) * 500) / 500,
      xText: value => value.toFixed(2), yText: value => value.toFixed(3),
    });
  };
  drawForce('conditioning-chart', treatment, 'time', 'Conditioning time');
  drawForce('pull-chart', pull, 'displacement', 'Displacement (model units)');
  drawSnapshot();
}

function drawSocket(id, point, fibers, color) {
  const { context: ctx, width, height } = canvasContext(get(id));
  const center = width / 2;
  const shift = 390 * point.tooth;
  const halfWidth = Math.min(31, width * .13);
  const rim = halfWidth + 24;
  const points = new Set(point.alive);

  ctx.strokeStyle = '#7c929e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(center - rim, 25);
  ctx.lineTo(center - rim, height - 37);
  ctx.quadraticCurveTo(center - rim, height - 10, center, height - 10);
  ctx.quadraticCurveTo(center + rim, height - 10, center + rim, height - 37);
  ctx.lineTo(center + rim, 25);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(center - halfWidth, 31 - shift);
  ctx.lineTo(center - halfWidth, height - 52 - shift);
  ctx.quadraticCurveTo(center - halfWidth, height - 32 - shift, center, height - 32 - shift);
  ctx.quadraticCurveTo(center + halfWidth, height - 32 - shift, center + halfWidth, height - 52 - shift);
  ctx.lineTo(center + halfWidth, 31 - shift);
  ctx.closePath();
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.lineWidth = 1.7;
  ctx.stroke();

  fibers.forEach(fiber => {
    const side = fiber.index % 2 === 0 ? -1 : 1;
    const anchorY = 29 + Math.floor(fiber.index / 2) * (height - 70) / 35;
    const alive = points.has(fiber.index);
    ctx.beginPath();
    ctx.moveTo(center + side * rim, anchorY);
    ctx.lineTo(center + side * halfWidth, anchorY + 10 * fiber.projection - shift);
    ctx.strokeStyle = alive ? color : '#a6b5bd';
    ctx.globalAlpha = alive ? .62 : .38;
    ctx.lineWidth = 1;
    ctx.setLineDash(alive ? solid : dotted);
    ctx.stroke();
  });
  ctx.globalAlpha = 1;
  ctx.setLineDash(solid);
  ctx.fillStyle = '#405965';
  ctx.font = '12px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${point.alive.length} intact fibers · ${point.retreats} retreats`, center, height - 16);
  get(id).setAttribute('aria-label', `${point.alive.length} intact fibers and ${point.retreats} retreats at time ${point.time.toFixed(2)}`);
}

function drawSnapshot() {
  if (!current) return;
  const { socket } = current;
  const { continue: continued, backoff } = socket.runs[0];
  const index = Math.round(get('snapshot').valueAsNumber / 100 * (continued.traces.conditioning.length - 1));
  const a = continued.traces.conditioning[index];
  const b = backoff.traces.conditioning[index];
  get('snapshot-time').textContent = `t = ${a.time.toFixed(2)}`;
  drawSocket('continue-fixture', a, socket.sample.fibers, colors.main);
  drawSocket('backoff-fixture', b, socket.sample.fibers, colors.comparison);
}

function run() {
  const settings = { ...DEFAULTS };
  for (const [key, id] of Object.entries(mapping)) settings[key] = get(id).valueAsNumber;
  settings.stretch /= 100;
  const early = earlyCleavage(settings);
  const socket = socketExperiment(settings);
  current = { early, socket };
  get('relaxed').textContent = percent(early.relaxed);
  get('stretched').textContent = percent(early.stretched);
  get('early-delta').textContent = points(early.difference);
  get('early-warning').hidden = early.earlyLimit;
  get('continue-peak').textContent = percent(socket.peak.continue);
  get('backoff-peak').textContent = percent(socket.peak.backoff);
  get('peak-delta').textContent = points(socket.peak.difference);
  get('socket-summary').textContent = `Across ${settings.replicates} paired virtual sockets, cleavage averaged ${percent(socket.cleavage.continue)} with continued pulling and ${percent(socket.cleavage.backoff)} with retreat. The retreat arm averaged ${socket.releases.backoff.toFixed(1)} detected releases.`;
  get('status').textContent = 'Comparison updated.';
  get('run').disabled = false;
  get('export').disabled = false;
  get('results').setAttribute('aria-busy', 'false');
  drawResults();
}

function scheduleRun() {
  get('status').textContent = 'Running paired simulations…';
  get('run').disabled = true;
  get('export').disabled = true;
  get('results').setAttribute('aria-busy', 'true');
  requestAnimationFrame(() => setTimeout(run, 0));
}

get('settings').addEventListener('submit', event => {
  event.preventDefault();
  scheduleRun();
});
get('scenario').addEventListener('change', event => {
  if (event.target.value !== 'custom') get('ratio').value = event.target.value;
});
get('ratio').addEventListener('input', event => {
  const selected = String(event.target.valueAsNumber);
  get('scenario').value = ['0.5', '1', '2'].includes(selected) ? selected : 'custom';
});
get('snapshot').addEventListener('input', drawSnapshot);
get('export').addEventListener('click', () => {
  const csv = exportCSV(current.early, current.socket);
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'ligament-simulation.csv';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
const chartObserver = new ResizeObserver(drawResults);
for (const node of document.querySelectorAll('.chart')) chartObserver.observe(node);
scheduleRun();
