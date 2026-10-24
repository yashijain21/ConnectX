# ConnectX Technologies website

Responsive React website built with Vite and Tailwind CSS. The site copy, solution categories and industries are kept in `src/data/content.js` for straightforward editing.

## Local development

1. Run `npm install`.
2. Copy `.env.example` to `.env.local` and fill in confirmed integrations.
3. Run `npm run dev`.

## Integrations

- `VITE_QUOTE_ENDPOINT`: HTTPS endpoint that accepts `multipart/form-data` fields and the optional BOQ file. Until set, the quote form validates input and tells visitors that their request was not sent.
- `VITE_NEWSLETTER_ENDPOINT`: HTTPS endpoint that accepts a form-data `email` field. Until set, the subscription form explains that signup is unavailable.
- `VITE_WHATSAPP_NUMBER`: verified international phone number, digits only, for the floating WhatsApp link. Until set, the floating action opens the contact page.
- `VITE_GA4_ID`: verified Google Analytics measurement ID (`G-...`). Analytics is not loaded until configured.

The current `hello@connectx.example` address and regional office fields are placeholders and must be replaced with approved ConnectX contact details. Brand logos, partner names and certifications are intentionally omitted until approved assets and verified details are supplied. The map embed is a location search placeholder until an approved office location is known.

Images are loaded from Unsplash image URLs. Replace them with approved, locally hosted ConnectX photography for production. Configure the production host to serve `index.html` as the fallback for client-side routes, and serve the site over HTTPS.
