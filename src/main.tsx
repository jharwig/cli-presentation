import React from "react";
import blessed from "blessed";
// contrib doesn't work with neo
// import blessed from "neo-blessed";
import { createBlessedRenderer } from "react-blessed";

import App from "./components/App";

const renderer = createBlessedRenderer(blessed);
const screen = blessed.screen({
  title: "Presentation",
  smartCSR: true,
  dockBorders: false,
  fullUnicode: true,
  autoPadding: true
});
screen.key(["q", "C-c"], () => process.exit(0));
screen.key(["r"], () => {
  screen.render();
});

main();

async function main() {
  renderApp();
}

function renderApp(webpacks = [], onRestart = null) {
  renderer(<App screen={screen} />, screen);
}
