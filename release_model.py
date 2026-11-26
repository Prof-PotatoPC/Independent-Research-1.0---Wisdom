"""Compare peak force and work in a dimensionless, two-population attachment model.

Run with Python 3. Only the standard library is required. The curves represent
a synthetic dental teaching model. No enzyme, patient data or fitted parameters.
"""

from dataclasses import dataclass
from math import isclose
from statistics import mean


@dataclass(frozen=True)
class Case:
    name: str
    first_share: float
    onset_gap: float
    amplitude: float = 1.0


def pulse(displacement):
    """Unit triangular load pulse with support [0, 2] and its peak at 1."""
    return max(0.0, 1.0 - abs(displacement - 1.0))


def force(x, case):
    return case.amplitude * (
        case.first_share * pulse(x)
        + (1.0 - case.first_share) * pulse(x - case.onset_gap)
    )


def metrics(case):
    # A piecewise-linear curve attains its maximum at a corner.
    # Its integral equals the trapezoidal sum over its corners exactly.
    corners = sorted({0.0, 1.0, 2.0, case.onset_gap,
                      1.0 + case.onset_gap, 2.0 + case.onset_gap})
    readings = [(x, force(x, case)) for x in corners]
    peak = max(f for _, f in readings)
    work = sum((x2 - x1) * (f1 + f2) / 2.0
               for (x1, f1), (x2, f2) in zip(readings, readings[1:]))
    return peak, work, corners[-1]


def main():
    cases = [
        Case("Matched control", 0.50, 0.0),
        Case("Both groups carry half the original load", 0.50, 0.0, 0.50),
        Case("Balanced, half-rise delay", 0.50, 0.50),
        Case("Balanced, full-rise delay", 0.50, 1.00),
        Case("70/30 split, full-rise delay", 0.70, 1.00),
    ]
    print("case | relative peak | relative work | release displacement")
    for case in cases:
        peak, work, end = metrics(case)
        print(f"{case.name} | {peak:.3f} | {work:.3f} | {end:.3f}")
        assert isclose(work, case.amplitude)

    # A sensitivity grid with equal weights, not a biological population.
    reductions = []
    for percent in range(30, 71):
        share = percent / 100
        peak, _, _ = metrics(Case("Grid", share, 1.00))
        assert isclose(peak, max(share, 1.0 - share))
        reductions.append(100 * (1 - peak))
    print(f"Equal-weight grid, 30:70 through 70:30, n={len(reductions)}")
    print(f"Mean peak reduction {mean(reductions):.2f}%, "
          f"range {min(reductions):.1f}% to {max(reductions):.1f}%.")


if __name__ == "__main__":
    main()
