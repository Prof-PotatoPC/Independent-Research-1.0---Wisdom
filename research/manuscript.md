# Strain-dependent collagen cleavage and event-triggered retreat in a virtual tooth socket

**Working manuscript · Computational feasibility study · November 26, 2026**

## Abstract

Tooth extraction force fell after collagenase treatment in excised porcine jaws, but the dependence of this result on periodontal ligament strain during treatment remains unresolved. We developed a browser-based model coupling a fixed-strain cleavage comparison with a synthetic tooth socket. The socket compared continued actuator advance with a retreat triggered by a simulated force drop, followed by the same displacement-controlled pull. Across 40 matched virtual sockets per scenario, the retreat reduced peak force by 2.76 percentage points of the intact peak when the assumed cleavage rate at 4% strain was half the relaxed rate. Retreat increased peak force by 6.75 percentage points when the assumed rate doubled. The strain-independent scenario produced identical cleavage and final peaks between arms. The simulations quantify the consequences of alternative rate laws under specified mechanics. The rate law for native periodontal ligament remains to be measured.

## Introduction

The periodontal ligament (PDL) connects the tooth root to the alveolar socket. Enzyme-assisted extraction experiments in porcine jaws recorded a mean reduction of about 20% in peak extraction force with collagenase G (ColG) versus buffer, with effects reaching about 50% in some paired comparisons. The follow-up compared two enzyme variants. Neither experiment imposed matched strain levels during the treatment interval. Separately, a single-molecule assay found that tensile force slowed cleavage of recombinant human type I collagen with bacterial collagenase, whereas experiments in other collagen systems reported context-dependent effects. [Tohar et al.](https://doi.org/10.3390/jfb13020076) · [Ansbacher et al.](https://doi.org/10.1186/s13036-023-00366-4) · [Camp et al.](https://doi.org/10.1021/ja110098b) · [Mansoor et al.](https://doi.org/10.1016/j.actbio.2026.01.056)

Our computational objective was to test whether an assumed strain–cleavage relationship could produce directionally different results from the same feedback controller. The feedback hypothesis was that removal of loaded fibers changes the strain carried by survivors and that a motor retreat alters their subsequent exposure to strain.

## Methods

### Matched fixed-strain comparison

We held idealized samples at zero imposed strain and 4% strain. The normalized time variable was the relaxed effective cleavage rate multiplied by elapsed time. For the relaxed sample the expected fraction cleaved was `1 − exp(−t)`. For the stretched sample it was `1 − exp(−r × t)`, with `r` set to 0.5, 1 or 2. The example observation time was 0.05, keeping all three scenarios below the preselected 10% cleavage threshold. No-enzyme cleavage is zero in the model. The selected ratios are illustrative and were specified without fitting any tooth data.

### Conditioning and final pull

For fiber `i`, local tensile strain was `εᵢ = max(0, aᵢx − sᵢ)`, where `x` is virtual tooth displacement, `aᵢ` is its fiber projection, and `sᵢ` is initial slack. The contribution to axial force was `aᵢ kᵢ εᵢ`. Fibers were independently drawn with slack from 0 to 0.023, projection 0.48 to 1, stiffness 0.65 to 1.35 divided by 72, and failure strain 0.062 to 0.126. All are model quantities. During conditioning the tooth position satisfied the equilibrium of the total ligament tension with a finite-stiffness actuator spring. The command advanced from 0.041 to 0.071 over one model interval, with actuator stiffness 12.

We set each fiber's normalized instantaneous cleavage rate to `0.40 × exp(log(r) × εᵢ/0.04)`. Thus the chosen ratio applies at the specified reference stretch. Integrated hazard was compared against a per-fiber exponential threshold to generate cleavage events. Both arms shared the same random geometry and thresholds within a pair. Conditioning used 240 time steps, a starting seed of 23, and 40 paired replicates per scenario. Enzymatic and mechanical failures were tracked separately.

The retreat arm triggered when computed force fell by at least `0.004/72` model force units within a step at fixed actuator command. The next step applied a retreat of up to 0.025 displacement units, returning linearly toward the unmodified schedule over 0.12 conditioning-time units from the last trigger. This threshold represents an ideal detector. The continued-advance arm followed the unmodified schedule. After conditioning, cleavage stopped and both arms underwent a root-controlled ramp from zero displacement. Peak force was evaluated at the failure thresholds and divided by the intact peak for the same virtual socket. Paired differences were averaged. Monte Carlo standard error describes instability across sampled sockets within the model.

## Results

The differences in this table are retreat minus continued advance. The force endpoint is normalized within each pair to the same intact socket. Values are generated by the reproducibility script.

| Stretched / relaxed cleavage rate | Early relaxed cleavage | Early stretched cleavage | Continued / retreat socket cleavage | Continued / retreat final peak (% of intact) | Paired final-peak difference (pp) | Monte Carlo SE (pp) |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 0.5 | 4.88% | 2.47% | 23.13% / 25.94% | 78.74% / 75.99% | −2.76 | 0.43 |
| 1.0 | 4.88% | 4.88% | 33.89% / 33.89% | 67.44% / 67.44% | 0.00 | 0.00 |
| 2.0 | 4.88% | 9.52% | 49.65% / 42.88% | 50.08% / 56.84% | +6.75 | 0.58 |

Under the default geometry and exposure, zero enzyme exposure preserved both sockets. Zero retreat left both arms identical. The strain-independent case had identical cleavage and final peaks even though its feedback arm still detected force drops and retreated. Doubling the time resolution in the default slower-under-stretch scenario shifted both paired effects by less than one percentage point. [Model verification](../tests/model.test.mjs)

## Discussion

The fixed-strain stage illustrates how an early breakdown measurement can distinguish candidate rates in a suitably controlled experiment. In the synthetic socket, lowering strain with retreat enhanced cleavage when stretch was assumed to protect collagen. When stretch was assumed to accelerate cleavage, retreat preserved more of the fibers and raised the final peak. The reversal provides a conditional prediction about how controller behavior depends on the sign of the underlying response.

The current model represents collagen degradation as removal of an entire load-bearing fiber and omits partial damage, diffusion, viscoelasticity, friction and rotation. Those mechanisms could change measured force and the feedback effect. The selected kinetic scenarios and mechanical thresholds have no PDL-specific calibration. The results concern dimensionless virtual sockets. They do not estimate human benefit, demonstrate biochemical causality, or quantify the variability observed in the porcine dental studies. An experiment-specific kinetic fit using published measurements is the next step that can be done with public data. A full dental interpretation would need validation for the relevant enzyme, native ligament and loading history. [Source review and model extensions](simulation-research.md)

## Data and code availability

The browser model, checks, and reproducibility script are in this repository. The simulation inputs are synthetic, and generated files can be reproduced from the documented seed and parameters.

```bash
node --test tests/model.test.mjs
node research/reproduce.mjs results
```
