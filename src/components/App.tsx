import React, { useRef, useLayoutEffect } from "react";
import reactBlessed from "react-blessed";
import chalk from "chalk";
import { Carousel, Markdown } from "react-blessed-contrib";

const App: React.FC<{
  screen: any;
}> = ({ screen }) => {
  // const [number, setNumber] = useState(0);
  // useEffect(() => {
  //   const i = setInterval(() => {
  //     setNumber(n => n + 1);
  //   }, 1000);
  //   return () => clearInterval(i);
  // }, []);

  return (
    <blessed-box>
      <blessed-box top={0} height={1} style={{ bg: "#F41" }} />
      <blessed-box
        align="center"
        valign="middle"
        top={1}
        height={2}
        style={{ bg: "#F41" }}
      >
        {chalk.bold.bgHex("#F41").hex("#fff")(" Curses, Blessed, etc.")}
      </blessed-box>
      {/* <blessed-box LINE
        ch={" "}
        top={1}
        height={1}
        width={"100%"}
        style={{ bg: "#F11" }}
      /> */}
      <blessed-box
        top={4}
        label={chalk.bold.underline("Hey 2")}
        // border={{ type: "line" }}
        style={{ border: { fg: "cyan" } }}
      >
        <Markdown>
          {`
This is **markdown** *printed* in the \`terminal\`        



1. First
1. Second

* Bulleted list
* More
        `}
        </Markdown>
      </blessed-box>
      {/* <blessed-loading width={'100%'} load={"Testing"}></blessed-loading> */}

      {/* <blessed-progressbar
        top={10}
        width={"100%"}
        height={2}
        filled={50}
      ></blessed-progressbar> */}

      {/* <blessed-image
        left={0}
        top={1}
        bottom={1}
        width={50}
        // type={"overlay"}
        file={"/Users/jharwig/Desktop/markdown-screen-100.png"}
      ></blessed-image> */}

      {/* <blessed-line width={"100%"} height={1} /> */}
    </blessed-box>
  );
  // return (
  //   <Carousel top={2} bottom={0} controlKeys={true} screen={screen}>
  //     {[1, 2, 3, 4, 5].map((i, _, list) => (
  //       <blessed-box key={i} tags={true} top={0} right={0} height={2} left={0}>
  //         {`Page ${i} of ${list.length} Title`}
  //       </blessed-box>
  //     ))}
  //   </Carousel>
  // );
};

export default App;

function BigText({ text }) {
  const bigText = useRef();
  useLayoutEffect(() => {
    if (bigText.current) {
      // bigText.current.font = bigText.current.loadFont(
      //   "/Users/jharwig/Code/work/aux/ttystudio/fonts/ter-u14n.json"
      // );
    }
  }, []);
  // fch={"\u2022"}
  // top={-4}
  //     height={12}
  return (
    <blessed-bigtext
      left={"center"}
      ref={bigText}
      content={text}
      style={{ fg: "cyan" }}
    />
  );
}
