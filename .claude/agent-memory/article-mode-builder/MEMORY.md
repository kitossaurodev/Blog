# Article Mode Builder - Memory

## Architecture
- **Layout**: `layouts/_default/artigo.html` -- standalone HTML (bypasses baseof.html, no sidebars)
  - Uses `body.artigo-body` class to apply clean background
  - Includes static toolbar (not sticky) with "Voltar ao blog" link, width matches page (210mm)
  - Renders `.Content` from artigo.md inside `.artigo-viewer > .artigo-pages`
- **Content**: `content/artigo.md` -- front matter: `layout: "artigo"`, `draft: false`, `hideMeta: true`
  - Pure HTML inside markdown file, each page wrapped in `div.artigo-page > div.page-inner`
  - Page numbers via `span.page-number` absolutely positioned at bottom (8mm)
- **CSS**: In `assets/css/extended/custom.css`, section "ARTIGO VIEWER (paginas A4)"
- **Toggle button**: In `layouts/_default/single.html` line 33, `a.modo-artigo-btn` links to `/artigo/`

## CSS Key Decisions
- A4 pages: 210mm x 297mm, white background, box-shadow, overflow:hidden
- Page inner: padding 20mm top, 18mm sides, 15mm bottom; display:flex, flex-direction:column
- Body text: Times New Roman, 9.5pt, line-height 1.38, two-column (column-gap 6mm)
- **column-fill: auto** + **flex: 1** on .paper-body -- fills left column first then right (not balanced). This prevents the "both columns half-filled" problem. Requires .page-inner to be flex column with defined height.
- Abstract: 8.5pt, bordered top/bottom (1.5pt/1pt), ABSTRACT label uppercase, flex-shrink:0
- Title: 17pt bold centered, author 12pt centered, affiliation 9pt italic
- Header: flex-shrink:0 to keep natural size in flex layout
- Section headings: 10.5pt bold, numbered with nbsp spacing ("1.&nbsp;&nbsp;&nbsp;&nbsp;Title")
- Paragraphs: text-indent 1.5em except first-child and h2+p
- Background: #d6d6d6 (light), #2a2a2a (dark) -- pages always white
- Responsive: @media max-width 850px switches to 95vw width

## Page Capacity Estimates (at current settings)
- Page 1 (with header + abstract): ~600-650 words of body text
- Pages 2-3 (body only): ~1000-1100 words each
- Bullet lists (ul/li) consume ~10 extra lines of vertical space per 4-item list

## Reference Screenshots
- 3 PNGs in `/exemples/` from session 27 (2026-03-07)
- Models: Dyck et al. (Elsevier two-column), Aono & Kazui (RMS centered title style)
- Style chosen: hybrid of both -- centered title block like Aono, two-column body like Dyck

## Posts with Article Mode
- "O cientista que desconhecia o metodo" -- 3 pages built
  - Page 1: Header + Abstract + Section 1 (Introducao) complete
  - Page 2: Section 2 (O Consenso) complete including Salem/Lindzen paragraphs
  - Page 3: Section 3 (Cherry Picking) + Legates/Soon analysis + eugenics parallel
- Text is independent copy (not referencing blog .md), may diverge later
- Text uses unaccented Portuguese (simplified from blog's accented version)

## Key Debugging Lessons
- CSS `column-fill: balance` (default) makes both columns equal height -- looks half-empty if text doesn't fill the page. Fix: use `column-fill: auto` with a concrete height (flex:1 from flex parent).
- `overflow: hidden` on paper-body clips excess text silently -- better than overflow but means you lose content if overstuffed. Be conservative with text amounts.
