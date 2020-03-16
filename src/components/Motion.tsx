import React, { useRef, useEffect, useCallback, useState } from "react";
import { Motion, spring } from "react-motion";

const style = { bg: "red", fg: "green" };

function TestMotion({ width }) {
  const rightPosition = width - 2;
  const [target, setTarget] = useState(0);
  // useEffect(() => {
  //   const t = setInterval(() => {
  //     setTarget(target => (target > 0 ? 0 : rightPosition));
  //   }, 2000);
  //   return () => clearInterval(t);
  // }, []);
  const click = useCallback(() => {
    console.log("clicked");
    setTarget(target => (target > 0 ? 0 : rightPosition));
  }, [rightPosition]);

  const box = useRef();
  useEffect(() => {
    console.log("useEffect");
    box.current.on("click", handler);
    function handler(data) {
      console.log("clicked");
      setTarget(target => (target > 0 ? 0 : rightPosition));
    }
    // return () => {
    //   box.current.off("click", handler);
    // };
  }, [box]);
  return (
    <Motion style={{ x: spring(target) }}>
      {value => (
        <blessed-box
          ref={box}
          top={4}
          left={Math.trunc(value.x)}
          width={2}
          height={2}
          shadow={true}
          style={style}
        >
          :
        </blessed-box>
      )}
    </Motion>
  );
}

export default TestMotion;
