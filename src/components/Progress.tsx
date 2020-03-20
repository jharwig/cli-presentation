import React, { useEffect, useState, useContext } from "react";
import { ScreenContext } from "./context";
import chalk from "chalk";
import strpad from "strpad";
import gradient from "gradient-string";
import Markdown from "./Markdown";

const Percents = "%"
  .repeat(101)
  .split("")
  .map((_, i) => `${(i < 10 ? " " : "") + (i < 100 ? " " : "") + i}%`);

const Progress = () => {
  const screen = useContext(ScreenContext);
  const [state, setState] = useState(0);
  const [spinner, setSpinner] = useState(0);
  const [isRunning, setRunning] = useState(false);
  useEffect(() => {
    let timers = [];

    function start() {
      timers.push(
        setInterval(() => {
          setState(state => {
            if (state > 1) {
              return 0;
            }
            return state + 0.005;
          });
        }, 40),
        setInterval(() => {
          setSpinner(state => {
            if (state >= 1) {
              return 0;
            }
            return state + 0.05;
          });
        }, 40)
      );
      setRunning(true);
    }
    function stop() {
      timers.forEach(t => clearInterval(t));
      timers = [];
      setRunning(false);
    }

    screen.key("space", handler);
    function handler() {
      if (timers.length) stop();
      else start();
    }

    if (isRunning) start();

    return () => {
      screen.unkey("space", handler);
      stop();
    };
  }, [isRunning]);

  const generateSlowSpinner = (showParts, ...chars) =>
    chalk.hex("#2773FF")(
      chars[Math.min(chars.length - 1, Math.trunc(state * chars.length))]
    );

  const generateSpinner = (showParts, ...chars) => {
    const index = Math.min(
      chars.length - 1,
      Math.trunc(spinner * chars.length)
    );
    return `${chalk.hex("#2773FF")(chars[index])}\
    ${
      showParts
        ? `\t ${chalk.hex("#999")(
            chars
              .map((c, i) => (i === index ? chalk.hex("2773FF")(c) : c))
              .join(" ")
          )}`
        : ""
    }`;
  };

  //◰	◱	◲	◳

  return (
    <>
      <blessed-box left={0} width={"50%-3"}>
        <Markdown>{chalk`
        1. Draw something
        2. Clear it {hex('#aaa')    \\x1b[2K}
        3. Move cursor {hex('#aaa') \\x1b[G}
        4. Goto 1
        `}</Markdown>
      </blessed-box>
      <blessed-box left={"50%-2"}>
        {chalk`${generateSlowSpinner(
          false,
          ...Percents
        )}       {hex('#aaa') Components}

  ${generateSpinner(true, "╲", "│", "╱", "─")}

  ${generateSpinner(true, "◰", "◳", "◲", "◱")}

  ${generateSpinner(true, "◐", "◓", "◑", "◒")}

  ${generateSpinner(true, "◜", "◝", "◞", "◟")}

  ${generateSpinner(
    false,
    "▁",
    "▂",
    "▃",
    "▄",
    "▅",
    "▆",
    "▇",
    "█",
    ...["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"].reverse()
  )}\
        
        
      `}
      </blessed-box>
      <blessed-box top={10}>
        {/* {"█".repeat(screen.width - 2) + "\x1b[1GTesting"} */}
        {chalk.hex("#2773FF")(
          "█".repeat(Math.round((screen.width - 2) * Math.min(1, state))) +
            "▁".repeat(
              Math.round((screen.width - 2) * (1 - Math.min(1, state)))
            )
        )}
        {/*
        
        */}
      </blessed-box>
      <blessed-box height={1} bottom={1}>
        {strpad.center(isRunning ? "⏯  Running" : "⏯  Paused", screen.width)}
      </blessed-box>
    </>
  );
};
/*
 \`\`\`
        ◰	◱	◲	◳	◴	◵	◶	◷
        ◐	◑	◒	◓                              
        ╱	╲
        █
        ▁	▂	▃	▄	▅	▆	▇	█
        \`\`\`
        */

export default Progress;
