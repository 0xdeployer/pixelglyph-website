import { css, keyframes } from "@emotion/react";
import React, { useCallback, useContext, useRef, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { common } from "./cta";
import REQUEST_URL from "./data/REQUEST_URL";
import Heading from "./heading";
import P from "./p";
import { normalizeIpfs } from "./tiles";
import { render } from "./utils/render";
import { Link } from "react-router-dom";
import NETWORK from "./data/NETWORK";
import CONTRACT_ADDRESS from "./data/CONTRACT_ADDRESS";
import { ConnectBtn } from "./cta";
import { Web3Context } from "./web3Provider";
import BN from "bignumber.js";
import NamingForm from "./namingForm";

const animateIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const styles = {
  // TODO: Split from app styles
  wrap: css`
    padding: 1rem;
    max-width: 1000px;
    margin: 0 auto;
    @media (max-width: 432px) {
      padding: 0.5rem;
    }

    & a,
    & a:visited {
      color: #2b0aac;
    }
  `,
  glyphHolder: css`
    text-align: center;
    & canvas {
      max-width: 100%;
      height: auto;
      width: 100%;
      max-width: 500px;
    }
    & #frame {
      border-radius: 8px;
      overflow: hidden;
      display: inline-flex;
    }
  `,
  preWrap: css`
    padding: 1rem;
    background: #e8e8e8;
    font-family: courier; mono-space;
  `,
  paginate: css`
    display: flex;
    justify-content: space-between;
  `,
  label: css`
    display: flex;
    align-items: center;
    & p {
      margin: 0;
      margin-left: 1rem;
    }
  `,
  animateIn: css`
    animation: ${animateIn} 1.5s forwards;
  `,
};

/* <a
target="_blank"
rel="noreferrer"
href={
  NETWORK === "mainnet"
    ? `https://opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId}`
    : `https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId}`
}
> */

const LS_KEY = "CHECKED";

export default function GlyphDetail() {
  const [loading, updateLoading] = React.useState(true);
  const [data, updateData] = React.useState<{
    colors: [string, string, string];
    description: string;
    image: string;
    matrix: number[][];
    name: string;
  }>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const context = useContext(Web3Context);
  const connected = context.hasProvider && context.accounts;

  const [generated, updateGen] = useState(false);
  const [isChecked, updateIsChecked] = useState(
    !!localStorage?.getItem(LS_KEY)
  );

  const match = useRouteMatch<{ tokenId: string }>();

  let num;

  try {
    num = parseInt(match.params.tokenId);
  } catch (e) {
    // redirect
  }

  if (!num) {
    throw new Error();
  }

  const [canName, updateCanName] = React.useState(false);
  const account = context?.accounts?.[0];

  React.useEffect(() => {
    const fn = async () => {
      if (!context.getContract || !context.getNamingBlocks) return;
      const c = context.getContract();
      const owner = await c.methods.ownerOf(match.params.tokenId).call();
      const { end, currentBlock, start } = await context.getNamingBlocks();
      const canName =
        new BN(currentBlock).lte(end) && new BN(currentBlock).gte(start);
      updateCanName(canName && account?.toLowerCase() === owner.toLowerCase());
    };
    fn();
  }, [connected, context, match.params.tokenId, account]);

  React.useEffect(() => {
    const fn = async () => {
      try {
        const num = parseInt(match.params.tokenId);
        if (
          isNaN(num) ||
          parseInt(match.params.tokenId) <= 0 ||
          parseInt(match.params.tokenId) > 10000
        ) {
          // error
        }
        const res = await fetch(
          `${REQUEST_URL}/metadata/${match.params.tokenId}`
        ).then((r) => r.json());
        updateLoading(false);
        updateData(res);
      } catch (e) {}
    };
    fn();
  }, []);

  const gen = useCallback(() => {
    if (!canvasRef.current || !data) return;
    render(canvasRef.current, data?.matrix, 37, ...data.colors);
    updateGen(true);
  }, [data]);

  React.useLayoutEffect(() => {
    if (isChecked) {
      gen();
    }
  }, [isChecked, gen]);

  const prevId = num - 1;
  const nextId = num + 1;

  const hasPrev = prevId >= 1;
  const hasNext = nextId <= 10000;
  const onChecked = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (evt.target.checked) {
      localStorage.setItem(LS_KEY, "true");
      updateIsChecked(true);
    } else {
      localStorage.removeItem(LS_KEY);
      updateIsChecked(false);
    }
  };

  const [readyToName, updateReadyToName] = React.useState(false);
  return (
    <div css={styles.wrap}>
      <Link to="/">
        <P>Back</P>
      </Link>
      {loading && <h2>Loading</h2>}
      {!loading && data && (
        <div css={styles.animateIn}>
          <div css={styles.glyphHolder}>
            <div id="frame">
              <canvas
                css={css`
                  display: ${generated ? "block" : "none"};
                `}
                ref={canvasRef}
              />
            </div>
            <Heading>{data.name}</Heading>
            <P>
              <a
                target="_blank"
                rel="noreferrer"
                href={
                  NETWORK === "mainnet"
                    ? `https://opensea.io/assets/${CONTRACT_ADDRESS}/${num}`
                    : `https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${num}`
                }
              >
                View on OpenSea
              </a>
            </P>
          </div>
          <div css={styles.paginate}>
            {hasPrev && (
              <Link to={`/glyph/${prevId}`}>
                <P>Previous Glyph</P>
              </Link>
            )}
            {!hasPrev && <P>Previous Glyph</P>}
            {hasNext && (
              <Link to={`/glyph/${nextId}`}>
                <P>Next Glyph</P>
              </Link>
            )}
            {!hasNext && <P>Next Glyph</P>}
          </div>

          <div css={styles.preWrap}>
            <ConnectBtn>
              <>
                {connected && canName && !readyToName && (
                  <button
                    onClick={() => {
                      updateReadyToName(true);
                    }}
                    css={common.cta2}
                  >
                    Name Glyph
                  </button>
                )}
                {readyToName && <NamingForm tokenId={match.params.tokenId} />}
              </>
            </ConnectBtn>
            {!generated && (
              <div>
                <button css={common.cta} onClick={gen}>
                  Generate Glyph
                </button>
                <label css={styles.label}>
                  <input
                    checked={isChecked}
                    onChange={onChecked}
                    type="checkbox"
                  />
                  <P>Generate on page load</P>
                </label>
              </div>
            )}
            <P>
              This glyph is created using the following data. This is done
              entirely in your browser using data stored on the Ethereum
              blockchain.
            </P>
            <P>
              <strong>Pixel Matrix</strong>
            </P>
            <P>{JSON.stringify(data.matrix, void 0, 2)}</P>
            <P>
              <strong>RGB Values</strong>
            </P>
            <P>{JSON.stringify(data.colors, void 0, 2)}</P>
            <P>
              The JavaScript code which takes the above data as input can be
              found{" "}
              <a
                target="_blank"
                rel="noreferrer"
                href="https://gist.github.com/nftboi/baf8a1ae5c83d6c6214b8ae6ee1eda4b"
              >
                here
              </a>
              .
            </P>
          </div>
        </div>
      )}
    </div>
  );
}
