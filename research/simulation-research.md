# Ligament strain, collagen cleavage, and extraction mechanics

Firecrawl literature and resource search completed November 26, 2026. This is a targeted review of direct cleavage experiments, fiber and tissue studies, dental biomechanics, and public modeling assets.

[Read the manuscript draft](manuscript.md) · [Open the simulator source](../docs/index.html) · [Reproduce the results](#reproduce-the-model)

## Research question

**How would plausible strain–cleavage relationships change early collagen breakdown and the final pull force of a synthetic tooth socket?**

The biological question is whether the effective cleavage rate changes when native periodontal ligament (PDL) is stretched during exposure to the collagenase used in the dental work. The computational question is what that relationship would imply if it existed. The search found direct evidence for strain- or force-dependent cleavage in some collagen systems and force reduction after collagenase treatment in porcine jaws. It found no direct measurement of both quantities under matched native PDL loading with the dental enzyme. A virtual experiment can establish the consequences of assumptions or reproduce independent published data. A PDL-specific conclusion would require suitable independent measurements. [Camp et al.](https://doi.org/10.1021/ja110098b) · [Tohar et al.](https://doi.org/10.3390/jfb13020076)

## Evidence for choosing and challenging assumptions

| Source | What the authors measured | How to use it |
| --- | --- | --- |
| Camp et al., 2011, recombinant human type I collagen monomers with bacterial collagenase | Bead detachment tracked cleavage in a single-molecule assay. The fitted unloaded rate was about 0.05 s⁻¹. The fitted slow component attributed to single tethers was about 0.005 s⁻¹ at both 3.6 and 9.4 pN. Early rapid loss in loaded samples had a different interpretation. | Figure 4 and supporting information make this the best first external benchmark for the fixed-condition model. A ratio near 0.1 is an **assay-specific** estimate. The forces are molecular loads in pN and give no conversion to bulk PDL strain. [Article and Figure 4](https://pmc.ncbi.nlm.nih.gov/articles/PMC3299535/#F4) |
| Flynn, Tilburey and Ruberti, 2013, native bovine tendon fibrils with bacterial collagenase | Inferred radial erosion from stiffness probes. At early times, the mean radial loss rate was 0.116 nm/s unloaded and 0.027 nm/s at low load, approximately a 0.23 ratio. No significant difference was detected between the high-load and no-enzyme control measurements over the reported observation window. | Use as a fibril-scale benchmark if modeling radial erosion. Figures 3–5 and supporting information describe the measurement. A radial loss ratio and a molecular cleavage probability describe different outcomes. [Article and supplement](https://pmc.ncbi.nlm.nih.gov/articles/PMC3773243/) |
| Adhikari, Chai and Dunn, 2011, collagen construct and mammalian MMP-1 | A single-molecule assay reported a strong increase in proteolysis under tensile force. | Evidence that force can accelerate cleavage in a distinct enzyme–substrate system. An MMP-1 rate does not estimate the bacterial ColG rate. [Article abstract](https://pubmed.ncbi.nlm.nih.gov/21247159/) |
| Mansoor et al., 2026, decellularized pig patellar tendon with commercial bacterial collagenase | The lowest inferred degradation under static strain occurred near an intermediate strain. Cyclic strain accelerated degradation relative to comparable static loading. Enzyme-free controls showed ordinary stress relaxation. | Supplementary Figure 3 contains absolute force traces. This supports testing nonmonotone and loading-history assumptions in future models. The current browser model uses a simpler monotone law. [Article and supplementary materials](https://www.sciencedirect.com/science/article/pii/S1742706126000735#sec0021) |
| Bovine lung fibers, 2024, bacterial collagenase | Static or intermittent loading increased loss of fiber modulus during digestion. The study also modeled fiber waviness. | A useful opposing benchmark. The measured stiffness change includes mechanical responses and is an indirect measure of collagen breakdown. [Article and supplement](https://pmc.ncbi.nlm.nih.gov/articles/PMC11584708/) |
| Kawada and Komatsu, 2000, and Komatsu et al., 2007, rat PDL | Collagenase treatment followed by mechanical testing weakened PDL and changed stress relaxation. The 2000 study compared treatment concentrations and recorded microscopy as well as failure mechanics. | Dental evidence for linking collagen damage to tissue mechanics. The 2000 specimens were treated before mechanical testing, without a comparison of imposed strain during digestion. The 2007 evidence here comes from its abstract. [2000 study citation and reproduced figure](https://pmc.ncbi.nlm.nih.gov/articles/PMC2951112/#B44) · [2007 abstract](https://pubmed.ncbi.nlm.nih.gov/17266965/) |
| Human periodontal cells in collagen gels, 2003 | Free-floating and attached gels differed in cell-mediated collagen breakdown. Breakdown increased after attached gels detached. | PDL-related qualitative evidence. Cell-mediated remodeling over days includes enzyme production and other biological changes. [Article abstract](https://pubmed.ncbi.nlm.nih.gov/12941067/) |
| Tohar et al., 2022, and Ansbacher et al., 2023, ex situ pig jaws | ColG-treated roots required about 20% less extraction force on average versus vehicle, with individual values up to about 50%. A follow-up reported an 11% mean reduction for an enzyme variant relative to the original ColG. | Dental benchmarks for the extraction endpoint. The comparators differ. Neither provides a local strain–cleavage curve. The 50% is an individual observed effect. [2022 results and Figure 4](https://pmc.ncbi.nlm.nih.gov/articles/PMC9225053/#jfb-13-00076-f004) · [2023 results](https://link.springer.com/article/10.1186/s13036-023-00366-4#Fig3) |
| Gadzella et al., 2025, ex vivo swine incisors and finite element analysis | Extraction peak depended on loading rate and root surface attachment area. The authors modeled force-hold loading and initial mechanical damage and compared responses with experiments. | Best starting point for a calibrated mechanical upgrade. The paper gives model equations, geometry assumptions, and calibration methods. Its data-availability statement directs further inquiries to the corresponding author. Firecrawl located the public thesis, but no reusable solver input was verified. [Article](https://pmc.ncbi.nlm.nih.gov/articles/PMC11745890/) · [Open thesis](https://ualberta.scholaris.ca/items/ba70ba32-130f-420f-b7a9-36ea296a5ea1) |
| Human PDL tensile testing, 2018, and clinical vertical extraction, 2020 | Tensile tests characterize human tissue stress–strain behavior. The clinical study reported peak forces of 41–629 N in 59 routine root extractions. | Fit the intact mechanical response to appropriate tensile data first. Use clinical force ranges as a plausibility check, with tooth and load conditions recorded. Neither study supplies enzymatic parameters. [Human PDL tensile results](https://pmc.ncbi.nlm.nih.gov/articles/PMC6251174/) · [Clinical study abstract](https://pubmed.ncbi.nlm.nih.gov/32279853/) |

## Reusable models, structures, and tools

| Resource | What is available and where it fits |
| --- | --- |
| Human lower jaw mesh | Díaz, Ferro Sánchez and Campo publish STL, IGES and SpaceClaim files for a mandible, 14 teeth and corresponding ligament shells, under CC BY 4.0. Files are labeled 37–47 according to the dataset description. The third molars (38 and 48 in FDI notation) are outside this range. The PDL is modeled as a 0.25 mm extrusion and should be treated as an assumed geometry. A single-rooted tooth from the set is a manageable first human case. [Mendeley Data and license](https://doi.org/10.17632/97c3pf8h2h.1) |
| Human ligament constitutive model | A separate open study provides a nonlinear viscoelastic formulation based on regional collagen content and human maxillary nanoindentation. Its material coefficients are candidates for sensitivity checks. Use the tensile study above when calibration requires tensile loading. [Human constitutive model](https://pmc.ncbi.nlm.nih.gov/articles/PMC10573969/) |
| Collagenase G structure and identity | UniProt Q9X721 is the 1,118-residue reference protein. RCSB PDB 2Y50 is a 2.80 Å crystal structure of a ColG fragment. Entry 4ARE is a collagenase-unit structure, and 4HPK is a collagen-binding domain structure. The enzyme is a zinc metalloprotease with calcium-binding structural features. The 2022 paper documents its particular recombinant ColG construct. These are useful for identifying what was studied and illustrating mechanism. Structure alone does not supply a rate under load. [UniProt Q9X721](https://www.uniprot.org/uniprotkb/Q9X721/entry) · [PDB 2Y50](https://www.rcsb.org/structure/2Y50) · [4ARE](https://www.rcsb.org/structure/4ARE) · [4HPK](https://www.rcsb.org/structure/4HPK) · [Dental study methods](https://pmc.ncbi.nlm.nih.gov/articles/PMC9225053/) |
| Collagen fibril structure and modeling | ColBuilder provides access to type I collagen fibril models with cross-link options and force-field information. RCSB 3HR2 is a **low-resolution** type I collagen molecular model from fiber diffraction. These are templates for structure visualization or a later mechanistic study. They do not represent a full human periodontal ligament or yield validated ColG kinetics under stretch. [ColBuilder paper](https://pmc.ncbi.nlm.nih.gov/articles/PMC8456305/) · [Model server](https://colbuilder.h-its.org/) · [PDB 3HR2](https://www.rcsb.org/structure/3HR2) |
| Fiber bundle and finite element software | Fiber-bundle models describe failure and load sharing among many elements. The current browser prototype uses plain JavaScript and needs no installation to run when hosted. FEBio, used by Gadzella et al., can support an eventual spatial tooth–PDL–bone model. GIBBON is the MATLAB-based interface used for parameter fitting in that work. [Fiber-bundle model](https://arxiv.org/abs/cond-mat/9908226) · [FEBio](https://febio.org/) · [GIBBON](https://www.gibboncode.org/) |
| Related patent | The issued U.S. patent claims a method using collagenase before tooth extraction. The examples and claims are useful scope context. The targeted search did not establish patentability or the absence of other relevant disclosures. [US10016492B2](https://patents.google.com/patent/US10016492B2/en#claims) |

Public assets are linked at their sources. The tooth mesh and molecular structures are optional inputs for later work. The browser prototype uses its own one-dimensional spring geometry.

## What the two simulations measure

### Fixed-strain cleavage

Hold one idealized sample at zero applied strain and its matched counterpart at a chosen stretch. Give both the same baseline exposure. The model predicts the expected fraction cleaved as `1 − exp(−k × t)`. Time is scaled by the relaxed rate, so the relaxed normalized rate is 1. The stretched-to-relaxed rate ratio is defined **at the selected reference stretch**. Changing that stretch at fixed ratio changes the inferred slope used for the socket. It leaves the endpoint ratio assigned to the two fixed-strain specimens unchanged.

The early window is operationally defined as a predicted cleavage fraction of 10% or less in both samples. The browser flags larger values. Since strain is held fixed, this isolates the assumed rate relationship without modeling a change in sample-wide strain after a cut. The early cleavage result is a prediction derived from the selected rates. Comparing it with published cleavage observations is an external check for the specific published assay.

### Synthetic socket with event-triggered retreat

1. Generate 72 virtual tension-only fibers with variable slack, axial projection, stiffness, and rupture strain. Clone the same fibers and random cleavage thresholds into two arms.
2. Advance the actuator over the same conditioning time. At equilibrium, its spring force balances the axial force from the remaining fibers. On the advancing arm, removal of a loaded fiber allows a small increase in tooth displacement and can increase strain in survivors. A perfectly imposed tooth displacement would give a different response.
3. Detect a force loss at fixed actuator command within a time step. The feedback arm retreats and returns toward the advancing trajectory. When the motor retreats far enough, some surviving fibers can go slack. The current model does not predict local unloading from passive root rotation.
4. End the cleavage stage and do the same displacement-controlled pull in both arms. Measure the largest force before failure, as a fraction of peak force from an intact virtual socket with the same fibers. Compute paired differences across repeat seeds. Keep enzymatic removal, mechanical failure and controller trigger counts distinct.

The motor operates on simulated force drops and uses an ideal sensor. This is a study of a controller applied to a synthetic fixture. It is not a design for extracting human teeth.

## Reproduce the model

From the repository root, run the local server and open http://localhost:8000 for the simulator. The CSV export includes every paired summary, one representative trace pair, the intact trace, the model version, and the settings.

```bash
python3 -m http.server 8000 --directory docs
```

Run the verification tests and regenerate the manuscript table with Node.js 20 or later. The optional argument to the second command is the destination directory for CSV files.

```bash
node --test tests/model.test.mjs
node research/reproduce.mjs results
```

## A realistic path to a stronger paper

1. Reconstruct a published external benchmark by digitizing the Camp time series, recording extraction uncertainty, and fitting a no-load curve separately from the slow component of the loaded curves. Reserve another published condition for comparison and report where a single-exponential model fails.
2. Report the socket predictions for slower, unchanged and faster cleavage under strain. Vary baseline exposure, actuator stiffness and retreat duration or distance. Add a preplanned force-hold arm, event-detection uncertainty, and model forms such as an intermediate-strain minimum. Analyze the strain-independent and zero-exposure controls alongside these runs.
3. Fit intact mechanical behavior before introducing damage. For a human upgrade, import a single-root geometry, measure surface attachment area, check mesh convergence and validate the intact force–displacement response against an independent source. The extension to root rotation and regional responses would need 2D or 3D geometry.
4. Treat native PDL kinetics as unidentified until comparable data become available. Publish quantitative results as conditional on each chosen rate law and its assumptions. Keep a relaxation compound outside the first manuscript because the preferred direction of loading depends on the unknown kinetics and tissue mechanics.
