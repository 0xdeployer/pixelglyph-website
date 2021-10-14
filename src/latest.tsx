import React from "react";
import REQUEST_URL from "./data/REQUEST_URL";
import { css } from "@emotion/react";
import { normalizeIpfs, styles as tileStyles } from "./tiles";
import { Link } from "react-router-dom";
import NETWORK from "./data/NETWORK";
import CONTRACT_ADDRESS from "./data/CONTRACT_ADDRESS";

const styles = {
  wrap: css(
    tileStyles.wrap,
    css`
      width: 100%;
      box-sizing: border-box;
      margin: auto;
      position: relative;
      padding: 0;
    `
  ),
  item: (w: string = "400px") => css`
    flex: 0 0 ${w};
    width: 100%;
    padding: 1rem;
    border-radius: 10px;
    overflow: hidden;

    & img {
      width: 100%;
      height: auto;
    }
  `,
  frame: (width?: number) => css`
    display: flex;
    flex-wrap: no-wrap;
    width: ${width ? `${width}px` : "100%"};
    overflow: hidden;
    position: relative;
    margin: auto;
  `,
  innerWrap: (xOffset?: number) => css`
    transform: translateX(${xOffset ? `-${xOffset}px` : `0`});
    transition: transform 0.25s ease;
    display: flex;
    flex-wrap: no-wrap;
  `,
  arrow: (offset: string) => css`
    position: absolute;
    z-index: 99;
    width: 50px;
    height: 50px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
    border-radius: 50%;
    left: ${offset};
    top: 0;
    cursor: pointer;
    bottom: 0;
    margin: auto;
    font-size: 1.4rem;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    font-weight: bold;
    background: -webkit-linear-gradient(30deg, #a8ff78, #78ffd6);
  `,
};

export default function Latest() {
  const [latest, update] = React.useState<
    {
      name: string;
      image: string;
      tokenId: number;
    }[]
  >();
  const [frameWidth, updateFrameWidth] = React.useState<number>();
  const [itemWidthOverride, updateItemWidth] = React.useState<string>();
  const [numOfSlides, updateNumOfSlides] = React.useState<number>();
  const [currentSlide, updateCurrentSlide] = React.useState<number>(1);

  React.useEffect(() => {
    const fn = async () => {
      const res = await fetch(`${REQUEST_URL}/latest`).then((res) =>
        res.json()
      );
      update(res);
    };

    try {
      fn();
    } catch (e) {
      // no-op
    }
  }, []);

  React.useLayoutEffect(() => {
    function resizeHandler(isResize?: boolean) {
      // determine width of items
      // determine how many items can fit in frame
      const item = document.querySelector<HTMLElement>('[data-id="item"]');
      const frame = document.querySelector<HTMLElement>('[data-id="frame"]');
      const wrap = document.querySelector<HTMLElement>('[data-id="wrap"]');
      const innerWrap = document.querySelector<HTMLElement>(
        '[data-id="innerwrap"]'
      );

      if (!item || !frame || !wrap || !innerWrap) return;
      // need to account for paddin of parent element
      const padding = window.getComputedStyle(wrap).paddingLeft;
      let itemWidth = item.offsetWidth;
      let frameWidth = frame.offsetWidth;
      if (itemWidth > frame.offsetWidth) {
        updateItemWidth(`${frame.offsetWidth}px`);
        itemWidth = frame.offsetWidth;
      } else if (itemWidthOverride && isResize) {
        // set to default
        updateItemWidth(`400px`);
      }
      frameWidth += wrap.offsetWidth - parseInt(padding) * 2 - frameWidth;
      const itemsInFrame = Math.floor(frameWidth / itemWidth);
      const numberOfSlides = Math.ceil(
        document.querySelectorAll<HTMLElement>('[data-id="item"]').length /
          itemsInFrame
      );
      frameWidth = itemWidth * itemsInFrame;

      updateNumOfSlides(numberOfSlides);
      updateFrameWidth(frameWidth);
      if (currentSlide > numberOfSlides) {
        updateCurrentSlide(numberOfSlides);
      }
    }
    if (latest) {
      resizeHandler();
      const handleResize = () => {
        resizeHandler(true);
      };
      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }
  }, [latest, currentSlide]);

  const updateSlide = (inc: number) => () => {
    if (inc < 0 && currentSlide === 1) return;
    if (inc > 0 && currentSlide === numOfSlides) return;
    updateCurrentSlide((c) => c + inc);
  };

  return !latest ? null : (
    <div
      css={css`
        background: #eee;
        padding: 1rem 0;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.25);
      `}
    >
      <div data-id="wrap" css={styles.wrap}>
        <h1
          css={css`
            text-align: center;
          `}
        >
          Latest Pixelglyphs
        </h1>

        <div data-id="frame" css={styles.frame(frameWidth)}>
          <div onClick={updateSlide(-1)} css={styles.arrow("10px")}>
            {"<"}
          </div>
          <div onClick={updateSlide(1)} css={styles.arrow("calc(100% - 60px)")}>
            {">"}
          </div>
          <div
            data-id="innerwrap"
            css={styles.innerWrap(
              frameWidth ? (currentSlide - 1) * frameWidth : void 0
            )}
          >
            {latest.map((item) => {
              return (
                <div css={styles.item(itemWidthOverride)} data-id="item">
                  <Link to={`/glyph/${item.tokenId}`}>
                    <img src={normalizeIpfs(item.image)} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
