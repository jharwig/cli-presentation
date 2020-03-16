import React from "react";
import chalk from "chalk";

function Slide({ color = "#F41", header = "Untitled", children }) {
  return (
    <blessed-box key={header}>
      <blessed-box top={0} height={1} style={{ bg: color }} />

      <blessed-box
        align="center"
        valign="middle"
        top={1}
        height={2}
        style={{ bg: color }}
      >
        {chalk.bold.bgHex(color).hex("#fff")(" " + header)}
      </blessed-box>

      <blessed-box top={4} left={1} right={1}>
        {children}
      </blessed-box>
    </blessed-box>
  );
}

export default Slide;
