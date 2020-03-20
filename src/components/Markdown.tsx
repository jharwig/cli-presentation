import React, { useLayoutEffect, useRef, useMemo } from "react";
import { Markdown as _Markdown } from "react-blessed-contrib";
import marked from "marked";
import theme from "cardinal/themes/default";
import TerminalRenderer from "marked-terminal";
import chalk from "chalk";
import colors from "ansicolors";

const DefaultStyle = {
  code: chalk.hex("#3B6A93"),
  blockquote: chalk.gray.italic,
  html: chalk.gray,
  heading: chalk.green.bold,
  firstHeading: chalk.magenta.underline.bold,
  hr: chalk.reset,
  listitem: chalk.reset,
  table: chalk.reset,
  paragraph: chalk.reset,
  strong: chalk.bold,
  em: chalk.italic,
  codespan: chalk.hex("#3B6A93"),
  del: chalk.dim.gray.strikethrough,
  // link(href, ...x) {
  //   console.log("link: " + href + ", " + x.join(", "));
  //   //return chalk.blue(href);
  //   // return href;
  //   return href;
  // },
  // href(a) {
  //   return a;
  // },

  showSectionPrefix: false,
  tableOptions: {},
  tab: 2
};

function Markdown({ style = {}, children }) {
  const ref = useRef<{ widget: any }>();

  const whitespaceFixedChildren = useMemo(() => {
    if (!(typeof children === "string")) return children;
    const lines = children.split(/\n/);
    const minimum = lines.reduce((spacesPrefixed, line) => {
      line = line.replace(/\x1b\[[\d;]*m/g, "");
      const match = line.match(/^(\s*)[^\s]+/);
      if (match) {
        return Math.min(match[1].length, spacesPrefixed);
      }
      return spacesPrefixed;
    }, Number.MAX_SAFE_INTEGER);

    if (minimum !== Number.MAX_SAFE_INTEGER) {
      return lines.map(line => line.substring(minimum)).join("\n");
    }
    return lines.join("\n");
  }, [children]);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const { widget } = ref.current;

    theme.Identifier._default = v => chalk.rgb(66, 192, 160)(v);
    theme._default = v => chalk.hex("#333")(v);
    theme.String._default = v => chalk.rgb(198, 125, 101)(v);
    theme.Line._default = v => chalk.hex("#aaa").italic(v);
    theme.Punctuator._default = v => chalk.hex("#aaa")(v);

    marked.setOptions({
      renderer: new TerminalRenderer(
        { ...DefaultStyle, style },
        {
          theme,
          linenos: false
          // jsx: true
        }
      )
    });
    "▁	▂	▃	▄	▅	▆	▇	█";

    widget.setMarkdown = function(str) {
      const transformed = marked(str);
      const replaced = transformed
        .replace(/^(\s*)\*/gm, "$1" + chalk.hex("#F41")("\u2022"))
        .replace(/^(\s*)(\d+)\./gm, "$1" + chalk.hex("#F41")("$2"));
      this.setContent(replaced);
    };

    widget.setMarkdown(whitespaceFixedChildren);
  }, [whitespaceFixedChildren]);
  return <_Markdown ref={ref} style={{ ...DefaultStyle, style }}></_Markdown>;
}

export default Markdown;
