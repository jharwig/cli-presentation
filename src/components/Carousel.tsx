import React, { useRef, useLayoutEffect, useEffect, useContext } from "react";
import { Carousel as _Carousel } from "react-blessed-contrib";

import { ScreenContext } from "./context";

let last = -1;

const Carousel = ({ children, defaultPage = 0, ...props }) => {
  const screen = useContext(ScreenContext);
  const ref = useRef();
  useLayoutEffect(() => {
    const { carousel } = ref.current;
    carousel.currPage = defaultPage;

    const m = carousel.move;
    carousel.move = function() {
      console.log("Page: " + this.currPage);
      return m.apply(this, arguments);
    };

    carousel.move();
  }, []);

  useEffect(() => {
    screen.key("r", gotoStart);
    function gotoStart() {
      const { carousel } = ref.current;
      if (carousel.currPage === 0 && last !== -1) {
        carousel.currPage = last;
      } else {
        last = carousel.currPage;
        carousel.currPage = 0;
      }
      carousel.move();
    }
    return () => screen.unkey("r", gotoStart);
  });

  return (
    <_Carousel ref={ref} {...props}>
      {children}
    </_Carousel>
  );
};

export default Carousel;
