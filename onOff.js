const { debug } = require('./debug');

//clever promise based python type sleep function to stop the code
const sleep = (seconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
};

const runOnOff = async ({ run = true } = {}) => {
  if (run) debug('is ON !!!');
  if (!run) debug('is Off !!!');
};
let isRunning;
const runOnOffWithLoop = async ({ run = true } = {}) => {
  isRunning = run;
  //run forever until break
  while (isRunning === true) {
    // ON for 3 seconds
    debug('is ON !!!');
    await sleep(3);

    // OFF for 3 seconds
    debug('is OFF');
    await sleep(3);

    if (isRunning === false) {
      debug('is OFF last');
      break;
    }
  }
};

const terminateScript = () => {
  debug('terminated by Ctrl+C', 'red');
  runOnOff({ run: false });
};

// Handle Ctrl+C exit cleanly
process.on('SIGINT', () => {
  terminateScript();
  process.exit();
});

//runOnOff();

module.exports = { runOnOff, terminateScript };
