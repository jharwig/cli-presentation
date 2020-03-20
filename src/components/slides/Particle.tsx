import React, { useState, useRef, useContext, useEffect } from "react";
import { StackedBar } from "../Bar";
import { useAnimationFrame } from "../hooks";
import { ScreenContext } from "../context";
import logger from "../../logger";
import chalk from "chalk";
import Footer from "../Footer";

const PARTICLES = 150;
const PERCENT_MOVING = 0.95;
const RECOVERY_INIT = 100;
const SICK_START_PERCENT = 0.05;

enum IState {
  Healthy,
  Sick,
  Recovered
}
interface ICount {
  sick: number;
  recovered: number;
  healthy: number;
}
interface IParticle {
  state: IState;
  recovery?: number;
  x: number;
  y: number;
  aX: number;
  aY: number;
  vX: number;
  vY: number;
  color: number;
  hide?: boolean;
  colliding?: boolean;
}
const useRedraw = () => {
  const [redraw, setRedraw] = useState(0);
  return () => setRedraw(d => d + 1);
};

const createParticles = screen => {
  let createdSick = Math.round(SICK_START_PERCENT * PARTICLES);
  const particles: IParticle[] = [];
  for (let i = 0; i < PARTICLES; i++) {
    particles.push(createParticle(i));
  }
  return particles;

  function createParticle(i) {
    const accel = randomAccel();
    let sick = {};
    if (accel.aX !== 0 && createdSick > 0) {
      createdSick--;
      sick = {
        state: IState.Sick,
        recovery: RECOVERY_INIT
      };
    }

    return {
      color: random(0, 360),
      ...randomPosition(),
      ...accel,
      vX: 0,
      vY: 0,
      state: IState.Healthy,
      ...sick
    };
  }
  function randomAccel() {
    const isMoving = random(0, 1) < PERCENT_MOVING;
    return {
      aX: isMoving ? random(-0.1, 0.1) : 0,
      aY: isMoving ? random(-0.1, 0.1) : 0
    };
  }
  function randomPosition() {
    return {
      x: random(0, screen.width - 1),
      y: random(0, screen.height - 2)
    };
  }
  function random(min, max) {
    return Math.random() * (max - min) + min;
  }
};

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function update(dt, particles, screen, startTime) {
  const damping = dt * 0.05;
  const DRAG = 0.3;
  const RESISTANCE = 0.1;
  const collisionMap = {};
  let noneSick = true;

  // TODO stacked bar

  particles.forEach(p => {
    p.hide = false;
    p.colliding = false;
    p.vX += p.aX * damping;
    p.vY += p.aY * damping;
    if (p.state === IState.Sick) noneSick = false;

    if (p.recovery) {
      p.recovery -= damping;
      if (p.recovery <= 0) {
        p.recovery = null;
        p.state = IState.Recovered;
      }
    }

    const rX = -(RESISTANCE * p.vX + DRAG * p.vX * Math.abs(p.vX));
    const rY = -(RESISTANCE * p.vY + DRAG * p.vY * Math.abs(p.vY));
    p.vX += rX;
    p.vY += rY;
    // logger.warn(p.vX + " | " + rX);
    // p.vY -= RESISTANCE * p.vY + DRAG * p.vY * Math.abs(p.vY);
    // resistance.y = -( RESISTANCE*velocity.y + DRAG*velocity.y*ABS(velocity.y));

    p.x += p.vX * damping;
    p.y += p.vY * damping;
    if (p.x < 0 || p.x > screen.width - 1) {
      p.x = clamp(p.x, 0, screen.width - 1);
      p.aX *= -1;
      p.vX *= -1;
    }
    if (p.y < 0 || p.y > screen.height - 2) {
      p.y = clamp(p.y, 0, screen.height - 2);
      p.aY *= -1;
      p.vY *= -1;
    }
    const key = Math.round(p.x) + "|" + Math.round(p.y);
    if (key in collisionMap) {
      p.hide = true;
      //collisionMap[key][0].colliding = true;
      collisionMap[key].push(p);
      if (collisionMap[key].some(p => p.state === IState.Sick)) {
        collisionMap[key].forEach(p => {
          if (p.state === IState.Healthy) {
            p.state = IState.Sick;
            p.recovery = RECOVERY_INIT;
            noneSick = false;
            collisionMap[key][0].colliding = true;
          }
        });
      }
    } else {
      collisionMap[key] = [p];
    }
  });
  const chart: ICount = particles.reduce(
    (chart: ICount, p) => {
      // const chart = {sick: 0, recovered: 0, healthy: 0};
      if (p.state === IState.Sick) chart.sick++;
      else if (p.state == IState.Healthy) chart.healthy++;
      else if (p.state == IState.Recovered) chart.recovered++;
      return chart;
    },
    { sick: 0, recovered: 0, healthy: 0 }
  );
  chart.sick = chart.sick / particles.length;
  chart.recovered = chart.recovered / particles.length;
  chart.healthy = chart.healthy / particles.length;

  return {
    shouldContinue: Date.now() - startTime < 5000 || !noneSick,
    chart
  };
}

const Particle = () => {
  const [state, setState] = useState(0);
  const screen = useContext(ScreenContext);
  const particles = useRef<IParticle[]>();
  const charts = useRef<ICount[]>();
  const initTime = useRef<number>();
  const redraw = useRedraw();
  const [renderChart, setChartsToRender] = useState<any>(null);

  //   if (!particles.current && state === 1) {
  //     particles.current = createParticles(screen);
  //     charts.current = [];
  //   }

  useAnimationFrame(
    deltaTime => {
      if (state === 0) return;
      const { shouldContinue, chart } = update(
        deltaTime,
        particles.current,
        screen,
        initTime.current
      );
      charts.current.push(chart);
      if (!shouldContinue) {
        //logger.warn(charts.current.length, JSON.stringify(charts.current));

        const entries = charts.current.length;
        const maxBars = Math.trunc(screen.width / 3) - 8;
        const takeEvery = Math.trunc((entries - 2) / (maxBars - 2) + 1);
        const barCategory = [];
        const toRender = charts.current
          .filter((chart, i) => {
            if (i === 0 || i === entries - 1) return true;
            if (entries > maxBars) {
              return i % takeEvery === 0;
            }
            return true;
          })
          .map((chart, i) => {
            barCategory.push("Q" + i);
            return [chart.sick, chart.healthy, chart.recovered];
          });
        logger.warn(
          `taking every ${takeEvery} of ${entries} Max=${maxBars}, len=${toRender.length}`
        );
        setChartsToRender({
          barCategory,
          stackedCategory: ["Sick", "Healthy", "Recover"],
          data: toRender
        });
        charts.current = [];
      } else {
        redraw();
      }
      return shouldContinue;
    },
    [state]
  );

  useEffect(() => {
    screen.key("space", update);
    function update() {
      setState(state => {
        if (state === 0) {
          particles.current = createParticles(screen);
          initTime.current = Date.now();
          charts.current = [];
        }
        const newState = (state + 1) % 2;
        return newState;
      });
    }
    return () => {
      screen.unkey("space", update);
    };
  }, []);

  return (
    <blessed-box>
      {state === 0 ? (
        <>
          {/* <blessed-textbox
            value="Testing"
            top={0}
            height={1}
            width={10}
            keys
            mouse
            inputOnFocus
          ></blessed-textbox> */}
          {/* <blessed-radioset>
            <blessed-radiobutton
              top={0}
              height={1}
              width={10}
              text="X"
              mouse
            ></blessed-radiobutton>
            <blessed-radiobutton
              top={0}
              height={1}
              left={10}
              width={10}
              text="Y"
              mouse
            ></blessed-radiobutton>
          </blessed-radioset> */}

          <blessed-box left={"50%-10"} top={"50%"}>
            {chalk.hex("#999")("press [SPACE] to start")}
          </blessed-box>
        </>
      ) : renderChart ? (
        <StackedBar
          barWidth={1}
          barSpacing={1}
          xOffset={0}
          maxValue={1}
          left={1}
          top={-2}
          height={"100%-1"}
          width={"100%"}
          showText={false}
          showLegend={true}
          barBgColor={["red", "green", "blue"]}
          data={renderChart}
        />
      ) : (
        particles.current.map((p, i) =>
          p.hide ? null : (
            <blessed-box
              width={1}
              height={1}
              key={i}
              left={Math.round(p.x)}
              top={Math.round(p.y)}
            >
              {p.colliding
                ? chalk.bgRed.hex("#f00")("■")
                : chalk.hex(
                    p.state === IState.Sick
                      ? "F00"
                      : p.state === IState.Recovered
                      ? "0FF"
                      : "0F0"
                  )(
                    p.state === IState.Sick
                      ? "◆"
                      : p.state === IState.Recovered
                      ? "\u2022"
                      : "\u2022"
                  )}
            </blessed-box>
          )
        )
      )}
      <Footer
        text="Disease Spread Simulation"
        right={renderChart ? "blessed-contrib/bar" : ""}
      />
    </blessed-box>
  );
};

// BOX 2588

// const TestAnimation = () => {
//   const [count, setCount] = useState(0);

//   useAnimationFrame(deltaTime => {
//     setCount(prevCount => (prevCount + deltaTime * 0.02) % 30);
//   });

//   return <blessed-box left={Math.round(count)}>{"\u2022"}</blessed-box>;
// };

export default Particle;
// export default TestAnimation;
