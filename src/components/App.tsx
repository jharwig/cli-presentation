import React, { useEffect, useState } from "react";
import "react-blessed";
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
      {/* <blessed-bigtext
        font={"/Users/jharwig/Code/work/aux/ttystudio/fonts/ter-u32n.json"}
        fontBold={"/Users/jharwig/Code/work/aux/ttystudio/fonts/ter-u32b.json"}
        width={"100%"}
        height={5}
      >
        {"Testing"}
      </blessed-bigtext> */}

      <blessed-box
        label={"Hey"}
        border={{ type: "line" }}
        style={{ border: { fg: "cyan" } }}
      >
        <Markdown>
          {`
# Hello

This is **markdown** printed in the \`terminal\`        

1. first
1. Second

* Bulleted list
* More

## Sub
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

      <blessed-image
        left={0}
        top={1}
        bottom={1}
        width={50}
        // type={"overlay"}
        file={"/Users/jharwig/Desktop/markdown-screen-100.png"}
      ></blessed-image>

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
