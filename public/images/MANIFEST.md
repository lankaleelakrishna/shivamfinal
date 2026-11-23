# Image manifest

Every image shown on the Sri Shivam Infotech website, where it comes from and the licence that allows its use.

## Service photos

The Services page uses the six photos in `public/brand/` (listed below). The WebP copies in `public/images/services/` are kept but no longer referenced.

| File | Used on | Source | Licence |
|---|---|---|---|
| `public/brand/01-web-application-development.png` | Services: Web Application Development | Supplied by the company; `public/brand/01-web-application-development.png` | **To be confirmed** |
| `public/brand/02-mobile-application-development.png` | Services: Mobile Application Development | Supplied by the company; `public/brand/02-mobile-application-development.png` | **To be confirmed** |
| `public/brand/03-custom-software-development.png` | Services: Custom Software Development | Supplied by the company; `public/brand/03-custom-software-development.png` | **To be confirmed** |
| `public/brand/04-ai-powered-solutions.png` | Services: AI-Powered Solutions | Supplied by the company; `public/brand/04-ai-powered-solutions.png` | **To be confirmed** |
| `public/brand/05-ui-ux-design.png` | Services: UI/UX Design | Supplied by the company; `public/brand/05-ui-ux-design.png` | **To be confirmed** |
| `public/brand/06-digital-product-development.png` | Services: Digital Product Development | Supplied by the company; `public/brand/06-digital-product-development.png` | **To be confirmed** |

Confirm the original source and licence for each file. Photos from Unsplash, Pexels or another stock site need the photographer's name and the photo's page URL. AI-generated images need the tool name and its licence terms.

## Other images in use

| File or source | Used on | Source | Licence |
|---|---|---|---|
| `public/brand/logo-mark.png` | Header, footer, favicon, social previews | Company logo, supplied with the project | Company-owned |
| Site artwork (`src/components/art/Artwork.tsx`) | Home (Explore cards), About, Industries, Clients, Blogs, Contact | Original SVG drawings created for this project. They contain no photographs, text, third-party assets, customer logos or HireVaani app screens. | Project-owned |
| `public/images/services/*.svg` | Fallback illustrations, not currently shown | Exported from `Artwork.tsx` | Project-owned |
| Product 3D models (`src/components/three/models/`) | Home and Portfolio product showcase | Built in code for this project | Project-owned |

### Artwork kinds

- `code`: abstract code window (no real code or UI).
- `device`: two abstract phone outlines with generic blocks (no app screens).
- `design`: wireframe layout with a drawn curve.
- `network`: connected nodes.
- `people`: abstract team figures.
- `building`: office blocks.
- `bars`: rising bar chart.
- `campus`: campus building.

## Not yet in use

- **HireVaani Worker and HireVaani Recruiter screenshots:** not supplied. The product screenshot areas stay empty until genuine screenshots are provided. No app screens have been created or recreated.
- **Client logos and testimonials:** none. The Clients page shows verified in-house products only.

## Adding a photograph later

1. Confirm the licence on the photo's own page. Reject Unsplash+ or any paid licence.
2. Save the file under `public/images/` as WebP or AVIF, at 2000 px wide or less.
3. Add a row to the table above with the photo's page URL, the photographer's name and the licence.
4. Set alternative text that describes what the photo shows.
