import React from "react";
import { Web3Context } from "./web3Provider";
import { styles, Tile } from "./tiles";
import REQUEST_URL from "./data/REQUEST_URL";
import { css } from "@emotion/react";

type PartialMetadata = { name: string; image: string; tokenId: string };

export default function Owned() {
  const context = React.useContext(Web3Context);
  const hasAccount = !!context?.accounts;
  const [loaded, updateLoaded] = React.useState(false);
  const [metadata, updateMetadata] = React.useState<PartialMetadata[]>();

  React.useEffect(() => {
    const fn = async () => {
      if (hasAccount && !loaded) {
        if (!context.getContract || !context.accounts) return;
        const [account] = context.accounts;
        const contract = context.getContract();
        let balance = await contract.methods
          .balanceOf(context.accounts[0])
          .call();
        balance = parseInt(balance);
        const p = [];
        for (let i = 0; i < balance; i++) {
          const fn: () => Promise<PartialMetadata> = async () => {
            const tokenId = await contract.methods
              .tokenOfOwnerByIndex(account, i)
              .call();
            const metadata = await fetch(
              `${REQUEST_URL}/metadata/${tokenId.toString()}`
            ).then((res) => {
              return res.json();
            });
            return metadata as unknown as PartialMetadata;
          };
          p.push(fn());
        }

        const metadatas = await Promise.all(p);
        updateMetadata(metadatas);
        updateLoaded(true);
      }
    };
    fn();
  }, [hasAccount, context, loaded]);
  return !hasAccount ? null : (
    <div
      css={css(
        styles.wrap,
        css`
          margin-top: 4rem;
        `
      )}
    >
      <h1>Your Pixelgyphs</h1>
      {loaded && metadata && !metadata.length && (
        <p
          css={css`
            font-size: 1.2rem;
          `}
        >
          You don't own any Pixelglyphs ... yet.
        </p>
      )}
      {!loaded && (
        <p
          css={css`
            font-size: 1.4rem;
            font-family: "Inconsolata", monospace;
          `}
        >
          Checking your wallet for owned Pixelglyphs...
        </p>
      )}
      {metadata && metadata.length > 0 && (
        <div
          css={css`
            display: flex;
            flex-wrap: wrap;
          `}
        >
          {metadata.map(({ image, tokenId, name }) => (
            <Tile
              width="125"
              fontSize="0.6"
              name={name}
              image={image}
              tokenId={tokenId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
