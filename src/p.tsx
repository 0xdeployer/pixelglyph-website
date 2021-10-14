import { css, SerializedStyles } from "@emotion/react";
import React from "react";

const styles = {
  p: css`
    font-size: 1.1rem;
    line-height: 2;
  `,
};

export default function P({
  children,
  styles: _styles,
}: {
  styles?: SerializedStyles;
  children: React.ReactNode;
}) {
  return <p css={css(styles.p, _styles)}>{children}</p>;
}
