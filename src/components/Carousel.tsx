import React, { useRef, useLayoutEffect } from "react";
import { Carousel as _Carousel } from "react-blessed-contrib";

const Carousel = ({ children, defaultPage = 0, ...props }) => {
  const ref = useRef();
  useLayoutEffect(() => {
    // const { carousel } = ref.current;
    // carousel.currPage = defaultPage;
    // carousel.move();
  }, []);

  return (
    <_Carousel ref={ref} {...props}>
      {children}
    </_Carousel>
  );
};

export default Carousel;
