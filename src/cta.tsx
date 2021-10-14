import { css } from "@emotion/react";
import React, { useContext } from "react";
import REQUEST_URL from "./data/REQUEST_URL";
import { Web3Context } from "./web3Provider";
import { Link } from "react-router-dom";
import Heading from "./heading";
import P from "./p";

const ctaStyles = css`
  font-size: 1.2rem;
  outline: none;
  border: 1px solid #000;
  border-radius: 3px;
  padding: 1rem;
  width: 100%;
  margin: 0.5rem 0;
  cursor: pointer;
  font-family: "Inconsolata", monospace;
  background: -webkit-linear-gradient(30deg, #a8ff78, #78ffd6);
  color: #2b0aac;
  &:hover {
    box-shadow: 2px 2px 1px rgba(0, 0, 0, 0.1);
  }

  &:active {
    box-shadow: inset 2px 2px 1px rgba(0, 0, 0, 0.1);
  }
`;

export const common = {
  cta: ctaStyles,
  cta2: css(
    ctaStyles,
    css`
      background: rgba(214, 60, 127);
      color: white;
    `
  ),
};

export const styles = {
  wrap: css`
    width: 100%;
    margin-top: 4rem;
    display: flex;

    & a {
      color: #2b0aac;
    }

    & p {
      font-size: 1.2rem;
    }

    & div {
      flex: 1;
    }

    & > div:first-child {
      padding-right: 1rem;
    }
    & > div:last-child {
      padding-left: 1rem;
    }

    @media (max-width: 700px) {
      flex-direction: column;

      & > div:first-child {
        padding-right: 0rem;
        margin-bottom: 2rem;
      }
      & > div:last-child {
        padding-left: 0rem;
      }
    }
  `,

  cta: common.cta,
  cta2: css(
    common.cta,
    css`
      background: rgba(214, 60, 127);
      color: rgba(23, 29, 216);
    `
  ),
};

export function ConnectBtn({ children }: { children?: React.ReactNode }) {
  const context = useContext(Web3Context);
  const connected = context.hasProvider && context.accounts;

  return (
    <>
      {context.hasProvider && !connected && (
        <button
          onClick={async () => {
            if (!context.initialize) return;
            context.initialize();
          }}
          css={styles.cta}
        >
          {!connected && "Connect Wallet"}
        </button>
      )}
      {!context.hasProvider && (
        <p
          css={css`
            font-size: 1.4rem;
            font-family: "Inconsolata", monospace;
          `}
        >
          You will need to{" "}
          <a href="https://metamask.io" target="_blank" rel="noreferrer">
            download Metamask
          </a>{" "}
          to interact with Pixelglyphs.
        </p>
      )}
      {connected && children}
    </>
  );
}

export default function Cta() {
  const context = useContext(Web3Context);
  const connected = context.hasProvider && context.accounts;
  const [namingBlocks, setNamingBlocks] =
    React.useState<[string, string, string]>();

  React.useEffect(() => {
    if (connected) {
      const fn = async () => {
        if (!context.getNamingBlocks) return;
        const { start, end, currentBlock } = await context.getNamingBlocks();
        setNamingBlocks([start, end, currentBlock]);
      };
      fn();
    }
  }, [connected]);

  return (
    <div css={styles.wrap}>
      <div>
        {/* comment  */}
        <h1>Total minted: 10,000 / 10,000</h1>
        <ConnectBtn />
        {/* comment */}

        <p>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://etherscan.io/token/0xf38d6bf300d52ba7880b43cddb3f94ee3c6c4ea6"
          >
            Contract: 0xf38d6bf300d52ba7880b43cddb3f94ee3c6c4ea6
          </a>
        </p>
        {namingBlocks && namingBlocks[0] !== "0" && (
          <div>
            <Heading>Starting naming block</Heading>
            <P>{namingBlocks[0]}</P>
            <Heading>Ending naming block</Heading>
            <P>{namingBlocks[1]}</P>
            <Heading>Current block</Heading>
            <P>{namingBlocks[2]}</P>
          </div>
        )}

        {/* {context.hasProvider && connected && (
          <>
            {[1, 3, 5, 10].map((num) => (
              <button
                onClick={async () => {
                  if (connected) {
                    if (!context.getContract || !context.accounts) return;
                    const contract = context.getContract();
                    const res: {
                      args: string[];
                      value: string;
                    } = await fetch(`${REQUEST_URL}/mint`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ numberToMint: num }),
                    }).then((res) => res.json());
                    contract.methods.mint(...res.args).send({
                      from: context.accounts[0],
                      value: res.value,
                    });
                  } else if (context.initialize) {
                    context.initialize();
                  }
                }}
                css={styles.cta}
              >
                {connected &&
                  `Generate ${num} Pixelglyph${num > 1 ? "s" : ""} - ${(
                    0.009 * num
                  ).toFixed(3)} ETH`}
              </button>
            ))}
          </>
        )} */}
      </div>
      <div>
        <h1>What are Pixelglyphs?</h1>
        <p>
          Pixelglyphs are a set of 10,000 unique on-chain avatar NFTs created
          using a{" "}
          <a
            href="https://en.wikipedia.org/wiki/Cellular_automaton"
            target="_blank"
            rel="noreferrer"
          >
            cellular automaton
          </a>{" "}
          on the Ethereum blockchain.
        </p>
        <p>
          Your Pixelglyph is created at random during the minting process. The
          cellular automaton algorithm runs on-chain, an NFT first. Pixel data
          and colors are stored on-chain. Your Pixelglyph can be re-created at
          any time using code.
        </p>
        <p>
          Your Pixelglyph can act as your anonymous avatar across the internet
          and within your favorite dApps.
        </p>
        <p>
          <strong>
            Each Pixelglyph you own will allow you to redeem a "pxg.eth" domain
            NFT.
          </strong>
        </p>
        <Link to="/overview">
          <button css={styles.cta2}>Learn more</button>
        </Link>
        <h1>The Great Naming Ceremony</h1>
        <p>
          After the initial sale event completes you will be able to immortalize
          your Pixelglyph even further by giving it a name. During the Naming
          Ceremony you will be able to set your Pixelglyphs name for 0.0025 ETH
          + gas. This will forever be that Glyph's name and it will show up on
          platforms like OpenSea. The name will be stored forever on the
          blockchain. The Naming Ceremony will begin at a yet to be determined
          block and will continue for approximately 3 days after that.
        </p>

        <h1>Roadmap</h1>
        <p>
          Pixelglyph owners will be able to redeem a pxg.eth domain name. We
          have extended ENS names to create an NFT focused profile which
          utilizes ENS, but adds enhanced NFT functionality.
        </p>
      </div>
    </div>
  );
}
