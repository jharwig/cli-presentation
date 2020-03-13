// This is copied from webpack/hot/signal.js
// but I removed the console.logs I don't care about
// so that they don't overlap my application.

if (module["hot"]) {
  const { hot }: { hot: any } = module as any;
  function checkForUpdate(fromUpdate) {
    hot.check(function(err, updatedModules) {
      if (err) {
        if (
          hot.status() in
          {
            abort: 1,
            fail: 1
          }
        ) {
          console.warn("[HMR] Cannot apply update.");
          console.warn("[HMR] " + err.stack || err.message);
          console.warn("[HMR] You need to restart the application!");
        } else {
          console.warn("[HMR] Update failed: " + err.stack || err.message);
        }
        return;
      }
      if (!updatedModules) {
        return;
      }

      hot.apply(
        {
          ignoreUnaccepted: true
        },
        function(err, renewedModules) {
          if (err) {
            if (
              hot.status() in
              {
                abort: 1,
                fail: 1
              }
            ) {
              console.warn(
                "[HMR] Cannot apply update (Need to do a full reload!)"
              );
              console.warn("[HMR] " + err.stack || err.message);
              console.warn("[HMR] You need to restart the application!");
            } else {
              console.warn("[HMR] Update failed: " + err.stack || err.message);
            }
            return;
          }

          checkForUpdate(true);
        }
      );
    });
  }

  process.on("SIGUSR2", function() {
    if (hot.status() !== "idle") {
      console.warn(
        "[HMR] Got signal but currently in " + hot.status() + " state."
      );
      console.warn("[HMR] Need to be in idle state to start hot update.");
      return;
    }

    checkForUpdate(false);
  });
}
