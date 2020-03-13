import React from "react";
import blessed from "blessed";
// contrib doesn't work with neo
// import blessed from "neo-blessed";
import { createBlessedRenderer } from "react-blessed";

import App from "./components/App";
import "./logger";

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

renderApp();

function renderApp() {
  renderer(<App screen={screen} />, screen);
}

require("./signal");
if (module["hot"]) {
  module["hot"].accept("./components/App", renderApp);
}
