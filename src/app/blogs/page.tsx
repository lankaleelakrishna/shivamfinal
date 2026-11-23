import type { Metadata } from "next";
import { Artwork } from "@/components/art/Artwork";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageMetadata } from "@/lib/seo";
import { BLOG_CATEGORIES } from "@/lib/site-content";
import styles from "./blogs.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Blogs | Sri Shivam Infotech",
  description:
    "Articles on recruitment technology, artificial intelligence, hiring and HR trends, software development and business technology.",
  path: "/blogs",
});

export default function BlogsPage() {
  return (
    <>
      <PageHero
        eyebrow="Blogs"
        title="Notes on hiring technology and software"
        lede="Five categories we will write about. No articles have been published yet, so each category shows its status below."
        art="design"
      />

      <section className="band" aria-labelledby="categories-title">
        <div className="wrap">
          <SectionHeading
            id="categories-title"
            eyebrow="Categories"
            title="What we write about"
            intro="Articles will appear under each category with the author and publication date once they are published."
          />
          <div className={styles.grid}>
            {BLOG_CATEGORIES.map((cat) => (
              <article key={cat.id} id={cat.id} className={styles.card}>
                <div className={styles.thumb}>
                  <Artwork kind={cat.art} label={`Thumbnail for ${cat.title}`} />
                </div>
                <div className={styles.body}>
                  <h2>{cat.title}</h2>
                  <p>{cat.summary}</p>
                  <span className={styles.status}>No articles published yet</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
