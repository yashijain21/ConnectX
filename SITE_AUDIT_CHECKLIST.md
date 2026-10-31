# ConnectX website audit and delivery checklist

The site was audited before implementation. No PDF copy was present in the project or Downloads; the supplied ConnectX Website Brief DOCX was used as the available company source. The live Vercel homepage served the same project bundle, but every direct non-root URL tested returned 404 before the routing fix was added locally.

## Existing and preserved

- [x] Existing React, Vite, Tailwind project and ConnectX visual design retained.
- [x] Homepage sequence, solution tiles, main navigation, responsive styles, and quote/newsletter UI already existed.
- [x] Client-side pages already existed for all eight requested sections and six solution categories; GPON was added as a seventh solution.
- [x] Existing solution pages already had introductions, product lists, and quote CTAs; added matching brand category and industry context.

## Implemented locally

- [x] Added Vercel SPA fallback rewrite and verified local dev server returns 200 for root, eight main pages, seven solution URLs, legal routes, robots.txt, and sitemap.xml.
- [x] About page includes the supplied vision, mission, partner commitment, core focus, seven solution categories, CR `193507-1`, and Adliya office.
- [x] Industries includes all seven requested sectors.
- [x] Services includes the four exact named service areas.
- [x] Brands includes the supplied ConnectX and ExTell logo artwork and the Power, Servers, Cabling, Networking, UC/VoIP, Security, and AV/PA/Intercom categories.
- [x] Standards page and homepage strip display the supplied ANSI, TIA, ISO, IEC, RoHS, ECHA, UL, and ETL artwork, alongside IEEE text; applicability is unverified and no certification claim is made.
- [x] Homepage headline and tagline are present. Restored five value points verbatim from the existing committed homepage: A connected portfolio, A partner mindset, Project-aware support, Practical expertise, and Regional perspective.
- [x] Contact page and footer include the supplied email, phone, complete Adliya address, map embed, and working-hours placeholder.
- [x] Quote API sends to Sales and attempts an acknowledgement email via Resend; form returns clear errors when mail configuration is absent. Newsletter API uses a Resend audience when configured.
- [x] Added privacy, terms, and cookie pages; consent-gated GA4 loading; quote/newsletter event hooks; configured social link slots; sitemap, robots.txt, and Organization structured data.
- [x] Added `.env.example` with non-secret deployment settings.
- [x] Added Vite development middleware for the existing quote and newsletter handlers so local `/api/quote` and `/api/newsletter` requests no longer 404.

## Contact details from the supplied reference

| Item | Supplied detail | Status |
|---|---|---|
| Email | [sales@connectx-tech.com](mailto:sales@connectx-tech.com) | Added to contact page and footer |
| Phone | +973 77936545 | Added as a tap-to-call contact |
| Address | Office no-14, Building no-49, Road-2701, Block-327, Dream Building, Adliya | Added to contact page and footer |
| Working hours | To be supplied | Pending; no hours were provided, so none are invented |
| Google Map embed | To add | Embedded on Contact using the supplied Adliya address |

## Page content matrix from the supplied reference

| Page | Required content | Status |
|---|---|---|
| About Us | About text, vision, mission, core focus, partner commitment, company details (CR 193507-1, Adliya office) | Supplied copy and company details are included. |
| Solutions (×7) | Introduction and product list per domain, related brands, matching industries, quote button | Added GPON as a seventh solution. Partner logos remain approval-pending; industry tags describe potential fit. |
| Brands | Logos grouped by Power, Servers, Cabling, Networking, UC/VoIP, Security, AV/PA/Intercom | All seven categories are present. Official brand names and logos await verification/approval. |
| Industries | Commercial, Data Centres, Hospitality & Healthcare, Education, Industrial, Residential, Government | All seven sectors are present. |
| Services | Pre-sales & Design Assistance, Compliance Advisory, Project Supply Chain, Post-sales Support | All four service areas are present; coverage and availability await confirmation. |
| Standards | ANSI/TIA, ISO/IEC, IEEE, IEC/EN, RoHS/REACH, UL/ETL | All six are listed as references; product applicability and supporting evidence await verification. |

## Verification completed

- [x] `npm.cmd run build` succeeds.
- [x] `node --check` passes for both Vercel API handlers.
- [x] Local route smoke check returned HTTP 200 for all main routes, seven solution routes, three legal pages, sitemap and robots file.
- [x] Quote and newsletter handlers were exercised with mocked Resend responses; quote internal recipient and acknowledgement recipient were checked. No real email was sent.
- [x] Quote handler returned 503 with no credentials and newsletter rejected invalid email.
- [x] Local POST smoke checks reached both API handlers and returned clear 503 configuration messages instead of 404s.

## Pending source approval or deployment configuration

- [ ] Redeploy the project to Vercel to activate the locally added rewrite, API functions, SEO and static sitemap. Live non-root paths were 404 during the initial audit; they have not yet been rechecked after deployment.
- [ ] Configure `RESEND_API_KEY`, verified `RESEND_FROM_EMAIL`, and `RESEND_AUDIENCE_ID` in Vercel. Until then, quote submissions return a configuration error and no email is sent.
- [ ] Supply approved network-rack and access-control/intercom/CCTV/GPON photography, remaining verified brand names/logos, and any required image permissions.
- [ ] Supply a valid WhatsApp-enabled number, GA4 measurement ID, official social profile URLs, and office hours.
- [ ] Confirm which listed standards apply to which supplied products and provide supporting certification documents before making claims.
- [ ] Review privacy/terms/cookie draft wording and data-retention/process details with ConnectX. Configure final production domain in SEO and sitemap if it changes from the current Vercel URL.
- [ ] Create/confirm Google Business Profile and chosen CMS/content editing workflow; neither requires a website code change alone.
- [ ] Browser-driven desktop/mobile interaction and visual checks could not be performed in this environment (no browser surface available). Load time under three seconds also remains unmeasured.
