import { css } from "@emotion/react";
import React from "react";

const styles = {
  heading: css`
    font-size: 1.4rem;
    font-family: "Inconsolata", monospace;
  `,
};

export default function Heading({ children }: { children: React.ReactNode }) {
  return <h2 css={styles.heading}>{children}</h2>;
}
