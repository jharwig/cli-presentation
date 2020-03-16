// Note: this setup is described in @jlongster's "Backend with Webpack" post
// https://github.com/jlongster/backend-with-webpack/

var webpack = require("webpack");
var path = require("path");
var fs = require("fs");
var nodemon = require("nodemon");
var log = require("simple-node-logger");

const logger = log.createSimpleFileLogger("server.log");
logger.setLevel("all");

logger.log("Starting Server…");

var nodeModules = {};
fs.readdirSync("node_modules")
  .filter(function(x) {
    return [".bin"].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = "commonjs " + mod;
  });

var backendConfig = {
  mode: "development",
  entry: "./src/main.tsx",
  //devtool: 'source-map',
  target: "node",
  output: {
    path: path.join(__dirname, "build"),
    filename: "backend.js"
  },
  node: {
    __dirname: true,
    __filename: true
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        include: path.join(__dirname, "src"),
        use: [
          {
            loader: "babel-loader"
          }
        ]
      }
    ]
  },
  externals: nodeModules,
  recordsPath: path.join(__dirname, "build", "_records"),
  plugins: [
    new webpack.IgnorePlugin(/\.(css|less)$/),
    //new webpack.BannerPlugin('require("source-map-support").install();', {
    //raw: true,
    //entryOnly: false,
    //}),
    new webpack.HotModuleReplacementPlugin({ quiet: true })
  ]
};

var running = false;

webpack(backendConfig).watch(
  {
    aggregateTimeout: 300,
    poll: undefined
  },
  function(err, stats) {
    if (!running) {
      running = true;
      nodemon({
        execMap: {
          js: "node"
        },
        script: path.join(__dirname, "build", "backend"),
        restartable: false,
        ignore: ["*"],
        watch: ["foo/"],
        ext: "noop",
        stdin: false
        // verbose: true,
        // spawn: true
      });

      nodemon
        .on("exit", function() {
          logger.log("exit");
          process.exit();
        })
        .on("crash", function() {
          logger.log("crash");
          process.exit();
        })
        .on("quit", function() {
          logger.log("quit");
          process.exit();
        });
    }

    // There's a trick here. Restart will just send SIGUSR2 to our process.
    // src/signal.js will intercept it and handle hot update instead of restarting.
    nodemon.restart();
  }
);
