import React, { useMemo, useLayoutEffect, useContext, useState } from "react";
import parse from "csv-parse/lib/sync";
import fs from "fs";
import path from "path";
import chalk from "chalk";

import Map from "../Map";
import { ScreenContext } from "../context";
import { useAnimationFrame } from "../hooks";
import Footer from "../Footer";

const population = {
  Alabama: 4903185,
  Alaska: 731545,
  Arizona: 7278717,
  Arkansas: 3017825,
  California: 39512223,
  Colorado: 5758287,
  Connecticut: 3565287,
  Delaware: 973764,
  //"Diamond Princess": 0,
  "District of Columbia": 705749,
  Florida: 21477737,
  Georgia: 10617423,
  // "Grand Princess": 0,
  // Guam: 0,
  Hawaii: 1415872,
  Idaho: 1787147,
  Illinois: 12671821,
  Indiana: 6732219,
  Iowa: 3155070,
  Kansas: 2913314,
  Kentucky: 4467673,
  Louisiana: 4648794,
  Maine: 1344212,
  Maryland: 6045680,
  Massachusetts: 6949503,
  Michigan: 9986857,
  Minnesota: 5639632,
  Mississippi: 2976149,
  Missouri: 6137428,
  Montana: 1068778,
  Nebraska: 1934408,
  Nevada: 3080156,
  "New Hampshire": 1359711,
  "New Jersey": 8882190,
  "New Mexico": 2096829,
  "New York": 19453561,
  "North Carolina": 10488084,
  "North Dakota": 762062,
  Ohio: 11689100,
  Oklahoma: 3956971,
  Oregon: 4217737,
  Pennsylvania: 12801989,
  "Puerto Rico": 3193694,
  "Rhode Island": 1059361,
  "South Carolina": 5148714,
  "South Dakota": 884659,
  Tennessee: 6833174,
  Texas: 28995881,
  // US: 327533795,
  "United States Virgin Islands": 104914,
  Utah: 3205958,
  Vermont: 623989,
  "Virgin Islands": 104914,
  Virginia: 8535519,
  Washington: 7614893,
  "West Virginia": 1792065,
  Wisconsin: 5822434,
  Wyoming: 578759
};

const file = fs.readFileSync(
  path.resolve(
    __dirname,
    "../../../../COVID-19/csse_covid_19_data/csse_covid_19_daily_reports/03-19-2020.csv"
  )
);
const records = parse(file, {
  columns: true,
  skip_empty_lines: true
});

const lonToMap = lon => +lon + 180;
const latToMap = lat => +lat + 90;
// const mapToLon = lon => lon - 180
// const mapToLat = lat => lat - 90;
const recordInRegion = (
  { Latitude, Longitude },
  { startLat, startLon, endLat, endLon }
) =>
  latToMap(Latitude) > startLat &&
  latToMap(Latitude) < endLat &&
  lonToMap(Longitude) > startLon &&
  lonToMap(Longitude) < endLon;

const filter = (region, { showNumbers = false, showDeaths = false } = {}) => {
  // const { startLat, startLon, endLat, endLon } = region;
  const totals = records.reduce(
    (t, r) => {
      if (recordInRegion(r, region)) {
        const pop = population[r["Province/State"]];
        if (pop) {
          const perMillion = pop / 1000000;
          const confirmed = +r.Confirmed / perMillion;
          const deaths = +r.Deaths / perMillion;
          t.Confirmed[0] = Math.min(t.Confirmed[0], confirmed);
          t.Confirmed[1] = Math.max(t.Confirmed[1], confirmed);
          t.Deaths[0] = Math.min(t.Deaths[0], deaths);
          t.Deaths[1] = Math.max(t.Deaths[1], deaths);
        }
      }
      return t;
    },
    {
      Confirmed: [Number.MAX_SAFE_INTEGER, 0],
      Deaths: [Number.MAX_SAFE_INTEGER, 0]
    }
  );
  //{"Province/State":"","Country/Region":"Taiwan*","Last Update":"2020-03-11T20:00:00","Confirmed":"50","Deaths":"1","Recovered":"20","Latitude":"23.7","Longitude":"121"}]
  //logger.warn(records);

  return records
    .reduce((l, r) => {
      const key = showDeaths ? "Deaths" : "Confirmed";
      if (recordInRegion(r, region)) {
        const colors = [
          /*[255, 255, 204],
        [255, 237, 160],
        [254, 217, 118],
        [254, 178, 76],
        [253, 141, 60],
        [252, 78, 42],
        [227, 26, 28],
        [189, 0, 38],
        [128, 0, 38]*/

          //[255, 255, 178],
          [0, 0, 129],
          [254, 204, 92],
          [253, 141, 60],
          [227, 26, 28]
        ];

        //if (val > 0) logger.warn("index: " + val);
        // console.log(val);
        //if (val != 0) logger.warn("val is " + val);
        // logger.warn(
        //   JSON.stringify({
        //     num: +r[key],
        //     min: totals[key][0],
        //     max: totals[key][1],
        //     diff: totals[key][1] - totals[key][0],
        //     colorIndex: val
        //   })
        // );
        if (r[key] !== "0") {
          // if (r["Country/Region"] === r["Province/State"]) {
          //   console.log("CCCC", r["Province/State"] + " =  " + r[key]);
          // }

          const pop = population[r["Province/State"]];
          let adjusted = +r[key];
          if (pop) {
            const perMillion = pop / 1000000;
            adjusted = +r[key] / perMillion;

            const val = Math.trunc(
              ((adjusted - totals[key][0]) /
                (totals[key][1] - totals[key][0])) *
                (colors.length - 1)
            );

            l.push({
              lat: +r["Latitude"],
              lon: +r["Longitude"],
              color: colors[val], //[0, 128, 0],
              char: showNumbers
                ? String(Math.round(adjusted))
                : String.fromCharCode(9601 + val) // r[key] // "\u2022"
              //String(Math.round(adjusted)) //
              //"\u25EF" // : "\u2022" //  String.fromCharCode(9601 + val)

              //"\u2581"
              // char: r.Deaths
              //String(parseInt(r["Deaths"], 10) / 10)
            });
          }
        }
      }
      return l;
    }, [])
    .sort((a, b) => b.color - a.color);
};

enum MapState {
  Intro,
  World,
  US,
  Animating
}
interface Region {
  state: MapState;
  region?: string;
  startLon: number;
  endLon: number;
  startLat: number;
  endLat: number;
}
interface AnimateRegion {
  initial: Region;
  target: Region;
}
const regionUs: Region = {
  state: MapState.US,
  region: "us",
  startLon: 50,
  endLon: 110,
  startLat: 115,
  endLat: 140
};
// Long -180, 180   360 +180 ==
//
// Lat  -90   90    180 +90
const regionWorld: Region = {
  state: MapState.World,
  startLon: 0,
  endLon: 360,
  startLat: 0,
  endLat: 180
};
const Covid = () => {
  const screen = useContext(ScreenContext);
  const [region, setRegion] = useState<Region>(regionWorld);
  const [state, setState] = useState<MapState>(MapState.Intro);
  const [animateToRegion, setAnimateToRegion] = useState<AnimateRegion>();
  const [startTime, setStartTime] = useState<number>();
  const [showNumbers, setShowNumbers] = useState(false);
  const [showDeaths, setShowDeaths] = useState(false);
  const targetRegion: Region = animateToRegion
    ? animateToRegion.target
    : region;
  const markers = useMemo(() => {
    if (targetRegion.state !== MapState.US) {
      return [];
    }
    return filter(targetRegion, { showNumbers, showDeaths });
  }, [targetRegion, state, showNumbers, showDeaths]);

  useLayoutEffect(() => {
    screen.key("space", handler);
    screen.key("n", toggleNumbers);
    screen.key("m", toggleType);
    function toggleNumbers() {
      setShowNumbers(n => !n);
    }
    function toggleType() {
      setShowDeaths(n => !n);
    }
    function handler() {
      if (state === MapState.Intro) {
        setState(MapState.World);
      } else if (state !== MapState.Animating) {
        setAnimateToRegion(
          state === MapState.World
            ? { initial: regionWorld, target: regionUs }
            : { initial: regionUs, target: regionWorld }
        );
        setStartTime(Date.now());
      }
    }
    return () => {
      screen.unkey("space", handler);
      screen.unkey("n", toggleNumbers);
      screen.unkey("m", toggleType);
    };
  }, [state]);

  useAnimationFrame(
    dt => {
      if (!startTime || !animateToRegion) return;
      else {
        const elapsed = Date.now() - startTime;
        const duration = 1000;
        const percent = elapsed / duration;
        if (percent >= 1) {
          setRegion(animateToRegion.target);
          setState(animateToRegion.target.state);
          setAnimateToRegion(null);
          return false;
        }
        if (Math.round(percent * 100) % 2 === 0) {
          const easeOut = k => k * (2 - k);
          const interpolate = (start, end) =>
            start + (end - start) * easeOut(percent);
          setRegion({
            region: null,
            state: MapState.Animating,
            startLon: interpolate(
              animateToRegion.initial.startLon,
              animateToRegion.target.startLon
            ),
            endLon: interpolate(
              animateToRegion.initial.endLon,
              animateToRegion.target.endLon
            ),
            startLat: interpolate(
              animateToRegion.initial.startLat,
              animateToRegion.target.startLat
            ),
            endLat: interpolate(
              animateToRegion.initial.endLat,
              animateToRegion.target.endLat
            )
          });
        }
      }
    },
    [startTime, animateToRegion]
  );

  const { region: regionName, startLat, endLat, startLon, endLon } = region;
  const key =
    state +
    String(showNumbers) +
    String(showDeaths) +
    regionName +
    [startLat, endLat, startLon, endLon].join("|");

  return (
    <blessed-box>
      {state === MapState.Intro ? (
        <blessed-box>
          <blessed-box left={"50%-10"} top={"50%"}>
            {chalk.hex("#999")("press [SPACE] to start")}
          </blessed-box>
          <Footer text="What else can we draw?" right="blessed-contrib/map" />
        </blessed-box>
      ) : (
        <>
          <blessed-box top={0} bottom={1} left={0} right={0}>
            <Map
              region={regionName}
              key={key}
              startLat={startLat}
              endLat={endLat}
              startLon={startLon}
              endLon={endLon}
              markers={markers}
            ></Map>
          </blessed-box>
          {regionName === "us" ? (
            <Footer
              text={`${showDeaths ? "Deaths" : "Confirmed Cases"} ${
                showNumbers ? "(pop adj / mil)" : ""
              }`}
              right="github.com/CSSEGISandData/COVID-19"
            />
          ) : null}
        </>
      )}
    </blessed-box>
  );
};

export default Covid;
