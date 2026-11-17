import { Icon } from "@/components/icons/Icon";
import { ParticleNetwork } from "@/components/effects/ParticleNetwork";
import { HeroVisual } from "@/components/sections/HeroVisual";
import { PickLink } from "@/components/ui/PickLink";
import { HERO } from "@/lib/constants";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <div className={styles.hero}>
      <ParticleNetwork />
      <div className={`wrap ${styles.wrap}`}>
        <div className={styles.band}>
          <div className={styles.grid}>
            <div>
              <h1 className={styles.title}>
                People who <em>fit</em>. Apps that <em>ship</em>.
              </h1>
              <p className={styles.lede}>{HERO.lede}</p>
              <div className={styles.cta}>
                <PickLink pick="hire">
                  Hire talent
                  <Icon name="arrow" />
                </PickLink>
                <PickLink pick="app" variant="ghost">
                  Start an app project
                </PickLink>
              </div>
              <ul className={styles.points}>
                {HERO.points.map((p) => (
                  <li key={p}>
                    <Icon name="check" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <HeroVisual />
          </div>
        </div>
      </div>
    </div>
  );
}
