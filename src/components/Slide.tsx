import React, { useContext } from "react";
import chalk from "chalk";
import strpad from "strpad";

import { ScreenContext } from "./context";

function Slide({
  color = "#F41",
  center = "",
  centerSub = "",
  footer = "",
  header = "",
  children = null
}) {
  const screen = useContext(ScreenContext);

  return (
    <blessed-box key={header + footer}>
      {header && (
        <>
          <blessed-box left={0} top={0} height={1} style={{ bg: color }} />

          <blessed-box
            align="center"
            valign="middle"
            top={1}
            height={2}
            style={{ bg: color }}
          >
            {chalk.bold.bgHex(color).hex("#fff")(" " + header)}
          </blessed-box>
        </>
      )}

      {center ? (
        <>
          <blessed-box
            height={1}
            left={Math.round(screen.width / 2 - center.length / 2)}
            top={3}
          >
            {chalk.bold.underline.hex("#f41")(center)}
          </blessed-box>
          {centerSub ? (
            <blessed-box left={screen.width / 2 - centerSub.length / 2} top={5}>
              {chalk.hex("#bbb")(centerSub)}
            </blessed-box>
          ) : null}
        </>
      ) : null}
      {children ? (
        <blessed-box
          bottom={footer ? 2 : 0}
          top={centerSub ? 8 : 5}
          left={1}
          right={1}
        >
          {children}
        </blessed-box>
      ) : null}
      {footer ? (
        <blessed-box bottom={0} height={1} style={{ bg: color }}>
          {chalk.bgHex(color).whiteBright(strpad.center(footer, screen.width))}
        </blessed-box>
      ) : null}
    </blessed-box>
  );
}

export default Slide;
