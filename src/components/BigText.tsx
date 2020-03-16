import React, { useRef, useLayoutEffect } from "react";

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
  // height={12}
  return (
    <blessed-bigtext
      left={"center"}
      ref={bigText}
      content={text}
      style={{ fg: "cyan" }}
    />
  );
}

export default BigText;
