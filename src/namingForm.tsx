import { css } from "@emotion/react";
import React, { useContext, useState } from "react";
import Web3 from "web3";
import { common } from "./cta";
import { Web3Context } from "./web3Provider";

const styles = {
  input: css`
    padding: 1rem;
    width: 100%;
  `,
  label: css`
    display: block;
    font-size: 1.2rem;
    & span {
      font-family: "Source Sans Pro", sans-serif;
      font-size: 0.8rem;
    }
  `,
};

export default function NamingForm({ tokenId }: { tokenId: string }) {
  const context = useContext(Web3Context);
  const [name, updateName] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!context.getContract || !context.accounts?.[0]) return;
    if (name.length > 100) {
      alert("Name should be less than 100 characters");
      return;
    }
    const c = context.getContract();
    await c.methods
      .nameGlyph(tokenId, name.trim())
      .send({ from: context.accounts[0], value: Web3.utils.toWei("0.0025") });
  };
  return (
    <form onSubmit={submit}>
      <label css={styles.label}>
        Name
        <br />
        <span>
          Spaces will be trimmed from the beginning and end of the name. Names
          must be less than 100 characters long.
        </span>
      </label>
      <input
        value={name}
        onChange={(e) => {
          updateName(e.currentTarget.value);
        }}
        placeholder="Enter name"
        css={styles.input}
        type="text"
      ></input>
      <button type="submit" css={common.cta2}>
        Submit Name
      </button>
    </form>
  );
}
