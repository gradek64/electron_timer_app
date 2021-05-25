const { debug } = require('./debug');

const disableComponent = (elementId, className) => {
  const element = document.getElementById(elementId) || null;
  !!element
    ? debug(`element with ${elementId} id not found`)
    : element.classList.add(className);
};

const enableComponent = (elementId, className) => {
  const element = document.getElementById(elementId) || null;
  !!element
    ? debug(`element with ${elementId} id not found`)
    : element.classList.remove(className);
};

module.exports = { disableComponent, enableComponent };
