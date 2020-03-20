import React, { useEffect, useRef } from "react";
import { createBlessedComponent } from "react-blessed-contrib";
import { map } from "blessed-contrib";
import chalk from "chalk";

const _Map = createBlessedComponent(map);
const Bullet = "\u2022";

// https://github.com/CSSEGISandData/COVID-19/blob/master/csse_covid_19_data/csse_covid_19_daily_reports/03-13-2020.csv
/*
region="us"
startLon={50}
endLon={110}
startLat={115}
endLat={140}
markers={[
    {
    lon: "-79.0000",
    lat: "37.5000",
    color: "red",
    char: Bullet
    },
    {
    lon: "-81.0000",
    lat: "42.5000",
    color: "blue",
    char: Bullet
    }
]}
*/

const Map: React.FC<{
  region?: string;
  startLon?: number;
  startLat?: number;
  endLat?: number;
  endLon?: number;
  markers?: any[];
}> = ({ region, startLon, endLon, startLat, endLat, markers = [] }) => {
  const mappedMarkers = markers.map(m => ({
    color: "red",
    char: Bullet,
    ...m
  }));

  return (
    <_Map
      {...{
        region,
        startLat,
        startLon,
        endLat,
        endLon,
        markers: mappedMarkers
      }}
      labelSpace={0}
      style={{ shapeColor: "green", stroke: "red", fill: "blue" }}
    ></_Map>
  );
  //github.com/yaronn/map-canvas
};

export default Map;
