import React from "react";
import chalk from "chalk";

const Footer = ({ text }) => {
  return (
    <blessed-box height={1} bottom={0} style={{ bg: "#F41", fg: "white" }}>
      {chalk.bgHex("#F41").hex("#fff")(" " + text)}
    </blessed-box>
  );
};

export default Footer;
