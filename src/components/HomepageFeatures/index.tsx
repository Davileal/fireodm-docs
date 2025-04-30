import type { ReactNode } from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  imageSrc: any;
  description: ReactNode;
};

const FeatureList = [
  {
    title: "Decorator-Driven Models",
    imageSrc: require("@site/static/img/decorators.png").default,
    description: (
      <>
        Define your Firestore schema right in your TypeScript classes with
        @Collection, @StringField, @Relation and friends.
      </>
    ),
  },
  {
    title: "Zod Validation Built-In",
    imageSrc: require("@site/static/img/validations.png").default,
    description: (
      <>
        Every save/update runs a Zod schema under the hood — catch bad data
        before it ever hits your database.
      </>
    ),
  },
  {
    title: "Easy Relations & Hooks",
    imageSrc: require("@site/static/img/relations.png").default,
    description: (
      <>
        Link documents with simple @Relation + DocumentReferenceField, then call
        populate(). Use beforeSave, afterLoad, and more for custom logic.
      </>
    ),
  },
];

function Feature({ title, imageSrc, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <img
          src={imageSrc}
          className={styles.featureSvg}
          role="img"
          alt={title}
        />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
