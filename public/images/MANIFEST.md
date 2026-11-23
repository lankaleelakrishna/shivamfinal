# Image manifest

Every image shown on the Sri Shivam Infotech website, where it comes from and the licence that allows its use.

## In use

| File or source | Used on | Source | Licence |
|---|---|---|---|
| `public/brand/logo-mark.png` | Header, footer, favicon, social previews | Company logo, supplied with the project | Company-owned |
| Site artwork (`src/components/art/Artwork.tsx`) | Home (Explore cards), About, Services, Industries, Clients, Blogs, Contact | Original SVG drawings created for this project. They contain no photographs, text, third-party assets, customer logos or HireVaani app screens. | Project-owned |
| Product 3D models (`src/components/three/models/`) | Home and Portfolio product showcase | Built in code for this project | Project-owned |

### Artwork kinds

- `code`: abstract code window (no real code or UI). Used for Services and the Software blog thumbnail.
- `device`: two abstract phone outlines with generic blocks (no app screens). Used for the Portfolio teaser and mobile services.
- `design`: wireframe layout with a drawn curve. Used for UI/UX design and the Blogs hero.
- `network`: connected nodes. Used for AI solutions, About, and the AI and hiring-trends blog thumbnails.
- `people`: abstract team figures. Used for Recruitment and Staffing and the Recruitment Technology blog thumbnail.
- `building`: office blocks. Used for Business and Enterprise, Custom Software and the Contact hero.
- `bars`: rising bar chart. Used for Digital Product Development, Clients, and the Hiring and HR Trends blog thumbnail.
- `campus`: campus building. Used for Education and Skill Development.

## Not yet in use

- **Stock photography (Unsplash or Pexels):** no photographs have been downloaded. Candidate Unsplash photo pages were identified, but Unsplash's site blocks automated access to the pages that confirm each photo's licence, so the image URLs could not be verified. Pexels blocks automated access in the same way. Until a licence-checked photo can be downloaded, the designed artwork above is used instead.
- **HireVaani Worker and HireVaani Recruiter screenshots:** not supplied. The product screenshot areas stay empty until genuine screenshots are provided. No app screens have been created or recreated.
- **Client logos and testimonials:** none. The Clients page shows verified in-house products only.

## Adding a photograph later

1. Confirm the licence on the photo's own page. Reject Unsplash+ or any paid licence.
2. Save the file under `public/images/` as WebP or AVIF, at 2000 px wide or less.
3. Add a row to the table above with the photo's page URL, the photographer's name and the licence.
4. Set alternative text that describes what the photo shows.
