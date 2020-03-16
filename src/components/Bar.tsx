import React from "react";
import { createBlessedComponent } from "react-blessed-contrib";
import { stackedBar } from "blessed-contrib";

const _StackedBar = createBlessedComponent(stackedBar);

export const StackedBar = props => {
  return <_StackedBar {...props}></_StackedBar>;
};
