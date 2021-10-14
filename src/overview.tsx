import React from "react";
import { styles } from "./App";
import P from "./p";
import Heading from "./heading";
import { css } from "@emotion/react";
import { Link } from "react-router-dom";

export default function Overview() {
  return (
    <div css={styles.wrap}>
      <Link to="/">
        <P>Back</P>
      </Link>
      <Heading>Overview</Heading>
      <P>
        Pixelglyphs are a set of 10,000 on-chain NFTs generated at time of
        creation using a cellular automaton. When you mint a Pixelglyph the
        cellular automaton algorithm is run within the Ethereum smart contract.
        This means nobody knows what your Pixelglyph will look like until after
        the transaction completes! The pixel matrix which makes up your
        Pixelglyph, along with the randomly generated colors, are stored as
        event data on the Ethereum blockchain. That data can be pulled from the
        blockchain at any time and used to recreate the image of your Pixelglyph
        using a JavaScript function that runs in your browser. All you need is
        Ethereum and a browser to re-create your glyph at any time.
      </P>
      <Heading>Wait There's More</Heading>
      <P>
        Ok, so now you know what Pixelglyphs are, but is there more to them than
        adorable, fun little glyphs that will live on Ethereum for as long as it
        exists? The answer is yes. They are forever avatars that will be the
        gateway to your global, decentralized, anonymous identity across the
        internet. The Pixelglyph development team is building a library that
        dApps across the internet can easily plugin to their platform to
        identify you by your chosen NFT avatar.
      </P>
      <P>
        <strong
          css={css`
            font-size: 1.4rem;
          `}
        >
          With each Pixelglyph you own you will be able to claim a ".glyph" NFT
        </strong>
        .
      </P>
      <Heading>Tell Me More About ".glyph" NFTs</Heading>
      <P>
        Information about your public profile including your default avatar will
        be stored within your ".glyph" NFT. Think “the decentralized version of
        Gravatar mixed with .ens names”. You will be able to equip your default
        avatar NFT using a specialized smart contract on Ethereum. Using the
        Pixelglyph front-end library platforms like OpenSea, Swap.kiwi, or any
        other that connects to your web3 wallet can easily display your default
        avatar. In addition to this, using the library, funds can be sent
        directly to your avatar much like .ens domains, but using existing NFTs.
      </P>
      <P>
        The default avatars which will be supported at launch are Pixelglyphs
        and CryptoPunks.{" "}
      </P>
    </div>
  );
}
