import React from "react";
import "react-blessed";

import Carousel from "./Carousel";
import Slide from "./Slide";
import Markdown from "./Markdown";
import Covid from "./slides/Covid";
import Particle from "./slides/Particle";

const App: React.FC<{
  screen: any;
}> = ({ screen }) => {
  return (
    <Carousel defaultPage={0} controlKeys={true} screen={screen}>
      <Covid />
      <Particle />

      <Slide header="First">
        <Markdown>
          {`
\`\`\`js
var foo = function(bar) {
  console.log(bar);
};
foo('Hello');
\`\`\`
`}
        </Markdown>
      </Slide>

      <Slide header="Curses, Blessed, etc.">
        <Markdown>
          {`
This is **markdown** *printed* in the \`terminal\`

1. First
1. Second

* Bulleted list
* sec
* More`}
        </Markdown>
      </Slide>
    </Carousel>
  );
};

export default App;
