import React, { useEffect, useState } from "react";
import parse from "csv-parse/lib/sync";
import fs from "fs";
import path from "path";
// import chalk from "chalk";

import Map from "../Map";
import logger from "../../logger";

const file = fs.readFileSync(
  path.resolve(
    __dirname,
    "../../../../COVID-19/csse_covid_19_data/csse_covid_19_daily_reports/03-15-2020.csv"
  )
);
const records = parse(file, {
  columns: true,
  skip_empty_lines: true
});

const filter = ({ startLat = 0, startLon = 0, endLat = 180, endLon = 180 }) => {
  const totals = records.reduce(
    (t, r) => {
      if (
        +r.Latitude > startLat &&
        +r.Latitude < endLat &&
        +r.Longitude > startLon &&
        +r.Longitude < endLon
      ) {
        t.Confirmed[0] = Math.min(t.Confirmed[0], +r.Confirmed);
        t.Confirmed[1] = Math.max(t.Confirmed[1], +r.Confirmed);
        t.Deaths[0] = Math.min(t.Deaths[0], +r.Deaths);
        t.Deaths[1] = Math.max(t.Deaths[1], +r.Deaths);
      }
      return t;
    },
    {
      Confirmed: [Number.MAX_SAFE_INTEGER, 0],
      Deaths: [Number.MAX_SAFE_INTEGER, 0]
    }
  );
  logger.warn(Date.now(), totals);
  //{"Province/State":"","Country/Region":"Taiwan*","Last Update":"2020-03-11T20:00:00","Confirmed":"50","Deaths":"1","Recovered":"20","Latitude":"23.7","Longitude":"121"}]
  //logger.warn(records);

  return records.reduce((l, r) => {
    const key = "Deaths";
    // if (
    //   r.Latitude > startLat &&
    //   r.Latitude < endLat &&
    //   r.Longitude > startLon &&
    //   r.Longitude < endLon
    // ) {
    const val = Math.round(
      ((+r[key] - totals[key][0]) / (totals[key][1] - totals[key][0])) * 8
    );
    // console.log(val);
    //if (val != 0) logger.warn("val is " + val);

    if (r[key] !== "0") {
      l.push({
        lat: r["Latitude"],
        lon: r["Longitude"],
        char: r[key] // String.fromCharCode(9601 + val)

        //"\u2581"
        // char: r.Deaths
        //String(parseInt(r["Deaths"], 10) / 10)
      });
    }
    return l;
  }, []);
};

const Covid = () => {
  const region = {
    startLon: 50,
    endLon: 110,
    startLat: 115,
    endLat: 140
  };
  const markers = filter(region);
  //region="us"
  return (
    <blessed-box>
      <Map region="us" {...region} markers={markers}></Map>
      <blessed-box height={1} bottom={0}>
        {markers.length}
      </blessed-box>
    </blessed-box>
  );
};

export default Covid;
