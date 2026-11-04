# Centuris Capital — brand system

Centuris Capital is the GP brand for a private credit sponsor in residential transition lending (formerly Bozeman Capital Partners). The name comes from the Latin *centuria*, a hundred, read here as a long time horizon. The brand should read as an established institution, not a startup and not a regional lender. It should look like a firm that measures itself in decades.

**Retired tagline:** Capital for generations, not quarters. Not used on the website, because it sits awkwardly beside short duration lending.

## Brand position

- **What we are:** a disciplined, long-horizon credit manager with real underwriting under every number.
- **What we are not:** flashy, retail, crypto-adjacent, or tied to one city. No place names in the brand.
- **The feel:** a private bank's letterhead, not a fintech app. Quiet confidence, plenty of white space, and exact figures.

## Voice

- Plain, declarative, short sentences. State facts and let the numbers carry the argument.
- Precise numbers with their basis ("10.4% net annualized, 2023–2025, after fees"), never "up to" or "as high as".
- Do: "First lien loans. Short duration. Monthly distributions."
- Say "first lien" for the underlying loans and state each fund's position separately. Don't describe the firm as "senior-secured": BP Mezzanine Opportunity Fund holds subordinate B notes.
- Don't: exclamation marks, superlatives ("best-in-class", "unparalleled"), urgency ("limited spots"), emoji, guaranteed-return language.
- Every performance figure carries its period, its basis (net or gross) and a disclosure link. Paid ads and site copy go to counsel before publishing.

## Logo

The wordmark is **CENTURIS** set in **Michelangelus** (Microsoft / Studiogusto) in capitals with wide tracking (about +0.18em), followed by **CAPITAL** in Geist 500 at about 40% of that size with +0.32em tracking. On Ink Black: CENTURIS ivory, CAPITAL camel. On ivory: CENTURIS Ink Black, CAPITAL camel-text. Leave clear space equal to the height of the C on every side.

The finished wordmarks are in `brand/logos/`: outlined SVGs with no font file inside.

**Michelangelus is used only inside the wordmark, and only as an image (SVG or PNG exported on a licensed machine).** Its licence (Microsoft Software License Terms, Michelangelus Fonts) grants no distribution rights, so the font file must never be uploaded to the website or served as a web font. Ad creatives, decks and PDFs made on our own machines may use it; convert text to outlines in exported PDFs. Live website text is always Geist.

## Colour

The palette has three parts: **Ink Black** `#011627` (the brand, and the text colour), **ivory** surfaces `#F6F3EC` / `#ECE6DA` (paper, permanence) and **camel** `#B4925E` (warmth, heritage, used sparingly). **Sand** `#E3D8C3` is for soft panels.

Text pairings (all tested for contrast; ratios in each token's note):

| Background | Main text | Secondary text | Accent text |
| --- | --- | --- | --- |
| Ivory `surface` / `surface-sunk` | `ink` #011627 | `ink-muted` #4A5562 | `camel-text` #6E5530 |
| Sand | `ink` #011627 | `ink-muted` #4A5562 | `camel-text` #6E5530 |
| Ink Black `brand` band | `on-brand` #F6F3EC | `on-brand-muted` #A9B3BF | `camel` #B4925E |
| Camel fill (buttons, tags) | `on-camel` #011627 | — | — |

- Camel itself is too light to read on ivory (2.6:1). On light surfaces it is decoration only: rules, fills, the cover blocks. Any camel-coloured words there use `camel-text`. On Ink Black, camel reads well (6.3:1) and is the logo-accent colour.
- Never white on camel (2.9:1); use Ink Black.
- About 70% ivory surfaces, 20% Ink Black, 5% camel. One camel highlight per view: the main action carries it, so secondary controls such as the header button stay quiet outlines.
- Sections alternate between Ink Black (`brand`) and the ivories, in an uneven rhythm: dark anchors (hero, opportunities, investor access plus footer) with `surface` and `surface-sunk` sections between them. Avoid strict dark/light flipping on every section, which reads as stripes.
- `positive` and `negative` appear only next to performance figures and always with a sign (+/–), so meaning never depends on colour alone.
- Dark theme (investor portal, slides): the page becomes Ink Black, text ivory, camel works as text directly. The marketing site is light-first.

## Type

- **Geist** (Vercel, free on Google Fonts and npm, SIL Open Font License) is the only typeface on the website: headlines, body, figures, labels and UI.
- Headlines use Geist Light (300) at large sizes; confidence comes from size and spacing, not weight. Body is Regular (400); emphasis and h3 are Medium (500). Avoid weights above 600.
- No eyebrows or overline labels. Headlines stand on their own and say what the section is.
- Headlines never end in a period.
- Use tabular figures (`font-variant-numeric: tabular-nums`) in every table and stat.
- Michelangelus appears only in the wordmark (see Logo).

## Layout and shape

- The brand is square. Use `radius-none` on bands, images and tables, `radius-sm` on controls, and at most `radius-md` on cards.
- Separate with 1px `line` hairlines, not drop shadows.
- Elevation has four levels and almost everything sits at level 0 (`shadow-none`): sections, cards, tables, panels. Level 1 (`shadow-raised`) is only the sticky nav after scroll; level 2 (`shadow-overlay`) is for things floating over the page (menus, popovers, tooltips); level 3 (`shadow-modal`) is for dialogs, over an Ink Black scrim. Cards are flat by default; reach for a border, the sand tint or spacing first. A card that genuinely floats (for example a stat card overlapping the edge of the hero) may use `shadow-overlay`, sparingly: one or two per page. In the dark theme, shadows barely show, so floating layers also step up to `surface-raised`.
- Use a 12-column grid with a 1200px max width, `space-6` gutters and `space-24` between sections.
- Use the stat row pattern for key numbers: three or four figures in the Geist `figure` style, each with a `small` label underneath, divided by vertical hairlines. Use it once per page, in the hero, on a 90% Ink Black band with the as-of date and disclosure link directly beneath. Supporting facts elsewhere are a smaller list, not a second stat row.
- Signature: a thin marked line wherever a limit or position is stated, such as the collateral bar and the capital stack bars. Use it nowhere else. Camel is decoration here, and any words beside it use `camel-text`.

## Imagery

- Architectural and residential detail: finished renovations, rooflines, doorways, in daylight. Restrained colour grading.
- Never use stock handshakes, skylines with lens flare, piles of cash, or anything that names a city.
- Text sits on a calm part of the image, such as open sky, never on busy detail. Use the lightest flat Ink Black overlay that keeps text at 4.5:1 or better. If a photo is too busy for that, leave part of it clear and put the text on a 90% Ink Black panel over the rest.

## Motion

- Sections overlap: each holds in place while the next slides over it, and a section taller than the screen finishes scrolling first. The incoming section casts a soft upward shadow that fades in over its first 120px of travel, the one exception to the rule against drop shadows. Images drift with a slow parallax. Both come from GSAP ScrollTrigger and Lenis.
- That is all the scroll motion. No word by word reveals, rising text or looping effects.
- The hero figures fade, rise and count up once on load, one after another. No other figures or tables animate.
- Interface transitions use one curve, `cubic-bezier(0.22, 1, 0.36, 1)`.
- With reduced motion on, the page is a plain document with normal scrolling.

## Website structure

The website does not mention the former name.

| # | Section | Background |
| --- | --- | --- |
| 1 | Hero: "Short duration residential credit" as H1 in ivory on open sky, one sentence on the strategy, one camel button ("Request data room access"), then the stat row on a band along the bottom | Ink Black, full photo |
| 2 | Strategy: deal flow from the affiliated originator first, then what we buy, risk controls, and a small collateral bar last | `surface` #F6F3EC |
| 3 | Opportunities: expandable fund rows showing name and status, opening to strategy, target net return, inception, distributions, lockup and a capital stack bar, then the Rule 506(c) note | Ink Black |
| 4 | Team: principals, one sentence on outside administration, audit and legal work | `surface-sunk` #ECE6DA |
| 5 | Investor access (accredited-investor verification for 506(c) offerings) and footer | Ink Black |

## Using this system

Colours are semantic tokens in a light and a dark theme, and light is the fallback. Each colour token's note says which surfaces it is legible on. Geist loads from Google Fonts (weights 300, 400, 500). The website lives in `src/` as static HTML and Tailwind, with these tokens mapped to utilities in `src/styles.css` and site facts in `site.config.json`.
