import { Icon } from "@/components/icons/Icon";
import { buttonClass } from "@/components/ui/Button";
import { CopyAddressButton } from "@/components/sections/CopyAddressButton";
import { ADDRESS, CONTACT_ROWS } from "@/lib/constants";
import styles from "./Contact.module.css";

export function Contact() {
  return (
    <section id="contact" className="band" aria-labelledby="contact-title">
      <div className="wrap">
        <div className={styles.contact}>
          <div>
            <p className="eyebrow">Contact</p>
            <h2 id="contact-title">Visit our Hyderabad office</h2>
            <div className={styles.addrCard}>
              <span className={styles.icBox}>
                <Icon name="pin" />
              </span>
              <div>
                <address className={styles.addr}>
                  {ADDRESS.lines.map((line, i) => (
                    <span key={line}>
                      {line}
                      {i < ADDRESS.lines.length - 1 ? <br /> : null}
                    </span>
                  ))}
                </address>
                <p className={styles.phone}>
                  <a href={`tel:${ADDRESS.phone.tel}`}>{ADDRESS.phone.display}</a>
                </p>
                <div className={styles.actions}>
                  <CopyAddressButton text={ADDRESS.lines.join("\n")} />
                  <a className={buttonClass("line")} href={ADDRESS.mapsUrl} target="_blank" rel="noopener noreferrer">
                    Open in Maps
                    <Icon name="link" />
                    <span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className={`eyebrow ${styles.rowsEyebrow}`}>What we do</p>
            <ul className={styles.rows}>
              {CONTACT_ROWS.map(([k, v]) => (
                <li key={k}>
                  <span>{k}</span>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
