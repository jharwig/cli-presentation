#!/usr/bin/env node

require("@babel/register")({
  presets: [
    ["@babel/preset-env"],
    ["@babel/preset-react"],
    ["@babel/preset-typescript"]
  ],
  extensions: [".tsx", ".ts", ".jsx", ".js"]
});

require("./src/main");
