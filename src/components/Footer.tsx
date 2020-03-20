import React from "react";
import chalk from "chalk";

const Footer = ({ text, right = "" }) => {
  return (
    <blessed-box
      left={0}
      height={1}
      bottom={0}
      style={{ bg: "#F41", fg: "white" }}
    >
      {chalk.bgHex("#F41").whiteBright(" " + text)}
      {right ? (
        <blessed-box right="0" width={right.length + 1}>
          {chalk.bgHex("#F41").whiteBright(right + " ")}
        </blessed-box>
      ) : null}
    </blessed-box>
  );
};

export default Footer;
