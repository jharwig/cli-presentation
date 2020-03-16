import React, { useLayoutEffect, useRef } from "react";
import { Markdown as _Markdown } from "react-blessed-contrib";
import chalk from "chalk";

function Markdown({ children }) {
  const ref = useRef<{ widget: any }>();
  useLayoutEffect(() => {
    if (!ref.current) return;
    const { widget } = ref.current;
    widget.setContent(
      widget.content
        .replace(/^(\s*)\*/gm, "$1" + chalk.hex("#F41")("\u2022"))
        .replace(/^(\s*)(\d+)\./gm, "$1" + chalk.hex("#F41")("$2"))
    );
  }, [children]);
  return <_Markdown ref={ref}>{children}</_Markdown>;
}

export default Markdown;
