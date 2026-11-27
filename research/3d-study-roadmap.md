# Does unloading a tooth ligament change collagen cleavage and extraction force?

**Study roadmap · November 26, 2026 · Planning document**

**Question 1.** With the same collagenase G (ColG), collagen substrate, and local enzyme exposure, does stretching periodontal ligament collagen change how quickly it is cut?

**Question 2.** After an attachment gives way, does briefly moving the tooth back toward the socket reduce the peak force required in a later, standardized pull?

For a first hypothesis, test whether **moderate, sustained stretch protects an intact collagen fibril**. Give the tension-independent hypothesis equal scrutiny. A tooth ligament contains fibers at different stretches and orientations, and a motor retreat changes the loading history. Experiments on other tissues suggest the direction could change with loading regime. This makes the 3D spatial prediction scientifically interesting even if the dental cleavage law remains unresolved.

**How to use this plan.** Start with Task 1. Each row below leads to a copy-ready prompt with inputs, a deliverable, and a completion check. Tasks 1–4 can form a stand-alone public-data project before building a 3D solver. The existing browser prototype is a worked example of assumptions; its simulated outcomes supply no empirical observations for this study. [Execution prompts](3d-study-prompts.md) · [Earlier resource inventory](simulation-research.md)

In this plan, **strain** is fractional change in length, **tension** is pulling force, and **cleavage** is an enzyme cutting collagen. The target ligament is the thin tissue connecting a tooth root to the socket wall.

## Which rule has experimental support?

| Evidence | What was actually compared | Implication for the proposed study |
| --- | --- | --- |
| **Dental enzyme in a tooth socket.** Tohar et al. | In paired porcine premolar roots, peak extraction force fell about 20% on average after ColG treatment and by up to about 50% in some comparisons. The authors varied treatment and measured the pull after incubation. | This anchors the dental endpoint. A peak force measured after exposure cannot tell us the early cleavage rate at a specified fiber strain. [Article and Figure 4](https://pmc.ncbi.nlm.nih.gov/articles/PMC9225053/#jfb-13-00076-f004) |
| **Stretch slowed molecular cleavage.** Camp et al. | With recombinant human type I collagen and bacterial collagenase, fitted rates were about 0.05 s⁻¹ unloaded and 0.005 s⁻¹ for the slow component at both 3.6 and 9.4 pN. Loaded curves also had an initial fast component. | Supports protection in that assay. Comparing the slow component with the initial slope of a different assay would mix observables. [Results and Figure 4](https://pmc.ncbi.nlm.nih.gov/articles/PMC3299535/#F4) |
| **Stretch had little measurable effect on molecular cleavage.** Adhikari, Glassey and Dunn | With full-length heterotrimeric type I collagen and crude clostridial collagenase, the cleavage curves changed little from roughly 0.25 to 15 pN. The same paper found strong force sensitivity with human MMP-1. | The bacterial-enzyme result makes the no-effect model a serious alternative. Enzyme preparation, substrate, and the lowest tested load matter when comparing it with Camp. [Article, Figure 2b and bacterial collagenase results](https://pmc.ncbi.nlm.nih.gov/articles/PMC4800024/) |
| **Stretch protected native fibrils.** Flynn, Tilburey and Ruberti | In bovine type I fibrils with bacterial collagenase A, estimated early radial erosion magnitudes were 0.116 nm/s unloaded and 0.027 nm/s at low load. The rates were inferred from stiffness measurements, with three fibrils per loading group. | A loaded-to-unloaded ratio of about 0.23 makes protection a plausible fibril-scale starting hypothesis. Erosion has different units and a different relationship to cleavage than a molecular cutting rate. [Fibril measurements and analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC3773243/) |
| **Tissue response depended on the test.** Mansoor et al. and the bovine lung fiber study | An intermediate static strain gave greatest apparent protection in decellularized pig tendons. Cyclic stretch accelerated degradation relative to comparable static loading. Bacterial collagenase produced greater modulus loss in loaded bovine lung fibers than in unloaded fibers. | Include a nonmonotone alternative when several static strains are available. Analyze cyclic conditions separately. Changes in stiffness can include mechanical damage and fluid or enzyme transport. [Tendon study](https://doi.org/10.1016/j.actbio.2026.01.056) · [Lung fiber study](https://doi.org/10.1038/s41598-024-77704-z) |
| **Closest studies on the relevant biology.** Human PDL cells, rat PDL, purified ColG on fibrils | Human PDL cells resorbed their collagen matrix more readily after tension was released. Rat ligament responded differently to mechanical testing after collagenase treatment. Imaging showed ColG moving along and degrading fibrils. | These establish distinct parts of the proposed mechanism. None measures external ColG cleavage in native human PDL under a matched series of imposed strains. The two PDL records here were checked at abstract level. [Human cell study](https://pubmed.ncbi.nlm.nih.gov/12941067/) · [Rat tissue study](https://pubmed.ncbi.nlm.nih.gov/17266965/) · [ColG imaging](https://pmc.ncbi.nlm.nih.gov/articles/PMC4931465/) |

**Search scope.** Firecrawl web and paper-index searches covered native PDL under load during digestion, dental ColG extraction experiments, clostridial collagenase at controlled force, strain-dependent degradation models, dental extraction with release-triggered retreat, and human fiber architecture. The searches returned adjacent studies and the porcine extraction papers. I did not locate a direct native human PDL/ColG comparison or a dental experiment comparing release-triggered retreat with continued advance during ColG exposure followed by a matched pull. This is a targeted literature finding. Unpublished or unindexed data could change it.

## What mathematics can establish now

### Question 1 · Use published measurements to challenge the rate law

Let **R** be the early cutting rate in the stretched sample divided by the rate in its matched relaxed sample. R below 1 favors protection, R near 1 favors little change, and R above 1 favors acceleration. Estimate R within each comparable assay. Define “near 1” by a predeclared, scientifically meaningful equivalence range and the measurement precision. A noisy estimate that spans 1 can leave all three possibilities open.

The Bell relation links a change in the pulling force on a molecule to a change in its effective cutting rate.

$$
\frac{k(f_2)}{k(f_1)}=\exp\!\left(\frac{(f_2-f_1)\Delta x^\ddagger}{k_B T}\right).
$$

Here molecular force is in pN, the signed distance parameter in nm, and thermal energy in pN·nm. The sign of the distance parameter comes from fitting data over a stated range. The equation alone permits all three signs. For constant effective cleavage rate, a simple single-event survival model gives an intact fraction of $S(t)=\exp(-kt)$. A no-enzyme control estimates spontaneous loss of the signal. [Published force-dependent analysis and controls](https://pmc.ncbi.nlm.nih.gov/articles/PMC4800024/)

**A check you can do on paper.** Fit a constant log-slope through Camp's approximate unloaded rate and the 3.6 pN slow-component rate. Their ratio is 0.10. At 9.4 pN that fit predicts $R=0.10^{9.4/3.6}\approx0.00245$. The reported slow-component ratio is still about 0.10. The discrepancy is large enough to justify testing a response that levels off. This hand calculation uses rounded published estimates from one assay. It identifies a weakness in a one-slope model. Independent validation and transfer to a tooth are still open. [Camp et al., results](https://pmc.ncbi.nlm.nih.gov/articles/PMC3299535/)

**At the tissue scale**, a useful published model treats strain energy as increasing the barrier to degradation. One candidate is $k(W)=k_0\exp(-W/W_c)$, where local fiber strain energy density $W$ and the characteristic energy density $W_c$ have the same units. Protection is built into this expression. Compare it with a constant-rate law and an accelerating alternative over the observed range. Estimate a nonmonotone law only with enough loading levels. Keep a distinct observation model for molecular survival, fibril radius, and bulk mechanical response. Converting percentage ligament strain into force per collagen molecule requires an independently justified load-sharing model. [Micromechanical model](https://doi.org/10.1016/j.bpj.2015.10.051) · [Strain-controlled tendon measurements](https://pmc.ncbi.nlm.nih.gov/articles/PMC2766525/)

### Question 2 · Derive when a retreat actually unloads surviving fibers

Consider $N\ge2$ identical parallel fibers, each a taut linear spring of stiffness $k$, connected in series to an actuator spring of stiffness $K$. The initial motor displacement is $u>0$ and equilibrium gives the fiber extension $x=Ku/(K+Nk)$. Immediately after one fiber breaks, hold the motor command fixed. The extension of each survivor rises to $Ku/[K+(N-1)k]$. If the motor retreats by distance $d$, survivor extension falls **below its pre-cut value** exactly when

$$
d>\frac{uk}{K+Nk}.
$$

This is a conditional mathematical result under the stated geometry and quasi-static assumptions. It gives an exact test for the future solver and illustrates why sensing a force drop does not by itself establish unloading. Whether unloading causes extra cleavage, which regions unload when the tooth rotates, and whether the final pull becomes easier are separate predictions.

For the socket question, define the primary outcome for each matched pair as $\Delta F_{\rm peak}=F_{\rm peak,retreat}-F_{\rm peak,continue}$ during the common final pull. Negative values favor retreat on this endpoint. Also report total mechanical work, the highest force across **both** stages, and any teeth already released during conditioning. Pairing the full procedure with these outcomes prevents a lower final peak from concealing work or failure that happened earlier.

## Task list for a 3D study

| Order | Task | Deliverable and decision |
| --- | --- | --- |
| [1](3d-study-prompts.md#task-1) | Specify both experiments in plain language | A protocol with comparison arms, endpoints, units, controls and a dated calibration/validation split. |
| [2](3d-study-prompts.md#task-2) | Assemble primary measurements | A source ledger, reproducible digitization records where needed, and an explicit inventory of missing dental data. |
| [3](3d-study-prompts.md#task-3) | Estimate and compare cleavage laws | Within-assay rate ratios, uncertainty and held-out comparisons. The conclusion can be “the target PDL law is unidentified.” |
| [4](3d-study-prompts.md#task-4) | Test load sharing on paper | Analytical predictions for force hold, displacement hold, and a compliant actuator retreat. An independent reviewer can check the signs and limits. |
| [5](3d-study-prompts.md#task-5) | Build a traceable anatomical reference | A licensed tooth, ligament and bone mesh with named regions, defined fiber directions and documented missing anatomy. |
| [6](3d-study-prompts.md#task-6) | Establish intact socket mechanics | A converged 3D finite element model tested against intact loading curves or distributions, with the species and loading rate recorded. |
| [7](3d-study-prompts.md#task-7) | Couple cleavage, fiber damage and loading | Local histories of strain, enzyme exposure, collagen integrity and mechanical failure. Reproduce the fixed-strain experiment before activating feedback. |
| [8](3d-study-prompts.md#task-8) | Compare continuing and backing off | A paired controller experiment with a common final pull, a no-enzyme arm, and a replay control for retreat timing. |
| [9](3d-study-prompts.md#task-9) | Quantify robustness and external agreement | A map of where each prediction holds, changes sign, or cannot be distinguished from numerical or measurement uncertainty. |
| [10](3d-study-prompts.md#task-10) | Make the 3D visual simulation | A synchronized interactive view of the actual solver data, including cutaway anatomy, local strain and damage, force traces, and event replay. |
| [11](3d-study-prompts.md#task-11) | Prepare an expert-reviewable release | A reproducible computational paper with evidence provenance, equations, validation failures, and one-click access to archived examples. |

**Scope for the anatomy.** Start with a human single-rooted tooth to isolate the mechanism. A public CC BY 4.0 mandibular dataset includes teeth 37–47 and ligament shells generated by 0.25 mm radial extrusion. It omits the third molars. Human anterior-tooth measurements support regional variation in ligament fiber content and strength. A wisdom-tooth extension would need a verified third-molar root and matching socket geometry, with eruption or impaction status specified. [Mandibular geometry and license](https://doi.org/10.17632/97c3pf8h2h.1) · [Human PDL architecture study, abstract](https://pubmed.ncbi.nlm.nih.gov/39299626/) · [Human incisor PDL tensile data](https://pmc.ncbi.nlm.nih.gov/articles/PMC6251174/)

**What earns a claim in the eventual paper.** Published cleavage curves can support an assay-specific rate law. A verified, mechanically validated socket can predict how retreat affects extraction under that law. Agreement with independent cleavage measurements in the target PDL/ColG system would support transferring the biological conclusion to that tissue. The practical outcome with today's public evidence may be a bounded dental prediction plus a precise description of what measurement would distinguish the remaining possibilities. [Swine extraction and force-hold validation study](https://pmc.ncbi.nlm.nih.gov/articles/PMC11745890/) · [Human vertical extraction measurements, abstract](https://pubmed.ncbi.nlm.nih.gov/32279853/)
