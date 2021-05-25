const { debug } = require('./debug');
const { setBubble } = require('./setRangeInputBadge');

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});

window.addEventListener('DOMContentLoaded', () => {
  // Javascript is used to set the clock to your computer time.

  var currentSec = getSecondsToday();

  var seconds = (currentSec / 60) % 1;
  var minutes = (currentSec / 3600) % 1;
  var hours = (currentSec / 43200) % 1;

  setTime(60 * seconds, 'second');
  setTime(3600 * minutes, 'minute');
  setTime(43200 * hours, 'hour');

  function setTime(left, hand) {
    document.querySelector('.clock__' + hand).style.animationDelay = `${
      left * -1
    }s`;
  }

  function getSecondsToday() {
    let now = new Date();

    let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let diff = now - today;
    return Math.round(diff / 1000);
  }
});
