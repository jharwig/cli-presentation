import React, { useEffect, useState } from "react";
import chalk from "chalk";

const BlinkingPrompt = ({ screen }) => {
  const [prompt, setPrompt] = useState(false);
  const [state, setState] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setPrompt(p => !p);
    }, 750);
    return () => {
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    screen.key("space", handler);
    screen.key("r", reset);
    function reset() {
      setState(0);
    }
    let t;
    function handler() {
      setState(s => s + 1);
      t = setInterval(() => {
        setState(state => {
          if (state === 0) return 0;
          return state + 1;
        });
      }, 2000);
    }
    return () => {
      screen.unkey("space", handler);
      screen.unkey("r", reset);
      clearTimeout(t);
    };
  });

  const p = chalk.grey("$") + " ";
  const blink = prompt ? chalk.grey("\u2589") : "";

  return (
    <blessed-box left={Math.round(screen.width / 2 - 10)}>
      {`${p}${
        state === 0
          ? blink
          : state === 1
          ? `./start\n${chalk.red(
              `zsh: permission denied: ./start\n${p}${blink}`
            )}`
          : state === 2
          ? `./start\n${chalk.red(
              "zsh: permission denied: ./start"
            )}\n${p}chmod +x start\n${p}${blink}`
          : `./start\n${chalk.red(
              "zsh: permission denied: ./start"
            )}\n${p}chmod +x start\n${p}./start${blink}`
      }`}
    </blessed-box>
  );
};

export default BlinkingPrompt;
