# SheFreelances AI: app design ("Gallery by day, Midnight by night")

BRAND.md covers the brand and marketing pages. This file covers the logged-in app, where members use their AI tools. Inside the app, this file wins.

Files: `app.css` (all app styles), `screens/` (Home, Client Finder search, Client Finder's Write outreach view, Ads Manager Strategy and Your ads, as working HTML in Day and Night, with PNGs, plus `dashboard-hover.png` showing the tool hover). The screens show the patterns, spacing and hierarchy. Don't copy their sample text or numbers; build every real screen around the app's real content using the same patterns.

## The idea

The app should feel clean, chic and editorial, like a beautiful magazine that also does work. That comes from restraint, not decoration:

- **One layout, two themes.** Day is the default: a light off-white page, white surfaces, hairline dividers, and midnight used for the sidebar and the AI tool cards. Night is the full midnight palette on the exact same layout. Respect the OS setting and offer a toggle in Settings.
- **Few colors at once.** Ink, off-white and midnight do almost everything. Lavender and butter appear as small, deliberate moments (her name, the progress marks, tags, tool icons) and as the hover flood on the AI tool cards.
- **Big type contrast.** Large Gloock headlines (52px page titles, 28px section titles) against small, quiet sans text (13 to 15px). This contrast is what makes it feel premium.
- **Depth where the work lives.** Working data (Your lead list, Your offer, Recent AI work) sits in lifted white panels: 14px corners, a hairline border, a soft navy-tinted shadow and a light header row on tables. The AI tools are midnight cards. Headers, the next-step line and page intros stay flat on the page, separated by hairlines and space.
- **One focal point per screen.** On Home it's the row of AI tools, all four equal. On a tool page it's the search bar or the document.

## Themes (tokens in `app.css`)

| | Day | Night |
| --- | --- | --- |
| Page | `#fdfbf8` off-white | `#0d1119` midnight |
| Surfaces (cards, search bar, document) | `#ffffff` | `#141925` |
| Hairlines | `#ece7df` | `#222939` |
| Text / muted | `#1a2236` / `#6b7182` | `#f2efe9` / `#969db0` |
| Sidebar | midnight `#0d1119` | deeper midnight `#0a0d14` |
| AI tool cards | midnight navy, lavender and butter icons | deep card `#171d2b` with a hairline |
| Tool card on hover | floods lavender (1st, 3rd) or butter (2nd, 4th), navy text | same |
| Primary button | navy, off-white text | off-white, navy text |
| Her name in the greeting | butter highlighter | lavender text |

## Shell

- **Sidebar** (240px, always midnight): lavender Sf monogram and workspace name, Home, "AI tools" group (Offer Builder, Client Finder with its lead count, Ads Manager, Content Creator), "Learn" group, then the AI credits line (butter bar) and Settings at the bottom. Active item: a slightly lighter midnight with white text and a lavender icon. No top bar is needed on Home; tool pages can add a slim one for breadcrumbs and search if the app needs it.
- **Content**: 56px side padding (32px on laptops, 20px on phones), max 1240px wide, left aligned.

## Home

1. Date in small muted text, then the greeting in Gloock at 52px with her first name highlighted.
2. **Next step line**: hairlines above and below, the "NEXT STEP" label, three progress marks (lavender done, butter current), the step in bold, the count in muted text, and one primary button on the right. Never a big colored box.
3. **Your AI tools** (Gloock 28px): all four tools as equal midnight cards in one row (Offer Builder, Client Finder, Ads Manager, Content Creator; two per row on laptops, one on phones). Each card: an icon tile, the tool name in Gloock at 28px, one or two lines on what it does, "Open [tool name]" with a chevron, and one real fact ("Last used just now", "4 on your lead list", "Not used yet"). No numbers, no featured card, no "coming soon" styling for live tools.
   - **Hover and keyboard focus:** the whole card floods with color, lavender on the 1st and 3rd, butter on the 2nd and 4th. Text turns navy, the icon tile turns navy with the flood color inside, and the action underlines. 180ms color fade, no movement.
4. Two columns of lifted panels (`.panel`): **Your lead list** ("4 saved", "Find more"; columns Business, Type, Location, Fit, Status, Updated; "Analyzed" in lavender, "Not analyzed" outlined) and, stacked on the right, **Your offer** (name, one line, the price as a big Gloock figure with "per month", "Open offer doc", Edit) and **Recent AI work** (what was done, in bold, and when).
   The people on her list are prospects, not clients. Use "lead list", "prospect" and "lead" everywhere in the app.

## Tool pages

- **Header**: small "AI TOOL" label (never numbered), the tool name in Gloock at 52px, the same one-sentence description as its Home card, then underline tabs for the tool's views. Client Finder: "Find businesses / Lead list (4) / Write outreach".
- **Finder tools** (Client Finder and similar): one white search bar holding both fields and the primary button, with a soft shadow. Under it, "Try" suggestions as underlined words and the credit cost on the right. Results under a Gloock heading that states the result ("12 med spas in Austin") with the sort on the right. Each result is a hairline row: initial in a thin circle, name, type, area and rating, a fit tag with the reason in plain words, then "Save to lead list" (or a muted "Saved" with a check) and "Details".
- **Writing views** (Client Finder's Write outreach tab, Offer Builder, Content Creator, Ads Manager's ad copy): inputs on the left with small uppercase labels and pill choices for options like channel and tone; the document on the right as a white surface with a soft shadow. Inside it: draft tabs, a butter "Writing" mark while generating, Copy and Save, the subject in Gloock, the text at 16px with 1.7 line height, then underlined quick changes ("Make it shorter") and an "Ask for a change" box. Nothing is sent without her review, and the screen says so.
**Guided tools** (Ads Manager, and any tool that asks a few rounds of questions before it builds something; reference `screens/ads-manager.png`):
- **Header:** the tool name as the small label, the business name as the Gloock title, and a lavender "Practice" tag beside it for practice businesses. Never put "(practice)" inside the title.
- **Steps are a progress row, never pills:** "Step 3 of 3 · Details" with three short marks (lavender done, butter current) and the step names as quiet underlined links underneath. Pills only ever mean "pick one".
- **Questions in sentence case** at 14px semibold, with "Optional" in muted text after the question. Small uppercase labels are for short labels only (like "Prospect" or "Channel").
- **One way to answer each question.** Budget is pills only; picking "Custom" opens a number field. Never pills plus a duplicate box.
- **The form column stays put** (sticky) while the plan scrolls, so the main button ("Rebuild my ad strategy") is always reachable. Back sits beside it as a quiet button.
- **Plan document with four tabs at most** (Ads Manager: Strategy, Campaign setup, Your ads, Launch plan). Images live inside "Your ads". "Copy all" sits on the tab row on the right, never in its own band.
- **A summary strip opens the plan:** the four key decisions (Offer, Objective, Budget, Area) on a soft lavender band with the values in bold, so a beginner gets the plan in seconds.
- **Sections use Gloock headings** ("Your recommended strategy", "Your campaign setup") with a one-line intro, then label and answer rows separated by hairlines. Bold the key value; put the reason underneath in smaller muted text. No section numbers.
- Any benchmark shown as advice (like a typical cost per lead) must come from real, documented data, or be left out.

**Ad previews** (Ads Manager "Your ads", and any tool that writes ads or posts; reference `screens/ads-manager-ads.png`):
- Each ad starts with a small "AD 1 OF 2" label, its name in Gloock, and the angle as a lavender tag only when it adds something the name doesn't. One line on why the angle works. Never repeat the name as a tag.
- **Blanks are a to-do,** not a sentence: a slim butter row ("2 blanks to fill in before this ad is ready") with a "Fill in blanks" button that opens Edit at the first blank. Blanks inside the ad are butter chips, like [Google rating].
- **Three controls, one row, above the ad:** a primary "Copy ad" button (copies the whole ad, no menu), "Edit" (change the words by hand), and "Rewrite" with a small menu of two choices: "Rewrite this ad" (same angle, new wording) and "Try a different angle". Nothing else. Never a stack of identical pills.
- **The preview looks like the real feed ad:** a phone-width card (380px) with the page name and "Sponsored", the primary text as normal paragraphs, the image area, then the headline, description and the button. No bullets or colored dots in the ad text.
- **"Show how this ad is built"** is a switch beside the ad, on by default. When it's on, each part of the ad text sits on its own line with a small round marker beside it: lavender for the hook, butter for the middle, ink for why trust them, an outlined ring for what to do next. A legend beside the ad uses the same markers and names each part with one short line. The text itself stays untinted. When it's off, the markers and legend disappear and the ad reads exactly like the real one. Only brand colors, never green, grey or extra hues.
- "Other first lines, middles and headlines to try" is a full-width, left-aligned row under the ad that expands in place.

- Before the first use of any tool, show the header and inputs plus one helpful sentence about what she'll get, never a bare form.

## Details

- Corners: cards, search bar and document 16px; buttons and inputs 8px; option pills fully round.
- Shadows: panels get a soft resting shadow (`--a-panel-shadow`); the search bar and the document get a deeper one; tool cards deepen on hover. Page headers and the next-step line never float.
- Tool cards: 16px corners, 24px padding, about 270px tall, all the same height in a row.
- Buttons respond on press (scale to 97%); tool cards deepen their shadow on hover. Nothing slides or bounces. Reduced motion turns all of it off.
- Focus: a 2px ring in the text color, offset 3px.
- Loading uses skeletons shaped like the content; empty states give one sentence and one action; errors say what to do next; saves confirm in words.
- Tags: butter "High fit", lavender "Good fit" or "Analyzed", an outlined tag for "Not analyzed". Status is always a word.

## Still banned

Numbered tool cards or document sections, step indicators styled as pills, bulleted ad text (part markers only while "Show how this ad is built" is on), stacks of identical buttons, a single "featured" tool, tinted art areas, oversized background icons, gradients, glass, glowing orbs, dot grids, sparkle icons for AI, emoji, colored left stripes, bento grids, fake stats, animated arrows and confetti.
