# Execution prompts for the 3D periodontal ligament study

These are future work packages. Use one prompt at a time. The first four produce a protocol, an evidence dataset, a comparison of cleavage laws, and a mathematical benchmark. The 3D work starts in Task 5. [Study questions, evidence and equations](3d-study-roadmap.md)

**Paste this context with each prompt.**

> I am a college student doing a computational study with public data and no wet lab. My questions are whether stretch changes cleavage by the dental collagenase G in native periodontal ligament (PDL), and whether briefly unloading surviving fibers after a cut changes the peak of a later tooth pull. Use the study roadmap and completed task outputs in this repository. Carry out only the numbered task I provide. Cite primary sources at the claim, record units and uncertainty, and mark each input as measured, digitized, estimated from another tissue, or assumed. Existing prototype outputs are synthetic. End with the deliverable, checks passed or failed, unresolved decisions and their effect on the next task.

### Task 1

**Write the study protocol.** Use the roadmap and existing research inventory. Deliver a versioned protocol.

> Define two virtual experiments. For the cleavage assay, match enzyme identity, concentration, exposure time, collagen type and preparation, temperature, and accessible substrate. Define “relaxed” operationally, distinguish imposed strain from force held constant, and state which quantity will be recorded locally. Define the initial rate ratio and an early window based on the smallest resolvable cleavage signal before load redistribution matters. Predeclare how to handle multiple kinetic phases. For the socket, define the event detector, conditioning arms, common final pull, signed peak-force difference, whole-procedure peak and work, and early release. List plausible alternative explanations. Assign datasets to fitting and validation before examining fit quality. Use a table with predictions for each rival mechanism. Include what result would leave each question unresolved.

**Review check.** A reader can identify the independent variable, comparator, primary measurement, and unit of replication for each question. Any proposed numerical cutoff carries a rationale and a planned sensitivity check.

### Task 2

**Build the evidence dataset.** Use Task 1 and the source table in the roadmap. Deliver a source ledger, data dictionary and versioned observation tables.

> Recheck the search for native human or animal PDL strained during exposure to the same dental ColG. Record exact search strings, date, databases, relevant citations, and why near matches fall short. Prioritize the original time-course data behind Camp Figure 4 and Adhikari Figure 2b, then Flynn's fibril erosion and the tendon study. Look for downloadable data and supporting information first. If only graphs are public, digitize allowed figures with calibrated axes, record figure/panel and transformations, repeat representative points to estimate digitization error, and preserve provenance. For each record capture species, tissue hierarchy, collagen type, enzyme preparation, loading mode and units, observable, replicate count, variability measure, and whether the value was measured or inferred. Track tooth-force datasets in a separate table. Record reuse terms and link to restricted assets at the source.

**Review check.** Another researcher can trace each value to its figure, table or file. Missing replicate counts remain missing. Repeated plotted time points retain their common specimen or aggregate identifier.

### Task 3

**Compare cleavage rules and make the first research figure.** Use Tasks 1–2. Deliver parameter table, observed-versus-predicted curves, residuals and a statement of which biological system each result covers.

> Fit ratios within comparable assays. For molecular cutting, compare a constant-rate baseline with a signed Bell-type force response and a saturating protective response where the data support the parameters. Include the no-enzyme background and examine whether multiple tethers or kinetic phases can explain early behavior. For tissue data, specify a separate observation equation for radial erosion or modulus loss before interpreting it as cleavage. Where multiple static strains exist, challenge the monotone models with a curve that has an intermediate minimum. Report parameter units, uncertainty and a predeclared equivalence band. Hold out an entire loading condition or specimen; avoid randomly splitting time points from the same curve. Use uncertainty-aware predictive scores or residuals suited to the available measurements. With only published aggregates, disclose the limits on inferential precision. Test whether rankings change with plausible observation models and assumptions about transfer between tissues. Report an assay-specific winner or an unresolved comparison as supported by the data.

**Review check.** Include both bacterial-enzyme molecular studies, show the roadmap's Camp two-load extrapolation, and distinguish molecular force in pN from ligament strain. A PDL-specific ranking requires a justified link to target data. Give the biological claim and its domain in one sentence.

### Task 4

**Establish exactly what a cut and a retreat do to tension.** Use protocol and roadmap derivation. Deliver a short mathematical note and a benchmark specification.

> Derive equilibrium before and after one loaded fiber breaks in three settings covering fixed tooth displacement, fixed total force, and displacement through an actuator of finite stiffness. For initially identical taut fibers, derive the retreat distance needed to put surviving fibers below their pre-cut tension. Work a numerical example with declared spring constants and consistent units, and verify the limiting cases of a very stiff actuator and zero retreat. Then explain how slack, oblique fiber directions and tooth rotation could unload one region while loading another. Specify test cases and tolerances for a future solver. Distinguish a drop in measured actuator force from a drop in each surviving fiber's tension.

**Review check.** The finite-stiffness calculation reproduces the inequality in the roadmap, and its domain of validity is explicit. A lower final extraction force is a separate outcome still to be tested.

### Task 5

**Prepare a research-grade anatomical reference.** Use protocol, licensed jaw geometry and human PDL architecture evidence. Deliver versioned geometry, orientation fields, provenance ledger and mesh-quality report.

> Select one named single-rooted human tooth and matching bone and PDL from a licensed dataset. Record the FDI tooth number, species, source version, scale, coordinate axes, transforms and reuse terms. Label cervical, middle and apical regions plus root–ligament and ligament–bone interfaces. Distinguish modeled ligament thickness from imaged anatomy. Describe how regional fiber orientation, dispersion, crimp and density are constrained by measurements, and mark the uncertain values. Build coarse, intermediate and refined volume meshes, check connected interfaces, positive element Jacobians, reference lengths and the number of elements through the ligament. Compare geometric quantities with the source. Report what additional anatomy would be needed for an erupted or impacted third molar.

**Review check.** A second person can locate the original tooth, recreate the coordinate system, identify the approximations, and reproduce the mesh measurements. [Jaw dataset](https://doi.org/10.17632/97c3pf8h2h.1) · [Regional human PDL evidence](https://pubmed.ncbi.nlm.nih.gov/39299626/)

### Task 6

**Validate the intact mechanics before adding collagenase.** Use Tasks 2, 4 and 5. Deliver an offline solver model, calibration report, held-out comparison and convergence results.

> Evaluate FEBio or an equivalent nonlinear finite element solver. Document constraints, units, constitutive laws, time integration and contact. Start with an anisotropic fiber-reinforced, time-dependent ligament and explicit attachment/failure assumptions. Include tooth translation and rotation where permitted by the test fixture. Quantify the effect of assuming rigid tooth or bone, the chosen boundary extent and uncertainty in reference prestrain. Fit intact loading and relaxation data; reserve independent rates, regions or specimens for validation. Use porcine geometries or a clearly separate porcine reference case for quantitative comparisons with porcine experiments. Choose a fracture-energy regularization or cohesive-interface law for localized failure and check that the predicted work of separation converges with mesh refinement. Compare with compatible human measurements before interpreting newtons as human predictions. Report force–displacement and force–time agreement, force balance, energy behavior, mesh/time-step sensitivity, parameter identifiability and runtime on student-accessible hardware.

**Review check.** Accuracy and numerical uncertainty are reported on the quantities the study will use. A signed extraction effect smaller than these errors stays unresolved. A failed test produces a documented change or a narrower supported claim. [Human tensile data](https://pmc.ncbi.nlm.nih.gov/articles/PMC6251174/) · [Swine numerical and experimental study](https://pmc.ncbi.nlm.nih.gov/articles/PMC11745890/)

### Task 7

**Couple biochemical weakening to a spatially resolved ligament.** Use retained kinetic hypotheses from Task 3 and the verified mechanics. Deliver a documented coupling model and fixed-strain assay results.

> Define which model quantity represents local collagen integrity and how it changes strength or stiffness. Track enzyme-mediated cleavage and mechanical rupture separately. Implement the supported or competing rate laws, with units, validity range and parameter distributions. Start with matched local enzyme exposure, then test whether uncertain tissue access or transport could mimic a strain effect. Document how force or strain is passed between molecular, fibril and tissue scales; carry several plausible mappings if data leave that step unresolved. Verify the homogeneous fixed-strain assay against the analytic survival or erosion solution appropriate to the observable. Compare prediction with held-out measurements at their original scale. Verify nonnegative rates, irreversible damage under the chosen model, and zero-exposure behavior. Save regional time series for later playback.

**Review check.** The outputs show early fraction cleaved or another explicitly calibrated observable at each imposed loading condition. The files distinguish a prediction from a measured quantity and make any transfer from other tissues visible.

### Task 8

**Test the motor idea with matched virtual extractions.** Use Tasks 4, 6 and 7. Deliver paired protocol runs, event logs and an extraction analysis table.

> Clone each geometry, material realization, initial condition, enzyme exposure and random seed across treatment arms. Compare continuous advance with event-triggered retreat during the same conditioning duration. Define sensing threshold, delay, retreat distance, duration, return speed and retrigger behavior. Trigger the motor from a measurable force-drop signal; retain true simulated break events separately to measure missed and false triggers. Include an enzyme-free comparison and an open-loop control that replays a retreat schedule from a different matched run, so average motion can be compared with event timing. Where feasible add a pause-only arm. At exposure end, stop simulated enzyme action, return both fixtures to the same reference position, use the same recovery interval and final pull speed, and retain all accumulated damage and viscoelastic history. Handle teeth released during conditioning using the predeclared rule. Compare the paired final peak, total work, whole-procedure peak, time to release and regional damage.

**Review check.** Show an event-aligned trace of local survivor strain, motor position, force and cleavage. Confirm whether the motor actually unloaded the relevant fibers. Report whether any benefit survives comparison with an equal-motion replay and whether it persists under the no-effect cleavage law.

### Task 9

**Map where the conclusion changes sign.** Use Tasks 3, 6–8. Deliver uncertainty and sensitivity analysis plus a record of identifiable claims.

> Vary kinetic law and parameters, local enzyme access, fiber orientation and slack, baseline viscoelasticity, socket geometry, rupture thresholds and controller timing. Keep matched draws across arms. Screen the uncertain inputs before running the expensive 3D cases and justify the final design from sensitivity and compute cost. Report paired effect distributions, numerical error, and Monte Carlo precision separately from donor variability and model-form uncertainty. Give the parameter regions in which retreat lowers, raises or barely changes peak force. Check whether a strain-independent enzyme with mechanical damage or transport can reproduce the same force data. Repeat a held-out or cross-study comparison where feasible and specify the measurement that best separates competing explanations.

**Review check.** At least one figure shows where the direction is robust or uncertain, with the tested domain and uncertainty sources stated. If the choice of a kinetics law controls the answer, the conclusion names that dependency.

### Task 10

**Build the interactive 3D visual simulation from verified solver output.** Use stable state files from Tasks 5–9. Deliver a browser viewer, reference cases and a verification report.

> Compute mechanics offline and publish compressed, versioned geometry and time-dependent fields for interactive playback. Evaluate a WebGL viewer such as Three.js or vtk.js for the required fields. Show the same tooth and camera in two synchronized views. Add an anatomical cutaway, section plane, timeline, release markers and a local probe that reports fiber direction, stretch, cleavage and mechanical damage. Provide synchronized force–displacement plots and distinguish measured traces from simulated ones. Use consistent color limits and physical units across arms, with explicit flags for model units or exaggerated displacement. Support a readable laptop view, keyboard controls and CSV export. For a chosen release event, verify a visible probe, the force trace and the reported peak against the solver archive. Label any interpolated frames or surrogate predictions and measure rendering performance.

**Review check.** A reviewer can follow one cut from the force sensor to regional unloading, subsequent cleavage and the final pull. Selecting the same event and spatial point reproduces the archived numerical values within a documented tolerance.

### Task 11

**Prepare the reproducible research paper and release.** Use complete evidence, verification, validation and visual records. Deliver manuscript, data/code manifest, run instructions and an archived example.

> Write a computational study organized around the two questions. Start each results section with the units, comparator and population or virtual ensemble. Include the evidence comparison, held-out kinetic predictions, mesh convergence, validated intact-force traces, synchronized release fields and controller sensitivity. State which findings follow analytically, which were measured in published experiments, and which depend on simulation assumptions. Package a reference case with geometry identifiers, parameter provenance, dependency versions, mesh identifiers, seeds and archived solver outputs. Provide instructions for a small reproducible run and the full 3D study with expected hardware and runtime. Include failure cases. Identify the next measurement that would most reduce uncertainty about native PDL. Treat a new collagenase formulation as a separate future research question.

**Review check.** An independent reader can reproduce one published curve and one paired simulation from the cited inputs, trace every main figure to its data, and state precisely which claims transfer to a human tooth.
