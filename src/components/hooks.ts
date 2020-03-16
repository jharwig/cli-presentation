import React from "react";
import requestAnimationFrame, { cancel as cancelAnimationFrame } from "raf";

export const useAnimationFrame = (callback, deps) => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = React.useRef<number>();
  const previousTimeRef = React.useRef();
  const cancelledRef = React.useRef<boolean>(false);

  const animate = time => {
    if (cancelledRef.current) return;
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - (previousTimeRef.current as number);
      if (callback(deltaTime) === false) {
        cancelledRef.current = true;
      }
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  React.useEffect(() => {
    cancelledRef.current = false;
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(requestRef.current);
      cancelledRef.current = true;
    };
  }, deps);

  return cancel => {
    cancelledRef.current = cancel;
  };
};
