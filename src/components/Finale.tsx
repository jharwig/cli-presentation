import React, { useState, useContext, useRef, useEffect } from "react";
import { ScreenContext } from "./context";
import { useAnimationFrame } from "./hooks";

const Particles = 6;
const AccelXMinMax: [number, number] = [-1.5, 1.5];
const AccelYMinMax: [number, number] = [-3, -1];
const colors = ["#aa0066", "#cc0044"];
interface IParticle {
  w: number;
  h: number;
  x: number;
  y: number;
  a: [number, number];
  v: [number, number];
  color: string;
}

const random: (input: [number, number]) => number = ([min, max]) =>
  Math.random() * (max - min) + min;

const initParticle = (p, screen) => {
  const center = [
    Math.round(screen.width / 2 - 4),
    Math.round(screen.height - 6)
  ];

  //   const size = random([3, 15]);
  const scale = 3.7;
  p.w = Math.round(random([3, 12]) * scale);
  p.h = Math.round(random([1, 7]) * scale);
  p.x = center[0];
  p.y = center[1];
  p.a = [random(AccelXMinMax), random(AccelYMinMax)];
  p.v = [0, 0];
  //   p.color = colors[Math.round(random([0, colors.length - 1]))];
  return p;
};
const createParticles = screen => {
  const p = [];
  for (let i = 0; i < Particles; i++) {
    p.push(initParticle({ color: colors[0] }, screen));
  }
  return p;
};

const update = (dt, list, screen, newColor) => {
  const damping = dt * 0.01;
  list.forEach((p, i) => {
    const DRAG = 0.01;
    const RESISTANCE = 0.1;
    const GRAVITY = 0.15;

    p.a[1] += GRAVITY * damping;

    p.v[0] += p.a[0] * damping;
    p.v[1] += p.a[1] * damping;

    const rX = -(DRAG * p.v[0] * Math.abs(p.v[0]) + RESISTANCE * p.v[0]);
    const rY = -(RESISTANCE * p.v[1] + DRAG * p.v[1] * Math.abs(p.v[1]));
    p.v[0] += rX; // / (p.w * p.h * 0.005);
    p.v[1] += rY; // / (p.w * p.h * 0.005);

    p.x += p.v[0] * damping;
    p.y += p.v[1] * damping;
    if (p.x < -p.w || p.x > screen.width || p.y > screen.height || p.y < -p.h) {
      initParticle(p, screen);
      p.color = newColor;
    }
  });
};

const useRedraw = () => {
  const [redraw, setRedraw] = useState(0);
  return () => setRedraw(d => d + 1);
};

const Finale = () => {
  const [state, setState] = useState(0);
  const screen = useContext(ScreenContext);
  const particles = useRef<IParticle[]>();
  const redraw = useRedraw();
  const [colorIndex, setColorIndex] = useState(0);

  useAnimationFrame(
    deltaTime => {
      if (state === 0) return;
      const isPaused = state % 2 === 0;
      if (!isPaused) {
        update(deltaTime, particles.current, screen, colors[colorIndex]);
        redraw();
      }
      return isPaused ? false : true;
    },
    [state, colorIndex]
  );

  useEffect(() => {
    const t = setInterval(() => {
      setColorIndex(i => (i + 1) % colors.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    screen.key("space", update);
    function update() {
      setState(state => {
        if (state === 0) {
          particles.current = createParticles(screen);
        }
        return state + 1;
      });
    }
    return () => {
      screen.unkey("space", update);
    };
  }, []);

  if (particles.current) {
    return (
      <>
        {particles.current.map((p, i) => (
          <blessed-box
            key={"p-" + i}
            left={Math.round(p.x)}
            top={Math.round(p.y)}
            width={p.w}
            height={p.h}
            style={{
              fg: "white",
              bg: p.color,
              transparent: true,
              shadow: true
            }}
          />
        ))}
      </>
    );
  }
  return null;

  /*
  return Number.map(color => (
    <blessed-box
      key={color}
      right={7}
      draggable={true}
      bottom={5}
      width={2}
      height={1}
      style={{
        border: { fg: "magenta" },
        fg: "white",
        bg: color,
        transparent: true,
        shadow: true
      }}
    />
  ));*/
};

export default Finale;
