import React from "react";
import twitter from "./iconmonstr-twitter-1.svg";
import discord from "./discord.svg";
import "./App.css";
import Glyphs from "./glyphs";
import { Global, css } from "@emotion/react";
import Cta from "./cta";
import Tiles from "./tiles";
import Web3Provider from "./web3Provider";
import Owned from "./owned";
import Latest from "./latest";
import { Switch, Route, Link } from "react-router-dom";
import Overview from "./overview";
import GlyphDetail from "./glyphDetail";

export const styles = {
  hr: css`
    border: 0;
    margin: 4rem 0;
    outline: 0;
    height: 2px;
    background: #d3d3d3;
  `,
  glyphs: css`
    width: 60px;
    height: 60px;
    border-radius: 8px;
    overflow: hidden;
    & canvas {
      width: 100%;
      height: auto;
    }
  `,
  wrap: css`
    padding: 1rem;
    max-width: 1000px;
    margin: 0 auto;
    @media (max-width: 432px) {
      padding: 0.5rem;
    }
  `,
  logo: css`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-family: "Inconsolata", monospace;
    & span {
      font-size: 1.5rem;
      display: block;
      font-weight: bold;
      margin-left: 2rem;
    }

    & span:last-of-type {
      font-size: 1.2rem;
      font-weight: normal;
    }
  `,
  social: css`
    display: flex;

    & img {
      height: 1.4rem;
      width: auto;
      margin-right: 2rem;
    }
    @media (max-width: 432px) {
      margin-top: 1rem;
    }
  `,
  headerWrap: css`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;

    @media (max-width: 432px) {
      flex-direction: column;
    }
  `,
};

function App() {
  return (
    <Web3Provider>
      <div css={styles.wrap}>
        <Global
          styles={css`
            @import url("https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;900&family=Source+Sans+Pro:wght@400;600&display=swap");
            body {
              font-family: "Source Sans Pro", sans-serif;
              font-size: 10px;
            }

            * {
              box-sizing: border-box;
            }
          `}
        ></Global>
        <div css={styles.headerWrap}>
          <Link
            css={css`
              color: inherit;
              text-decoration: none;
              &:visited {
                color: inherit;
              }
            `}
            to="/"
          >
            <div css={styles.logo}>
              <div css={styles.glyphs}>
                <Glyphs />
              </div>
              <div>
                <span>Pixelglyphs</span>
                <span>Your forever avatars</span>
              </div>
            </div>
          </Link>
          <div css={styles.social}>
            <div>
              <a
                rel="noreferrer"
                target="_blank"
                href="https://twitter.com/PixelGlyphs"
              >
                <img src={twitter} alt="Twitter" />
              </a>
            </div>
            <div>
              <a
                rel="noreferrer"
                target="_blank"
                href="https://discord.gg/zPRfPxH3EY"
              >
                <img src={discord} alt="Discord" />
              </a>
            </div>
            <div>
              <a
                css={css`
                  color: #3d3d3d;
                  font-size: 1.2rem;
                  font-family: "Inconsolata", monospace;
                `}
                href="https://bafybeifpplwnz4h74ujx7kiv3lzjh2tjoai5y4ef3bjir75gazr6jzxpgi.ipfs.infura-ipfs.io"
                target="_blank"
                rel="noreferrer"
              >
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
      <Switch>
        <Route
          path="/"
          exact
          render={() => {
            return (
              <>
                <div css={styles.wrap}>
                  <Cta />
                </div>
                <Latest />

                <Owned />
                <hr css={styles.hr} />
                <Tiles />
              </>
            );
          }}
        />
        <Route exact path="/overview" render={() => <Overview />} />
        <Route
          exact
          path="/glyph/:tokenId"
          render={(routeProps) => (
            <GlyphDetail key={routeProps.match.params.tokenId} />
          )}
        />
      </Switch>
    </Web3Provider>
  );
}

export default App;
