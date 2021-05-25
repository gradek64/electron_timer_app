function setBubble(range, bubble, bubbleSize) {
  const { value, max, min } = range;
  const minValue = min ? min : 0;
  const maxValue = max ? max : 100;
  const newValue = Number(((value - minValue) * 100) / (maxValue - minValue));
  bubble.innerHTML = parseFloat(value).toFixed(2);
  console.log('bubblesize...', bubbleSize);
  console.log('newValue percentage', `${newValue / 100}`);

  //calculation
  const draggableSize = bubbleSize / 2;
  //the half size has to be set from -bubbleSize/2 for 100% and bubbleSize/2 for 0
  //example size: 26 0%= 13-0 for 100%: 13-26
  const rangeFromPositiveNegativeSize = (draggableSize / 100) * 2;
  console.log(
    'newValue rangeFromPositiveNegativeSize',
    newValue * rangeFromPositiveNegativeSize,
  );

  bubble.style.left = `calc(${newValue}% + (${
    draggableSize - newValue * rangeFromPositiveNegativeSize
  }px))`;

  //display desireTemperature
  const temperature = Number(value).toFixed(2);
  const desireTemperature = document.getElementById('desireTemperature');
  const desireTemperatureInfo = document.getElementById(
    'desireTemperatureInfo',
  );
  desireTemperature.innerHTML = `${parseFloat(temperature)}&#xb0;C`;
  desireTemperatureInfo.innerHTML = `${parseFloat(temperature)}&#xb0;C`;
}

module.exports = { setBubble };
