import React, { useRef, useEffect } from "react";
import "react-blessed";
import chalk from "chalk";
import gradient from "gradient-string";

import Carousel from "./Carousel";
import Slide from "./Slide";
import Markdown from "./Markdown";
import Covid from "./slides/Covid";
import Particle from "./slides/Particle";
import BlinkingPrompt from "./BlinkingPrompt";
import Progress from "./Progress";
import Finale from "./Finale";
import Dashboard from "./Dashboard";

const App: React.FC<{
  screen: any;
}> = ({ screen }) => {
  return (
    <Carousel defaultPage={10} controlKeys={true} screen={screen}>
      <Slide
        center="Command Line Interfaces"
        centerSub="Creating High-Fidelity CLI Tools"
        footer="Kensho Tech Talk  •  Jason Harwig  •  03-20-2020"
      >
        <BlinkingPrompt screen={screen} />
      </Slide>

      {/* <Slide header="Why Command Line?">
        <Markdown>
          {chalk`
          *
          {grey Long/short versions order tolerant}
          ${"\n"}
          * Shell {bold.hex('#F41') Citizen}
          {grey Piping, Output stdout / stderr, Exit codes, Silent by default}          
          ${"\n"}
          * Do {hex("#F41") One Thing} and Do It {hex("#F41") Well}
          {grey Unix philosophy} 
        `}
        </Markdown>
      </Slide> */}

      <Slide header="What Makes a Good Command Line Interface?">
        <Markdown>
          {chalk`
          * Lenient {hex("#F41") arguments}
          {grey Long/short versions, order tolerant}
          ${"\n"}
          * Shell {bold.hex('#F41') Citizen}
          {grey Piping, Output stdout / stderr, Exit codes, Silent by default}          
          ${"\n"}
          * Do {hex("#F41") One Thing} and Do It {hex("#F41") Well}
          {grey Unix philosophy} 

          \`\`\`
            cat server.log | grep DEBUG | awk '\{print \$2\}' | sed 's/[-.]/_/g'
            {hex('#aaa') print            search       extract            transform}
          \`\`\`
        `}
        </Markdown>
      </Slide>

      <Slide header={"What is this Talk About?"}>
        <Markdown>
          {`
          * ${chalk.bold("Fun Stuff!")}

            * ${gradient("blue", "red")("Vibrant Colors")}, ${chalk.bold(
            "Bold"
          )}, ${chalk.underline("Underlines")}, ${chalk.hex("#ccc")(
            "and… \x1b[5mBlink\x1b[0m"
          )}
            * Drawing
            * Animation
            * <Declarative/>
          `}
        </Markdown>
      </Slide>

      <Slide header="How do you create these effects?">
        <Markdown>
          {`
          * ANSI Escape Codes ${chalk.grey("(VT100 Control Codes)")}
              
            \`\`\`sh
              ${chalk.hex("#F41")("ESC[")}${chalk.hex("#113FFF")(
            "CODE1;CODE2"
          )}${chalk.hex("#F41")("m")}          ESC ┬── 27 decimal
              ${chalk.hex("#F41")("│")}        ${chalk.hex("#113FFF")(
            "│"
          )}     ${chalk.hex("#F41")("│")}              ├ \\x1b hex
              ${chalk.hex("#F41")("Start")}    ${chalk.hex("#113FFF")(
            "│"
          )}   ${chalk.hex("#F41")("End")}              └ \\033 octal      
                    ${chalk.hex("#113FFF")("Display Attributes")}
            \`\`\`       
          ${"\n"}    
          * Example

            \`\`\`sh            
               ${chalk.black.underline(
                 "\\x1b[1;4;31;42m"
               )} Hello ${chalk.black.underline(
            "\\x1b[0m"
          )}World    ${chalk.grey(
            "➡"
          )}    ${"\x1b[1;4;31;42m Hello \x1b[0mWorld"}          
          ${chalk.bold("Bold")} ━━━┛ ┃ ${chalk.red("┃")}  ${chalk.green(
            "┃"
          )}        Reset ┛ 
              ${chalk.underline("Under")} ━━┛ ${chalk.red("┃")}  ${chalk.green(
            "┃"
          )}
          ${chalk.red("Red (fg)")} ${chalk.red("━━━┛")}  ${chalk.green("┃")}
             ${chalk.green("Green (bg)")} ${chalk.green("━━━┛")}
                    
            \`\`\`      
          
          `}
        </Markdown>
      </Slide>

      <Slide header="More Color…">
        <Markdown>{chalk`
        * ${gradient(
          "blue",
          "red"
        )("256 colors")} {grey (More support)}          
          {grey 16 standard + 216 colors + 23 greyscale}
        
        \`\`\`
           \\x1b[38;{black 5};{ansi256(128) 128}m Hello                    => \x1b[38;5;128m Hello
        fgcolor ┛  {black ┃}  {ansi256(128) ┃}
             {black 8-bit ┛}  {ansi256(128) ┗ Color}
        \`\`\`
        
        * ${gradient(
          "red",
          "green",
          "blue"
        )("16 million colors")} {grey (Limited support)}          
          {grey Red, green, blue as 0-255}
          	
        \`\`\`
           \\x1b[38;{black 2};{red 162};{green 64};{blue 208}m Hello             => \x1b[38;2;162;64;208m Hello
        fgcolor ┛  ┃  {red ┃}  {green ┃}   {blue ┗ Blue}
            {black 24-bit} ┛  {red ┃}  {green ┗ Green}
                      {red ┗ Red}            
        \`\`\`
        
        `}</Markdown>
      </Slide>

      <Slide header="This is kind of tedius…">
        <Markdown>{chalk`
        \`> npm install chalk\`
          {bold.blue.underline github.com/chalk}

        \`\`\`js        
        // Chain display attributes
        chalk.red.underline('Hello World');
                        // ┗ {red.underline Hello World}
        

        chalk.bgAnsi256(128).hex('#0F0')('Use RGB')
                                     // ┗ {bgAnsi256(128).hex('#0F0') Use RGB}

        \`\`\`
        `}</Markdown>
      </Slide>

      <Slide header="What else can you do?">
        <Markdown>
          {chalk`
          * Gather {bold.hex("#F41") Input} from mouse/keyboard
            {grey Arrow keys sent to STDIN as new escape sequences \`\\x1b[{bold.black D}\` = ⬅️}
            {hex('#aaa') (A,B,C,D)}
          ${"\n"}
          * {bold.hex("#F41") Move} the cursor

            \`\`\`
            {green H3llo World}{underline \\x1b[{blue 10}{red D}}{green e}     {hex('#aaa') OR \\x1b[{bold.black 2G}}
             ┳  {red ←} {blue 10}   ┳             {hex('#aaa') Move to column 2}
             ┗━━━━━━━━━┛                         
            \`\`\`
          ${"\n"}
          * {bold.hex("#F41") Clear} parts (or all) of the {bold.hex("#F41") screen}

            \`\`\`
            {green H3llo World}{underline \\x1b[{bold.black 2K}}
                Clear line ━┛ {hex('#aaa') (doesn't move cursor, 0=after 1=before)}
            \`\`\`          
          `}
          {/** Unicode box-drawing characters
                    
          ┌───────────────────┐
          │  ╔═══╗ Some Text  │▒
          │  ╚═╦═╝ in the box │▒
          ╞═╤══╩══╤═══════════╡▒  wikipedia.org/wiki/Box_Drawing_(Unicode_block)
          │ ├──┬──┤           │▒
          │ └──┴──┘           │▒
          └───────────────────┘▒
           ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒        
          `*/}
          {/*https://en.wikipedia.org/wiki/Box-drawing_character*/}
        </Markdown>
      </Slide>

      <Slide header="Will you just tell me how to make a progress indicator‽‽">
        <Progress />
      </Slide>

      <Slide header="A little bit higher-level now?…">
        <Markdown>{chalk`
        * curses {grey Screen Updating and Cursor Movement Optimization '77}
          {grey (pcurses, PDcurses, ncurses)}                
        * {bold Python}: Blessings, Blessed {grey github.com/jquast/blessed}              
        * {bold Node}: Blessed {grey github.com/chjj/blessed}, neo-blessed
          
          \`\`\`js
          const \{screen, box\} from 'blessed';
          screen(\{\}).append(box(\{
            label: "Label",                 
            right:  3, bottom: 2,
            width: 12, height: 4,
            draggable: true,  
            style: \{              
              bg: "magenta",
              transparent: true
            \}          
          \}));
          \`\`\`
        `}</Markdown>
        <blessed-box
          right={7}
          draggable={true}
          bottom={5}
          width={16}
          height={6}
          label={"Label"}
          border={{ type: "line" }}
          style={{
            border: { fg: "magenta" },
            bg: "magenta",
            transparent: true
          }}
        />
      </Slide>

      <Covid />

      <Particle />

      <Dashboard screen={screen} />

      <Slide header="Imperative Programming? in 2020?">
        <Markdown>{chalk`
        * {bold react-blessed} {grey Creates a} \`ReactFiberReconciler\` {grey that maps to blessed api}          
                         {hex('#aaa') github.com/Yomguithereal/react-blessed}
          
        \`\`\`js
        const FunkyFire = () => \{
          const particles = useParticleEngine(6);

          return (            

              \{particles.map(particle => (
                <blessed-box key=\{particle.key\} \{...particle.box\} />
              ))\}

          );
        \}
        \`\`\`                         
        `}</Markdown>
        <blessed-box left={6} top={7} width={2} height={1}>
          {chalk.hex("#aaa")("<>")}
        </blessed-box>
        <blessed-box left={6} top={11} width={3} height={1}>
          {chalk.hex("#aaa")("</>")}
        </blessed-box>
        <Finale />
      </Slide>
    </Carousel>
  );
};

export default App;
