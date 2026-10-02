# v7 architecture storyboards

The requested `architecture-to-everything` workflow is applied to the web scope: existing draw.io input → primary architecture explanation → interactive storyboard. The existing engineering architecture guides provide the explanation stage; v7 adds a five-chapter reading and evaluation contract. No PPTX, hosted notebook or external content upload was requested.

## Coverage

Eleven source architectures are covered: DG32-LITE (also SKU-4), DG32-2DOM, SKU-1, SKU-2, SKU-3, SKU-5, SKU-6, SKU-7, SKU-8, SKU-9 and D100. The technology architecture page, ten product pages, the architecture library packages and the homepage DG32 safety proof use the shared storyboard reader. The homepage's physical Three.js assembly and fault-injection explanation remain illustrative physical/context views; its native HTML functional architecture plate was replaced.

## Story contract

1. **Setup** names the source-defined domains and their role.
2. **Component flow** follows the guide's numbered signal sequence.
3. **Control / fault** identifies the documented feedback, fault or independent control path. It does not invent a protection path where the source documents only normal processing.
4. **Implication** presents the primary guide's design decisions or component rationale.
5. **Evaluation** asks a product-specific measurement question and states the pre-silicon boundary. Source reconciliations remain visible; standards and architecture targets do not become certificates or measured values.

## Diagram provenance and interaction

`public/storyboards/*.svg` are byte-identical copies of the existing draw.io SVG exports. The diagram's geometry, labels, arrows and group structure are preserved. `scripts/architecture-storyboards.py` parses each original `.drawio` for component IDs and labelled arrow endpoints, and derives narrative chapters from the corresponding `*-architecture-guide.md`.

The web reader does not create an HTML box diagram or compute native arrow geometry. It displays the original vector export and exposes its source component groups to pointer and keyboard selection. Selecting a component highlights its actual connected groups; selecting an arrow in the readable connection register highlights that exact source edge and its endpoints. Reset restores the original complete view. The original source and guide remain available through base-aware links.

There is no automatic advance, scroll hijacking or required animation. Chapter buttons and the connection register work on touch and keyboard. Narrative text remains readable when the vector object fails to load; the original asset can be opened separately. Small screens receive stacked reading and figure areas; enlargement scrolls only within the figure, never the page.

## Reproducibility

Run `python3 scripts/architecture-storyboards.py` to regenerate the data and copied source assets. Run `python3 scripts/architecture-storyboards-check.py` to verify source digests, unchanged exports, all five populated chapters and exact SVG edge IDs. The source register lives in `architecture-storyboard-contract.json`; the rendering data is `app/architecture-storyboard-data.json`.

Architecture text is source-derived reading material, not additional silicon evidence. Product-specific corrective claims and maturity statements remain the publication authority.
