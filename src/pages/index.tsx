import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Layout from "@theme/Layout";
import clsx from "clsx";
import styles from "./index.module.css";

function HomepageHeader() {
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <img
          style={{ marginBottom: "20px" }}
          width={300}
          src={require("@site/static/img/logo.png").default}
          alt="fireodm Logo"
          className={styles.logo}
        />
        {/* Descrição mais detalhada */}
        <p className="hero__subtitle">
          Fireodm brings type-safe models, Zod validation, and seamless relation
          loading to your Firestore workflows—write less boilerplate and ship
          faster.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="FireODM – decorator-based ODM for Firestore in Node.js"
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
