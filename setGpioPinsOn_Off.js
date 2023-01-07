const rpio = require("rpio")

const { debug } = require("./debug")
//const { terminateScript } = require("../onOff");

let previouslySet
//pins for timer
const { setPins } = require("./configs/config")
const timer_pins = setPins.timer

/*
 * Set the initial state to low.  The state is set prior to the pin
 * being actived, so is safe for devices which require a stable setup.
 */

const turnPins = ({ LOW_HIGH }) => {
  timer_pins.forEach(({ pinNumber, setup }, index) => {
    if (LOW_HIGH === "HIGH") {
      debug(`pin ${pinNumber} turned: ${LOW_HIGH}`, "blue")
      //pins are defined
      if (rpio.LOW || rpio.HIGH) {
        rpio.open(pinNumber, rpio[setup], rpio.LOW)
        rpio.write(pinNumber, rpio[LOW_HIGH])
        //display pin on
        showActiveNonActivePin({ pinNumber })
      }
    } else if (LOW_HIGH === "LOW") {
      debug(`pin ${pinNumber} turned: ${LOW_HIGH}`, "blue")
      //pins are defined
      if (rpio.LOW || rpio.HIGH) {
        try {
          rpio.close(pinNumber, rpio.PIN_RESET)
          rpio.write(pinNumber, rpio[LOW_HIGH])
          //display pin off
          showActiveNonActivePin({ pinNumber })
        } catch (error) {
          debug(error)
        }
      }
    }
  })
}

const showActiveNonActivePin = ({ pinNumber }) => {
  const pin = document.getElementById(`pin${pinNumber}`)
  const nonActiveClassName = "mdl-badge--no-background"

  debug(
    `pin ${pinNumber} display is ${
      rpio.read(pinNumber) === 0 ? "LOW" : "HIGH"
    }`,
    "blue"
  )

  if (rpio.read(pinNumber) === 0) pin.classList.add(nonActiveClassName)
  if (rpio.read(pinNumber) === 1) pin.classList.remove(nonActiveClassName)
}

module.exports = { turnPins, showActiveNonActivePin }
