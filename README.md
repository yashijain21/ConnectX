# ConnectX Technologies website

Responsive React website built with Vite and Tailwind CSS. The site copy, solution categories and industries are kept in `src/data/content.js` for straightforward editing.

## Local development

1. Run `npm install`.
2. Copy `.env.example` to `.env.local` and fill in confirmed integrations.
3. Run `npm run dev`.

## Lead dashboard and email

- The quote API stores submissions in the MongoDB Atlas `leads` collection. Set server-only `MONGODB_URI` and `MONGODB_DATABASE`.
- The admin page is available at `/admin`. Configure `ADMIN_EMAIL`, a unique `ADMIN_PASSWORD` of at least 12 characters, and `ADMIN_SESSION_SECRET` with at least 32 characters. The API issues an eight-hour, signed, HttpOnly, SameSite=Strict session cookie; it is Secure in production. Never use a `VITE_` prefix for these values.
- Quote notifications use EmailJS with one template sent once to the owner and once to the customer. Set `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, and `EMAILJS_PUBLIC_KEY`; optionally set `EMAILJS_PRIVATE_KEY` for authenticated server-side requests. Set `OWNER_EMAIL` for the owner notification destination. The EmailJS template's To Email must be `{{to_email}}`, Subject `{{email_subject}}`, and Reply-To `{{reply_to}}`. The HTML to paste into the EmailJS template is in [`emailjs-lead-template.html`](./emailjs-lead-template.html).
- In the EmailJS template editor, add the uploaded file attachment as a **Form File Attachment** with parameter name `boq_file` to include optional BOQ uploads. The EmailJS API allows one send request per second; the server spaces owner and customer messages accordingly.
- If EmailJS domain allowlisting is enabled, add the public website origin to EmailJS Domains. The quote API forwards the request origin to EmailJS; set `EMAILJS_SOURCE_ORIGIN` when Vercel's request URL differs from the public site origin.
- `RESEND_API_KEY` and `RESEND_AUDIENCE_ID` remain only for the optional newsletter signup. They are not used for quote notifications.
- Add the EmailJS and database values in the Vercel project's Environment Variables before deploying. For local API testing, use `.env.local` with `npm run dev` or `vercel dev`; the Vite development server runs local quote and newsletter API middleware and loads the required server-side integration variables. Never commit EmailJS credentials or expose them with a `VITE_` prefix.
- The database connection is reused per warm serverless instance and starts with a small pool suitable for this low-volume lead workload. Monitor Atlas connection counts and adjust only if observed traffic or pool wait times require it.

## Other integrations

- `VITE_WHATSAPP_NUMBER`: verified international phone number, digits only, for the floating WhatsApp link. Until set, the floating action opens the contact page.
- `VITE_GA4_ID`: verified Google Analytics measurement ID (`G-...`). Analytics is not loaded until configured.

The supplied ConnectX and ExTell logos and standards marks are stored in `public/logos` and used in the header, partner portfolio, and standards page. Partner logos for the remaining brand categories and product-specific certification evidence have not been supplied. The map embed is a location search placeholder until an approved office location is known.

Most images are loaded from Unsplash image URLs. The cabinet photo on the homepage and Structured Cabling card is from Wikimedia Commons under CC BY-SA 3.0 and is credited in the UI. Replace stock imagery with approved, locally hosted ConnectX photography for production. Configure the production host to serve `index.html` as the fallback for client-side routes, and serve the site over HTTPS.
