# Sri Shivam Infotech: Next.js site

A Next.js (App Router) + TypeScript + Three.js recreation of `Sri_Shivam_Infotech_3D_Demo-1.html`.
The HTML file is the design source of truth, and content, spacing and behaviour are ported 1:1.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

QA (run these first; see "Verification status" below):

```bash
npm run typecheck    # tsc --noEmit
npm run lint         # eslint (eslint-config-next, flat config)
npm run build && npm start
```

Requires Node ≥ 20.9. Dependencies: `next@16`, `react@19.2`, `three@0.180`. No UI libraries.

## Structure

```
src/
  app/            layout.tsx (fonts, metadata, cursor glow) · page.tsx · globals.css (tokens + primitives)
  components/
    layout/       Header (sticky, mobile menu) · Footer
    sections/     Hero · HeroVisual · CapabilitiesMarquee · WhyChooseUs · Services · Process
                  Industries · ProductsShowcase · ContactForms · Contact · CopyAddressButton
    three/        HeroScene · ProductScene · heroTextures · webgl (renderer, lights, loop, dispose)
                  support (WebGL check, no three import) · SceneErrorBoundary
      models/     hireNova · hireVaani · vivahLive · circle · parkNow
    effects/      ParticleNetwork · CursorGlow
    ui/           Button · PickLink · SectionHeading · ServiceCard · IndustryCard
    icons/        Icon (the reference's own SVG sprite, ported)
    providers/    FormTabProvider (CTA → form-tab selection)
  hooks/          useMediaQuery (reduced motion, pointer) · useInView
  lib/            constants · services · products · forms (all copy and data)
```

Styling uses CSS Modules per component, plus `globals.css` for design tokens (including the reference's dark-mode tokens) and the shared `.wrap` / `.band` / `.alt` / `.eyebrow` / `.ic` primitives.

## 3D and motion

- **Hero**: a job-board phone with six orbiting candidate cards and saffron tethers that tilts toward the pointer. Text on the canvas textures is redrawn in Manrope once fonts load.
- **Products**: all five scenes (resume scanner, microphone with voice-bar ring, heart with video phones and coins, Circle orbit rings with fading members, ParkNow car-parks-in-the-free-bay loop) share one scene and cross-fade by scale. You can drag to rotate with inertia, and there's a slow idle spin. The key light takes the product colour. Previous/next buttons, picker tabs with arrow/Home/End keys, and a 7-second auto-tour that stops on first interaction.
- **Colour fidelity**: the reference used three r128. Modern three is physically based, so `webgl.ts` turns off colour management, uses linear output and scales light intensities by π. The models therefore look like the reference, not darker or more saturated.
- **Performance**: scenes are `next/dynamic({ ssr: false })` chunks. Render loops stop when off-screen or when the tab is hidden. Pixel ratio is capped at 2 (1.5 on touch devices), frame-rate-independent easing is used, and the cursor-glow loop sleeps when idle. Geometries, materials, textures and the GL context are disposed on unmount. A fresh canvas is used per mount, so StrictMode is safe.
- **Reduced motion**: no marquee, cursor glow, auto-tour or particle animation. 3D scenes freeze on a static pose and only redraw when something changes (product switch, drag, resize).
- **Fallbacks**: WebGL2 is detected before the 3D chunk downloads. Without it, the hero shows the "Talent desk / Product desk" lists and the products stage shows the reference's fallback message. Renderer errors and chunk-load failures fall back the same way.

## Enquiry forms and email notifications

All three forms (Hire talent, Get an app quote, I am looking for a job) submit to `POST /api/enquiries`, a Next.js Route Handler that runs as a Vercel Serverless Function. The handler validates the submission on the server and emails it to the business inbox through Gmail SMTP (Nodemailer, `smtp.gmail.com:465`, TLS). Nothing is stored in a database or on the filesystem.

- `src/app/api/enquiries/route.ts`: the endpoint. Order of checks: same-origin, rate limit, body size, honeypot, validation, duplicate check, send.
- `src/lib/enquiry/validation.ts`: server validation. Field rules come from `FORM_FIELDS` in `src/lib/forms.ts`, so the server accepts exactly the fields the forms render. Unknown or repeated fields are rejected.
- `src/lib/enquiry/email.ts`: the HTML and plain-text email, and the SMTP send. All user values are HTML-escaped. A submission counts as sent only when Gmail accepts every recipient.
- `src/lib/enquiry/store.ts`: the in-memory rate limiter and duplicate guard.
- `src/lib/forms.ts → submitEnquiry()`: the browser side. Each submit gets a fresh submission id.

### Environment variables

Copy `.env.example` to `.env.local` for local work, and set the same names in Vercel. These are server-only: never prefix them with `NEXT_PUBLIC_`.

| Name | Value |
| --- | --- |
| `GMAIL_USER` | The Gmail address that sends the emails, e.g. `yourbusiness@gmail.com` |
| `GMAIL_APP_PASSWORD` | A 16-character Gmail App Password for that address (secret) |
| `ENQUIRY_TO_EMAIL` | Inbox that receives enquiries. Comma-separate to send to several. |

If a variable is missing or malformed, the endpoint returns a generic "temporarily unavailable" message. The server log names the variables that are wrong, never their values.

### Gmail App Password setup

Gmail SMTP needs an App Password. Your normal account password is refused.

1. Turn on 2-Step Verification for the Google account: Google Account, Security, 2-Step Verification.
2. Open Google Account, Security, App passwords (it appears once 2-Step Verification is on). If you use Google Workspace, your admin may need to allow app passwords.
3. Create an app password, name it e.g. "Website enquiries", and copy the 16-character code. Spaces in the code are ignored.
4. Set `GMAIL_USER` and `GMAIL_APP_PASSWORD` in `.env.local` locally and in Vercel.

Gmail limits: a personal account can send about 500 messages a day, and Workspace accounts about 2,000. Enquiries are far below that, but a flood of spam submissions would count against it, which is why the rate limit below matters.

### Vercel environment variables

In the Vercel project, go to Settings, then Environment Variables. Add `GMAIL_USER`, `GMAIL_APP_PASSWORD` and `ENQUIRY_TO_EMAIL` for **Production and Preview**, mark `GMAIL_APP_PASSWORD` as sensitive, then redeploy. Changes do not apply to existing deployments.

### Abuse protection

- **Honeypot**: a hidden `website_url` field. Any value there gets a success response and nothing is sent.
- **Rate limit**: 5 submissions per IP per 10 minutes, enforced in memory per instance. On Vercel, instances are not shared, so also add a Vercel Firewall rate-limit rule on `/api/enquiries` (Firewall, then Rules, then Rate limiting). That rule is the authoritative limit.
- **Size**: request bodies above 3.5 MB are refused (413). Resumes are capped at 3 MB and must be PDF, DOC or DOCX, checked by file signature.
- **Duplicates**: the browser blocks double-clicks while a request is in flight. The server ignores a repeated submission id within an hour. A failed send releases the id, so a retry is possible.

### Client behaviour

Loading state and disabled button while sending. The form resets only after the server confirms delivery. On failure, the entered data stays in place, and the error text comes from the server without internal detail.

## Intentional differences from the reference

- **Products band link colour**: changed from `#14509A` to `#8DB6E2`. The original was about 2:1 contrast on the dark navy band.
- **Products Previous/Next buttons**: in the reference, the full-size "3D not available" message covers them, so they can't be clicked when WebGL is off. Here they stay clickable.
- **Hero canvas text**: drawn in the brand body font instead of the generic `sans-serif`.

The section eyebrows ("SERVICES", "GET STARTED", …) render 17px and grey in the reference, because `.sec-head p` / `.form-side p` override `.eyebrow`. That has been matched. If you want the small saffron style the CSS seems to intend, delete the `:global(.eyebrow)` rule in `SectionHeading.module.css` and `ContactForms.module.css`.

## Verification status

See the delivery notes. Layout, interactions and SSR were tested in Chromium against the reference HTML. `tsc`, ESLint, `next build` and the WebGL scenes themselves could not be run in the build environment (no package installs).
