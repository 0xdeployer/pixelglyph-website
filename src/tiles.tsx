import { css } from "@emotion/react";
import React from "react";
import REQUEST_URL from "./data/REQUEST_URL";
import { styles as ctaStyles } from "./cta";
import NETWORK from "./data/NETWORK";
import CONTRACT_ADDRESS from "./data/CONTRACT_ADDRESS";
import { Link } from "react-router-dom";

export const styles = {
  wrap: css`
    padding: 0 8rem;
    @media (max-width: 600px) {
      padding: 0 2rem;
    }
  `,
};

export function normalizeIpfs(str: string) {
  return str.replace("ipfs://", "https://ipfs.infura.io/ipfs/");
}

var hexValues = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "a",
  "b",
  "c",
  "d",
  "e",
];

function populate(a: any) {
  for (var i = 0; i < 6; i++) {
    var x = Math.round(Math.random() * 14);
    var y = hexValues[x];
    a += y;
  }
  return a;
}

export const Tile = ({
  gradient,
  image,
  tokenId,
  width = "80",
  fontSize = "1",
  name,
}: {
  gradient?: string;
  image?: string;
  name?: string;
  tokenId?: string;
  width?: string;
  fontSize?: string;
}) => {
  const item = (
    <div
      css={css`
        padding: 0.1rem;
      `}
    >
      <div
        css={css`
          border: 1px solid #333;
          width: ${width}px;
          height: auto;
          min-height: 80px;
          border-radius: 3px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;

          position: relative;
          overflow: hidden;
          &:hover .overlay {
            transform: translateY(0);
          }

          & span {
            font-size: 1.2rem;
            font-family: "Inconsolata", monospace;
            background: ${gradient};
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            color: white;
          }

          & img {
            width: 100%;
            height: auto;
          }

          & .name {
            position: absolute;
            top: 2px;
            left: 2px;
            margin: 0;
            color: #fff;
            text-shadow: 0px 0px 2px #000;
          }
        `}
      >
        {!image && <span>?</span>}
        {image && <img src={normalizeIpfs(image)} />}
        {name && <p className="name">{name.replace("Pixelglyph ", "")}</p>}
        {image && (
          <div
            className="overlay"
            css={css`
              position: absolute;
              width: 100%;
              height: 25%;
              transform: translateY(100%);
              bottom: 0;
              transition: transform 0.3s;
              padding: 1rem;
              background: rgba(0, 0, 0, 0.6);
              display: flex;
              align-items: center;
              justify-content: center;
              flex-direction: column;
              & p {
                color: white;
                font-weight: bold;
                font-size: ${fontSize}rem;
                margin: 0;
              }
            `}
          >
            <p>View more</p>
          </div>
        )}
      </div>
    </div>
  );
  return tokenId ? <Link to={`/glyph/${tokenId}`}>{item}</Link> : item;
};

export default function Tiles() {
  const [tiles, updateTiles] = React.useState<React.ReactNode[]>([]);
  const [startSlice, updateStartSlice] = React.useState(0);
  const [slices, updateSlices] = React.useState<React.ReactNode[]>([]);

  function addToSliceList(tilesArr: React.ReactNode[] = tiles) {
    updateSlices((s) => {
      return [...s, ...tilesArr.slice(startSlice, startSlice + 100)];
    });
    updateStartSlice(startSlice + 100);
  }

  React.useEffect(() => {
    const fn = async () => {
      const res: { tokenId: string; image: string; name: string }[] =
        await fetch(`${REQUEST_URL}/all`).then((res) => res.json());
      const allTiles: React.ReactNode[] = [
        ...res.map(({ tokenId, image, name }) => (
          <Tile
            key={tokenId}
            fontSize="0.6"
            tokenId={tokenId}
            name={name}
            image={image}
          />
        )),
      ];

      for (let i = 0; i < 10000; i++) {
        var newColor1 = populate("#");
        var newColor2 = populate("#");
        var angle = Math.round(Math.random() * 360);

        var gradient =
          "linear-gradient(" +
          angle +
          "deg, " +
          newColor1 +
          ", " +
          newColor2 +
          ")";
        allTiles.push(<Tile gradient={gradient} />);
      }
      updateTiles(allTiles);
      addToSliceList(allTiles);
    };
    fn();
  }, []);

  return (
    <div css={styles.wrap}>
      <h1>All Pixelglyphs</h1>
      <div
        css={css`
          transform: translate3d(0, 0, 0);
          display: flex;
          flex-wrap: wrap;
        `}
      >
        {slices}
      </div>
      <div
        css={css`
          margin: 2rem auto;
        `}
      >
        <button
          css={css(
            ctaStyles.cta,
            css`
              max-width: 200px;
            `
          )}
          onClick={() => {
            addToSliceList(tiles);
          }}
        >
          Load More
        </button>
      </div>
    </div>
  );
}
