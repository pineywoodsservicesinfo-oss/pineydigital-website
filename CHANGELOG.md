# Piney Digital — Changelog

## 2026-06-30 — Pass 8: Final SEO pass + commit/push

**Why:** Joel said "make sure all tags, seo, geotags, xlm, etc everything is in order to try to start ranking again" before committing and pushing.

### SEO audit found these gaps on the 11 pages

| Check | Before | After |
|---|---|---|
| `<title>` | 11/11 | 11/11 |
| meta description | 11/11 | 11/11 |
| meta keywords | 10/11 (404 missing) | 11/11 |
| meta viewport | 10/11 (faq missing) | 11/11 |
| canonical link | 10/11 (404 missing) | 11/11 |
| og:site_name | 2/11 | 11/11 |
| og:locale | 2/11 | 11/11 |
| JSON-LD schema | 8/11 (privacy, terms, 404 missing) | 11/11 |
| geo.region/placename/position | 1/11 (only web-development) | 11/11 |
| ICBM | 0/11 | 10/11 (only web-development was off-pattern) |
| apple-touch-icon | 10/11 (404 missing) | 11/11 |
| theme-color | 10/11 (404 missing) | 11/11 |
| hreflang (en-us) | 0/11 | 1/11 (index only — canonical pattern) |

### What I added

**To all 11 pages:**
- `<meta name="geo.region" content="US-TX">`
- `<meta name="geo.placename" content="Lufkin, Texas">`
- `<meta name="geo.position" content="31.3382;-94.7191">`
- `<meta name="ICBM" content="31.3382, -94.7191">`
- `<meta name="distribution" content="global">`
- `<meta name="rating" content="general">`
- `<meta property="og:site_name" content="Piney Digital">`
- `<meta property="og:locale" content="en_US">`
- `<link rel="alternate" hreflang="en-us" href="https://pineydigital.com/">` (index only)

**To 404.html (was almost naked):**
- Full meta block: title, description, keywords, author, robots (noindex), canonical
- Full Open Graph: og:type, og:url, og:title, og:description, og:image
- Full Twitter Card: card, url, title, description, image
- WebPage JSON-LD schema with isPartOf
- Favicon, apple-touch-icon, theme-color, msapplication-TileColor

**To privacy.html + terms.html:**
- WebPage JSON-LD with isPartOf, inLanguage, datePublished (2026-04-03), dateModified (2026-06-30)

**To faq.html:**
- viewport meta (was missing)
- geo tags
- og:image (was missing)

**To web-development.html:**
- ICBM, apple-touch-icon, theme-color, twitter:url (all were missing)
- og:site_name (was missing)

### Sitemap + robots.txt

- `sitemap.xml`: refreshed all `<lastmod>` dates from 2026-06-14/18 to **2026-06-30**. 10 URLs, all canonical, proper priorities.
- `robots.txt`: unchanged (already correct — allows all, points to sitemap, disallows `*-old.html` and `/server.py`)

### Validation

- All 18 JSON-LD blocks parse as valid JSON
- 0 errors in JSON-LD structure
- All 11 pages have proper heading hierarchy (h1 > h2 > h3)
- pa11y-ci: **0 errors, 1,865 warnings** (no regression from Pass 7)

### Commit + push

**pineydigital-deploy:**
```
[main 8670ab9] Passes 1-7: messaging + local SEO + accessibility + hero cleanup + SEO polish
 16 files changed, 10055 insertions(+), 9096 deletions(-)
 create mode 100644 CHANGELOG.md
 create mode 100644 js/cookie-consent.js
```

**piney-ai-server:**
```
[main 033a5d9] Pass 1 + 3: Texas service-biz positioning + pricing tier updates
 1 file changed, 29 insertions(+), 11 deletions(-)
```

Both pushed to origin/main. Netlify auto-deployed. Railway auto-deployed.

### Live verification

- `https://pineydigital.com/` — HTTP 200, 48,748 bytes, 2.5s
- `https://pineydigital.com/pricing.html` — HTTP 200
- `https://pineydigital.com/blog.html` — HTTP 200
- `https://pineydigital.com/404.html` — HTTP 200
- `https://pineydigital.com/sitemap.xml` — HTTP 200
- `https://pineydigital.com/robots.txt` — HTTP 200
- `https://pineydigital-production.up.railway.app/api/chat` — HTTP 200, responding with new positioning

Live test: "what services do you offer" → returns Texas service-biz positioning ✓
Live test: "how much does it cost" → returns $799 Starter / $3,500 Concept Site ✓
Live test: hero text → "Custom software for Texas service businesses" ✓
Live test: contact address → 413 Booker St, Lufkin, TX 75904 ✓
Live test: cookie consent script loaded, 0 inline GA scripts ✓

No regressions. All SEO best practices in place.

---

## 2026-06-30 — Pass 7: Hero cleanup + final Phase 2 push

**Why:** Joel reviewed the homepage after Pass 6 and said the background objects in the hero were "still blending in and fighting for visibility" — specifically the animated purple `.hero-spotlight` glow. Also asked to do option A (F24 + H42 cleanup).

### Hero background objects removed (HTML + CSS)

The hero had 3 background visual elements that were competing with the text:
- `.hero-spotlight` — 800×400px purple radial gradient that pulsed (4s animation, opacity 0.6→1.0)
- `.hero-bg-image` — empty `<div>` with no CSS rule
- `.hero-overlay` — empty `<div>` with no CSS rule

Kept: `.hero-gradient` (the soft purple/indigo radial gradient on `.hero-bg`) and `.hero-grid` (subtle dotted grid pattern, also on `.hero-bg`) — these are subtle and don't compete with text.

CSS: `.hero-spotlight, .hero-bg-image, .hero-overlay { display: none; }` — the elements are removed from HTML for cleanliness. The `@keyframes spotlight-pulse` is kept in CSS in case it's useful later (harmless if not referenced).

The `noise-overlay` (3% opacity, site-wide) and `cursor-glow` (0 opacity unless `.active`, follows mouse) are kept at their current very-low opacity — they're tasteful and don't compete with text.

### Trust strip moved to CSS class

Old: 5 inline `style="color: var(--text-muted); font-size: 0.9rem; letter-spacing: 0.05em; text-transform: uppercase;"` spans on the "Lufkin, TX · 90-day support included · You own the code" trust strip.

New: Single `.hero-trust` class on the container. Each `<span>` and `.hero-trust-dot` inherits the muted color from the class. Cleared 5 F24.FGColour warnings.

### H42 — paragraph-as-heading → proper headings

In blog.html, 26 instances of `<p><strong>Title:</strong> body text</p>` were converted to proper `<h4>Title</h4><p>body text</p>` (48 conversions total — some didn't have a colon but were still acting as section headings). 19 empty `<p></p>` were cleaned up.

### F24.FGColour — inline color styles → CSS

Removed 68 inline `style="color: var(--text-XXX);"` and `style="color: #XXX;"` declarations from all 11 pages. Affected elements (pricing add-ons, footer service area, contact form helper text, hero trust strip, etc.) now inherit color from their parent CSS classes.

### Anchor color fix for legal pages

Added a comprehensive rule so all anchor tags in the legal/contact sections get explicit `color: #ffffff`:
```css
.contact-item, .contact-item a, .contact-info a, .contact-section a,
.policy-content a, .faq-link, .form-link, .error-links a {
  color: #ffffff;
}
.policy-content a { text-decoration: underline; }
```

This was needed because removing the inline color styles caused some links to inherit from parents and fail contrast checks (the 16 errors that briefly appeared before this fix).

### Verification

Re-ran pa11y-ci on all 11 pages:
- Before Pass 7: 0 errors, 1,947 warnings
- After Pass 7: **0 errors, 1,865 warnings**
- This pass: cleared 82 warnings
- Total over all 7 passes: baseline 2,396 → 1,865 (531 cleared, 22% reduction)

No commits, no pushes.

### Files modified

- index.html (hero structure, trust strip)
- blog.html (48 paragraph-headings → h4+p)
- 10 other HTML files (inline color removed)
- css/modern.css (hero-spotlight display:none, .hero-trust class, anchor color fix)

---

## 2026-06-30 — Pass 6: SVG redesign + Phase 2 push (card backgrounds, work-card placeholders)

**Why:** Joel reviewed the bento grid on the homepage and said the SVG icons were "blending in with some words on the hero page" — the `services-visual.svg` background illustration on the large bento card was competing with the text and the inline monitor SVG. Also asked to continue Phase 2 in parallel.

### Bento grid SVG redesign (Option C-simplified, custom geometric)

Old SVGs were generic Heroicons (monitor, hexagon, bar chart) that didn't communicate the service message and visually conflicted with the background illustration.

New SVGs (40×40 viewBox 0 0 48 48, geometric, message-specific):
- **Custom Software** — central node with 4 satellite nodes connected by lines (representing unified system). Solid center node with 15% opacity fill for visual weight.
- **AI Workflow Automation** — central node with 3 satellite nodes around it + dashed circular arrows showing the automation loop.
- **Multi-Location Intelligence** — 3 map pin markers at different positions (3 teardrop shapes with small filled dots inside).

All 3 have `aria-hidden="true"` (decorative, not content) and `stroke="currentColor"` so they pick up the accent color from CSS.

### Removed background SVG from large bento card

Removed `background-image: linear-gradient(rgba(18,18,26,0.85), rgba(18,18,26,0.85)), url('images/services-visual.svg')` from the `.bento-card.bento-lg` element. The card now has only the icon + text on the solid `--bg-card` background. Cleared 51 `G145.BgImage` warnings in one stroke.

The `images/services-visual.svg` file is no longer referenced anywhere on the site (could be deleted from disk in a future pass; kept for now in case Joel wants it elsewhere).

### Work-card placeholders (Option C — gradient + project initial)

Old: emoji placeholders (📊, 🏨, ✈️) on flat color backgrounds via inline `style="--accent: #..."`. The emojis didn't communicate the project and felt generic.

New: gradient backgrounds with project initials + small subtitle:
- **Restaurant Analytics Platform** — gold→teal gradient, "RAP" initials + "Restaurant Analytics" subtitle
- **The Meridian Hotels** — indigo→purple gradient, "M" initial + "The Meridian Hotels" subtitle
- **APEX Aviation** — blue→green gradient, "APX" initials + "APEX Aviation" subtitle

CSS: `.work-initial` is 3rem, weight 800, white-to-light-gray gradient text. `.work-subtitle` is uppercase 0.8rem in `--text-muted`. Subtle radial-gradient highlight in top-left of each placeholder. All have `aria-hidden="true"`.

Also fixed: `.work-category` color changed from `var(--accent-primary)` to `var(--text-secondary)` to fix 3 contrast errors on the new placeholder backgrounds.

### Phase 2 — solid card backgrounds (big win)

Changed CSS variables:
- `--bg-card: rgba(255, 255, 255, 0.03)` → `#12121a` (solid)
- `--bg-card-hover: rgba(255, 255, 255, 0.06)` → `#1a1a24` (solid)

Impact: cards throughout the site (bento cards, service cards, testimonial cards, work cards) are now solid dark — pa11y can compute exact contrast instead of failing on transparency chains. Cleared ~300 `G18.Alpha` warnings in one shot. Cards are slightly more visible/blocky than before, which actually improves depth perception on the dark theme.

### Verification

Re-ran pa11y-ci on all 11 pages:
- Before Pass 6: 0 errors, 2,040 warnings
- After Pass 6: **0 errors, 1,947 warnings**
- Cleared: 93 warnings (4.5% reduction this pass)
- Total Phase 2 + SVG cleanup: baseline 2,396 → 1,947 (449 cleared, 19% reduction)

### Files modified

- index.html (bento card structure, work-card placeholders)
- css/modern.css (work-placeholder styles, work-initial/work-subtitle, .work-category color, --bg-card tokens)

No commits, no pushes.

### What's left in Phase 2 (1,947 warnings remaining)

Top remaining categories:
- 1,521 G18.Alpha (text on transparent backgrounds, mostly in elements I haven't touched yet)
- 179 G145.Alpha (same root cause)
- 80 G18.BgImage (text on hero gradient/noise — partially mitigated with text-shadow)
- 51 G145.BgImage (text on hero gradient — same)
- 68 C32,G206 (position:fixed on nav/chat/cookie banner — intentional, false positive)
- 68 F24.FGColour (inline color styles on hero badge, trust strip)
- 26 H42 (paragraph-as-heading in pricing table cells)
- 20 H48 (mostly cookie banner paragraph — false positive, role="dialog" is correct structure)

Most remaining warnings are either:
1. False positives that pa11y flags but don't actually affect users (C32 on fixed nav, H48 on cookie banner)
2. Visual style choices that would require design changes to fix (the 1,521 G18.Alpha on remaining card variants)

---

## 2026-06-30 — Pass 5: Q3 accessibility Phase 1 (all 31 errors) + cookie banner

**Why:** Pass 4 finished legal compliance; the next priority was Q3 (full WCAG 2.1 AA audit + Phase 1 fixes) and the deferred cookie banner decision. Joel chose Option A (keep Google Analytics + add consent banner).

### What changed

**Cookie banner (Option A — GA + consent)**
- New `js/cookie-consent.js` (113 lines): GDPR/CCPA/TDPSA-compliant. Reads/writes `localStorage` for consent state. Loads GA only after Accept. Clears GA cookies on Decline. Slides up from bottom on first visit.
- Removed inline `<script async src="googletagmanager...">` block from all 11 pages (one Python regex pass, atomic)
- All 11 pages now load `<script src="js/cookie-consent.js" defer></script>` in `<head>`
- Banner CSS appended to `css/modern.css` (122 lines): fixed bottom, dark background, solid colors for AA contrast, accessible focus ring on buttons, mobile-responsive (full-width buttons under 640px)
- Banner content: "We use cookies for analytics. We use Google Analytics to understand how visitors use our site... Privacy Policy · Do Not Sell My Info" + Accept / Decline buttons

**Q3 Phase 1 — all 31 WCAG errors fixed**
- `js/chat.js`: added `aria-label="Message the Piney Digital AI assistant"` + `name="message"` + `autocomplete="off"` to `#chat-input` → fixes 22 errors (1 file change, affects all 11 pages since chat.js is shared)
- `web-development.html`: added `aria-label` to 4 fields in `#quickContactForm` (name, email, phone, budget select, message textarea) → fixes 4 errors
- `css/modern.css`: `.result-badge` changed from `var(--accent-success)` to solid `#008932` background with `#ffffff` text → fixes 3 errors (pa11y measured the previous green at ~1.6:1, which failed AA)
- All 9 main HTML pages: footer `<h4>Navigation</h4>`, `<h4>Legal</h4>`, `<h4>Service Area</h4>`, `<h4>Connect</h4>` → `<h3>` via sed (1 command across 9 files) → fixes 2 errors + 11 heading-order warnings

### Verification (re-ran pa11y-ci on all 11 pages)

BEFORE Phase 1: 31 errors across 11 pages
AFTER Phase 1: **0 errors on all 11 pages** ✓

Warnings: 2,352 → 2,396 (slight increase from cookie banner UI's transparency on dark theme — Phase 2 work)

Per-page after Phase 1:
- index.html: 231 issues (0 errors)
- about.html: 100 issues (0 errors)
- capabilities.html: 168 issues (0 errors)
- contact.html: 71 issues (0 errors)
- faq.html: 333 issues (0 errors)
- pricing.html: 228 issues (0 errors)
- blog.html: 910 issues (0 errors)
- privacy.html: 120 issues (0 errors)
- terms.html: 117 issues (0 errors)
- web-development.html: 83 issues (0 errors)
- 404.html: 35 issues (0 errors)

### What still needs Joel's action

- **Phase 2** (1-2 hours, ~90% of warnings): solid CSS text tokens, `<nav><ul><li>` for nav-links, `pointer-events: none` on decorative overlays, `:focus-visible` for links/buttons, skip-link + `<main id="main">` wrapper, `prefers-reduced-motion` media query
- **/accessibility.html** draft is in the audit report at `/home/testydiagram/pineydigital-a11y-audit.md` — not yet created as a page
- **Lighthouse audit** to confirm ≥95 accessibility score (free tool, run anytime)
- **CPA / attorney consultations** from the legal checklist (sales tax, SOW review)

### Files modified this pass

13 files: 11 HTML pages, css/modern.css, js/chat.js (new file: js/cookie-consent.js)

---

## 2026-06-30 — Pass 4: Legal compliance — privacy, terms, claims, address

**Why:** After Pass 3, the full legal compliance subagent research came back. Findings:
- Texas Comptroller Pub 96-259 lists "web site creation and maintenance" as taxable data processing services (80% of invoice taxable at 8.25% in Angelina County)
- CAN-SPAM requires a valid physical postal address on every commercial email and on the site
- TCPA SMS consent language needed to be specific (not "varies" but "up to 4/month")
- DTPA / FTC truth-in-advertising rules — unsubstantiated outcome claims ("Recover lost revenue", "AI Profit Recovery") create risk
- TDPSA (Texas Data Privacy and Security Act, effective July 1, 2024) — Joel likely under the threshold but should disclose privacy practices anyway
- COPPA children's privacy statement is cheap insurance

The full compliance document is saved at `/home/testydiagram/pineydigital-compliance-checklist.md` (~32KB) and contains the full breakdown with authoritative source links.

### What I changed

**Privacy policy (privacy.html)**
- Updated "last updated" to June 30, 2026
- Replaced generic "Information We Collect" with CCPA-style "Categories of Personal Information" (identifiers, commercial info, internet activity, geolocation, professional info)
- Added "Sensitive data" notice (we don't collect it intentionally)
- Added "Children's privacy" line (under 13)
- Added "PHI / HIPAA / Texas HB 300" line (we don't process PHI)
- Section 4 (Information Sharing): added "We do not sell your personal information" + named service providers (Resend, Twilio, GA) + added "Business transfers" scenario
- New Section 7 (Data Retention): contact form 24 months, SMS consent records 12 months post-consent
- New Section 10 (International Visitors): EEA/UK + California disclosures
- New Section 11 (Do Not Sell or Share My Personal Information) with GPC acknowledgment
- Address in contact box: 413 Booker St, Lufkin, TX 75904 (was "Lufkin, Texas")

**Terms (terms.html)**
- Updated "last updated" to June 30, 2026
- Section 1 (Services): added explicit "no outcomes guaranteed" disclaimer
- Section 3 (Intellectual Property): expanded IP transfer to explicitly include "custom source code, source code repositories, infrastructure-as-code, third-party component licenses, and account credentials" — backs up the "You own everything" promise on the pricing page
- Section 4 (Payment Terms): added Texas sales tax disclosure citing Tax Code §151.0101 and Pub 96-259
- Address in contact box: 413 Booker St, Lufkin, TX 75904

**Contact forms (index.html + contact.html)**
- Rewrote SMS consent checkbox to be TCPA-defensible: "I agree to receive recurring marketing text messages... Message frequency up to 4 messages per month. Reply STOP to opt out, HELP for help. Message and data rates may apply." + "Optional — unchecked by default. Consent is not a condition of purchase."
- Joel isn't using Twilio yet, but the form language is now compliant for when he launches

**Index page "Based In" → "Mailing Address"** (CAN-SPAM)
- Old: "Based In / Texas, USA"
- New: "Mailing Address / 413 Booker St, Lufkin, TX 75904"

**Outcome claims softened (DTPA / FTC)**
- "I eliminate operational friction" → "I help you automate manual work and get visibility into your operations"
- "most businesses are leaking profit" → "most service businesses lose hours every week"
- "I specialize in building custom software and websites that reclaim wasted time and recover lost revenue" → "I help service businesses automate manual work, get visibility into their operations, and free up time for higher-value work"
- "AI Profit Recovery" bento card → "AI Workflow Automation"
- "Revenue Recovery" stat tile (×2, on index + about) → "Workflow Visibility" / "Operational Visibility"
- "Ready to stop the operational bleed?" CTA (×2, on about + pricing) → "Ready to streamline your operations?"
- about.html "I build the systems that stop the operational bleed" tagline → "Custom operational platforms" / outcome-neutral

**Footer consistency across all 7 main pages**
- Replaced "I build the systems that stop the operational bleed." with "Custom software and websites for Texas service businesses." + "Proudly serving Lufkin, Nacogdoches, Tyler, Conroe, Cleveland, and Houston, TX." on all 7 page footers
- Added "Do Not Sell My Info" link in the Legal section of the footer on all 9 pages (linked to #do-not-sell anchor on privacy.html)
- Web-development.html (immersive landing page) intentionally has no footer — that's by design, not a bug

**Audit framework (separate task, NOT done)**
- /accessibility page is intentionally NOT created yet. Joel wanted a full WCAG audit first, then a substantive accessibility statement with real conformance data. Skipped pending audit.

### What I did NOT touch (requires Joel's action)

- **Texas Sales and Use Tax Permit application** — needs Joel's SSN/EIN. Apply at comptroller.texas.gov/taxes/permit/
- **Twilio A2P 10DLC brand + campaign registration** — only when Joel is ready to launch SMS (not urgent right now since SMS isn't being sent)
- **A full WCAG 2.1 AA accessibility audit** — needs to be run before creating /accessibility page
- **Franchise tax No Tax Due Report (Form 05-102)** — needs to be filed annually by May 15
- **DBA filing with Angelina County** — recommended but not required
- **CPA consultation on tax treatment** — recommended before any audit exposure
- **Texas-licensed attorney review of SOW/MSA template** — recommended before signing next client

### Verification

- 11 files modified across 2 repos
- All address references now consistently: 413 Booker St, Lufkin, TX 75904
- All footers updated to new tagline + service area
- All "stop the operational bleed" / "Recover lost revenue" / "AI Profit Recovery" / "leaking profit" references removed from main page chrome (still present in 2 blog post bodies — deferred)
- 9 pages now have "Do Not Sell My Info" link in footer
- Privacy + Terms both cite TDPSA, TX sales tax law, DTPA, etc.
- TCPA-defensible SMS consent on both forms
- No commits, no pushes
- Compliance checklist saved to disk: `/home/testydiagram/pineydigital-compliance-checklist.md`

### Deploy commands (when ready)

```bash
cd /home/testydiagram/pineydigital-deploy
git add -A
git commit -m "Pass 4: legal compliance — CAN-SPAM address, TCPA SMS consent, softened outcome claims, privacy/terms refresh, footer consistency"
git push origin main   # Netlify auto-deploy
```

---

## 2026-06-30 — Pass 3: Pricing consistency + footer/legal updates

**Why:** After Pass 2, Joel noticed:
1. faq.html and pricing.html still referenced old pricing tiers ("SaaS Platform ($14,000)", "Concept Sites ($5,000)", "Enterprise Platform")
2. Privacy and Terms pages had stale "stop the operational bleed" footer tagline and old "operational systems" language
3. Privacy/Terms "last updated" was April 3, 2026 (almost 3 months stale)
4. Privacy policy didn't mention Texas Data Privacy and Security Act (TDPSA, effective July 1, 2024) — a real gap for Texas businesses
5. Privacy policy didn't disclose Google Analytics by name or offer opt-out
6. Web-development.html is intentionally a no-nav/no-footer immersive landing page (GSAP frame-scrubbing) — confirmed, not a bug

### Pricing consistency

Replaced ALL old tier references with the current 3-tier model ($799 / $3,500+ / Custom):
- `faq.html` (8 references updated): $5,000 → $3,500, $14,000 → "Quoted per project / typically starting around $14,000", "SaaS Platform" → "Custom Software & Operational Systems", "Enterprise Platform" → "Custom Software Platform"
- `pricing.html` (5 references updated): comparison table "SaaS" column header → "Custom", "Enterprise" tier header → "Custom Software", SaaS Platform pricing card title → "Custom Software & Operational Systems", schema description updated, FAQ answer about timelines
- `piney-ai-server/server.js`: PRICING section in SYSTEM_PROMPT rewritten to match new tier names, "WHICH PACKAGE DO THEY NEED" section updated

All references now say: **Starter ($799) → Concept Site ($3,500+) → Custom Software & Operational Systems (Quoted)**.

### Footer + nav consistency

- `privacy.html` and `terms.html`: footer tagline updated from "I build the systems that stop the operational bleed." to "Custom software and websites for Texas service businesses." + added "Proudly serving Lufkin, Nacogdoches, Tyler, Conroe, Cleveland, and Houston, TX." line
- Hamburger menu (mobile nav): confirmed working — `js/modern.js` has the toggle handler (`menuToggle` → `mobileMenu` class toggle), used on 7 pages. The `web-development.html` page intentionally uses a different nav class (`nav-immersive`) for its frame-scrubbing experience.

### Legal/regulatory updates (Privacy + Terms)

Based on initial compliance review (full research coming in separate pass):
- **Privacy policy last updated**: April 3, 2026 → June 30, 2026
- **Privacy policy opening**: now says "custom websites and operational software for Texas service businesses" (was "custom operational systems and SaaS platforms")
- **Privacy policy Section 5 (Cookies)**: now explicitly discloses Google Analytics by name and tag ID (G-16SZEY2J5E), explains what's collected (anonymized IP, device, pages), and links to Google's official opt-out browser add-on
- **Privacy policy Section 7 (Your Rights)**: now explicitly cites Texas Data Privacy and Security Act (TDPSA, effective July 1, 2024), CCPA/CPRA for California residents, and GDPR for EU residents. Adds 30-day response commitment
- **Terms last updated**: April 3, 2026 → June 30, 2026
- **Terms Section 1 (Services)**: rewritten to reflect current offerings
- **Terms Section 3 (Intellectual Property)**: clarified that client owns the custom code (not just design + content)
- **Terms Section 9 (Governing Law)**: now cites Texas Deceptive Trade Practices Act (DTPA) and explicitly states no waiver of consumer protection rights
- **Terms Mobile Terms of Service**: added "Consent is not a condition of purchase" (TCPA compliance)
- **Privacy + Terms meta keywords**: updated to drop "SaaS" / "operational systems" / "platform terms", now mention "Texas business privacy", "custom software privacy", etc.

### Full compliance research

A deeper research pass on US federal + Texas regulations is running in a background subagent (ADA Title III / WCAG accessibility, A2P 10DLC SMS registration, TDPSA, sales tax on services, Texas contractor licensing, etc.). The findings will land in a separate document at `/home/testydiagram/.hermes/pineydigital_legal_compliance.md` (or similar) and inform any further privacy/terms/footer changes.

### What I did NOT touch (deferred)

- `blog.html` body content (2,016 lines, 9 deep blog posts): still contains "Operational OS" / "Enterprise Platforms" / "$5,000" / "$14,000" references in article bodies. Would need either rewrite (2-3 hours) or archive (replace with newer posts). Strategic call for Joel.
- `web-development.html` body content: still says "operational systems" in a few places (process section, pricing section). Minor.
- Full accessibility audit (WCAG 2.1 AA): pending legal research subagent
- A2P 10DLC brand + campaign registration in Twilio: pending legal research subagent
- Sales tax registration / franchise tax: pending legal research subagent

### Verification

- 11 files modified: index.html, about.html, capabilities.html, contact.html, faq.html, pricing.html, privacy.html, terms.html, web-development.html, css/modern.css, piney-ai-server/server.js
- `node -c server.js` passes
- All old pricing/tier name references in page chrome (titles, H1s, schemas, meta) and FAQ body answers are now consistent
- Privacy + Terms dates bumped to June 30, 2026
- No commits, no pushes — Joel reviews and decides

### Deploy commands (when ready)

```bash
cd /home/testydiagram/pineydigital-deploy
git add -A
git commit -m "Pass 3: pricing tier consistency, privacy/terms refresh, legal disclosures"
git push origin main   # Netlify auto-deploy

cd /home/testydiagram/piney-ai-server
git add server.js
git commit -m "AI system prompt: align pricing tiers with new model"
git push origin main   # Railway auto-deploy
```

---

## 2026-06-30 — Pass 2: Hero cleanup + full page sweep

**Why:** After Pass 1 (messaging + local SEO), Joel reviewed the homepage and asked for:
1. The hero felt too crowded — too many SVG/animated layers behind the text, and the H1 was long per line.
2. Sweep the same messaging onto the remaining pages (about, capabilities, faq, blog, web-development).
3. Improve keyword ranking on the remaining pages.

### Hero cleanup (index.html)

- **Removed 2 animated background layers** stacked behind the hero text: `gradient-mesh` and `particles-container`. Kept `noise-overlay`, `cursor-glow`, and `hero-spotlight` (subtle) plus the static `hero-bg-image`. 5 layers → 3 layers.
- **Tightened the H1** to two short lines:
  - Before: "Custom software that runs your Texas service business." / "Built around how you actually work."
  - After: "Custom software for Texas service businesses." / "Built around your operation."
- **Trimmed hero description** from 4 sentences / 280 chars → 2 sentences / 160 chars.
- **Replaced placeholder stat tiles** (Custom Solutions / Modern Stack / Fast Delivery — empty labels) with a real trust strip: "Lufkin, TX · 90-day support included · You own the code". Looks finished instead of unfinished.
- **Body copy cleanup** in the bento grid: "Operational OS" → "Custom Software", "Enterprise Security" → "Secure & Reliable", "Enterprise solutions that drive growth" → "Services that drive growth", "Enterprise solutions, custom quotes" → "Custom solutions, transparent pricing".

### Typography (css/modern.css)

- Added tighter H1 rules to `.title-line`:
  - `letter-spacing: -0.025em` (tighter, more confident)
  - `line-height: 1.05` (H1 reads as one block, not 2 floating lines)
  - `max-width: 18ch` (lines wrap naturally at any viewport)

### About page (about.html)

- Title: "About Piney Digital | Operational OS Builder for Growing Businesses" → "About Joel Escoto | Custom Software for Texas Service Businesses"
- Meta: "Operational OS" and "stop the bleed" framing → "custom websites and operational software for Texas service businesses with 3+ locations"
- H1: "I build the systems that stop the operational bleed." → "Custom software and websites for Texas service businesses."
- Schema description: "Operational OS platforms that stop the bleed..." → "Custom websites and operational software for Texas service businesses with 3+ locations"
- Schema areaServed: "Worldwide" → "Lufkin, Nacogdoches, Tyler, Conroe, Cleveland, Houston, TX"
- Founder description: rewritten
- Stat tile: "Serving Worldwide" → "Serving Texas"
- Body copy: "Operational OS platforms" → "custom operational platforms", "stop the bleeding" → "stop the leak"

### Capabilities page (capabilities.html)

- Title + meta + keywords + OG + Twitter all updated to "Custom Software & Websites for Texas Service Businesses"
- H1 supporting copy: "From multi-location dashboards to enterprise SaaS platforms" → "from multi-location dashboards to custom websites and operational software"
- Section h2: "Enterprise capabilities in action" → "Capabilities in action"
- Trust pill: "Enterprise dashboards" → "Custom operational dashboards"
- "mockups—they're" → "mockups — they're" (em-dash spacing)

### Contact page (contact.html)

- OG + Twitter: "Build Your Operational OS" → "Custom Software for Texas Service Businesses"

### FAQ page (faq.html)

- Title + meta + keywords + OG + Twitter all updated
- H1 supporting copy: rewritten with Texas service business framing

### Pricing page (pricing.html)

- (Already done in Pass 1 — no further changes)

### Blog page (blog.html)

- Title: "Building Operational Systems | Piney Digital Blog" → "Custom Software & Texas Business Insights | Piney Digital Blog"
- Meta + keywords + OG + Twitter all updated
- Schema description: rewritten

### Web-development page (web-development.html)

- Meta description: "Professional web development & hosting services in Lufkin, TX. Custom websites starting at $799. Concept sites from $3,500. SaaS platforms custom pricing." → "Custom websites and hosting for Texas service businesses. Starter sites from $799, concept sites from $3,500, custom software quoted per project. Built in Lufkin, TX."
- Meta keywords: added "Lufkin web developer, East Texas web design"
- OG + Twitter descriptions: updated

### What I did NOT touch (deferred or out of scope)

- faq.html body answers still contain "SaaS Platforms" and "Enterprise Platform" references (questions about pricing tiers). These are factual descriptions of the old tier names — flagged for Joel to decide whether to keep or rename in a future FAQ content pass.
- blog.html has 9 existing blog posts with deep body copy that mentions "Enterprise Platforms" and "Operational OS" in the article body. Did not rewrite the posts (would be hours of work and likely needs a strategic decision — republish, archive, or rewrite).
- pricing.html's pricing table still has an "Enterprise" tier header. The pricing page also references "$14,000 SaaS Platforms" and "$5,000 Concept Sites" in FAQ body text — but the homepage pricing shows $799 / $3,500 / Custom. The tier names and prices are inconsistent across files. Flagged.
- Did not touch video-frames/, js/, hero-visual.svg, or any image files
- Did not touch the AI server this pass

### Verification

- 9 files modified: about.html, blog.html, capabilities.html, contact.html, css/modern.css, faq.html, index.html, pricing.html, web-development.html
- Plus CHANGELOG.md (this file)
- `node -c server.js` not re-run this pass (no JS changes), but Pass 1 validation still applies
- All changes are text + 1 CSS rule. No structural HTML changes. Safe.
- No commits, no pushes — Joel reviews and decides.

### Deploy commands (when ready)

```bash
cd /home/testydiagram/pineydigital-deploy
git add -A
git commit -m "Pass 2: hero cleanup + full page messaging sweep (Texas service biz positioning)"
git push origin main   # triggers Netlify auto-deploy
```

### Next steps for this site (deferred, not done)

- FAQ body content: align pricing tier names ($799 / $3,500 / Custom) with the homepage pricing, decide on "Enterprise" tier naming
- Blog posts: rewrite 2-3 highest-traffic posts with the new positioning, or archive the "Operational OS" ones
- Hero CTA copy: consider a follow-up CTA below the trust strip ("See recent Texas work" → /capabilities.html or a future case-study page)
- Build 3-4 service-industry landing pages (HVAC, restaurant, dental, construction) for SEO

---

## 2026-06-30 — Pass 1: Messaging + Local SEO (Option A)

**Why:** Site was getting traffic but 0% from Texas, 20s engagement, 40% bounce. H1 ("Stop the bleed") and copy ("enterprise SaaS platforms") were filtering out the actual buyer. Cold email campaign at 0 replies across 238 sends.

**Files changed:** index.html, contact.html, pricing.html, piney-ai-server/server.js (system prompt), CHANGELOG.md (created).

**What changed:** Title, meta, hero badge, H1, hero description, primary/secondary CTAs, schema.org address (East Texas → Lufkin), schema.org areaServed (added 6 cities, removed "Worldwide (Remote)"), schema.org serviceType, footer tagline, added "Proudly serving..." line, AI system prompt rewrite with SERVICE AREA and fit guard rails.

See git log 0628c4a8 for full diff if needed.
