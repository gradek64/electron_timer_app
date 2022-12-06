const { debug } = require('./debug');

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});

function getSecondsToday() {
  let now = new Date();
  let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let diff = now - today;
  return Math.round(diff / 1000);
}


window.addEventListener('DOMContentLoaded', () => {

  /***** open overlay with time slots*****/
  const overlaySlotsBttn = document.getElementById('overlaySlotsBttn')
  overlaySlotsBttn.addEventListener('click', () => {
    document.getElementById('heatingBoard').style.display ='block'
  });

  //overlay elements
  const outsideOverlay =
    document.querySelector('.overlay-flex-wrapper')
     || null;

  /****** close overlay ******/
  const saveAndCloseBtton = document.getElementById('SaveAndClose')
  const closingElements = [saveAndCloseBtton,outsideOverlay]
  closingElements.forEach((element)=>{

    element.addEventListener('click', (e) => {
      if(e.target.className === 'progressBoardContent' ||
      e.target.classList.contains('save')){
        document.getElementById('heatingBoard').style.display ='none'
      }
    });
  })
  

  /****** end of close overlay ******/


  //setting initial time
  var currentSec = getSecondsToday();
  //data
  const getHours12Format = () => new Date().getHours() % 12 || 12;
  const getMorningOrAfternoon = ()=> new Date().getHours() >= 12 ? 'PM':'AM'
  const getMins = () => new Date().getMinutes();
  const getMinsFormat = () => (getMins() < 10 ? `0${getMins()}` : getMins());
  const minutesMapping = {
    0: 0,
    20: 1,
    40: 2,
    59: 3,
  };

  //------------clock digits display -----------//

  const clock_display_container = document.querySelectorAll('.clock_display');
  const timeDisplay = `<span>${getHours12Format()}:${getMinsFormat()}</span><span class='morning-afternoon'>${getMorningOrAfternoon()}</span>`;
  clock_display_container[0].innerHTML = timeDisplay;
  clock_display_container[1].innerHTML = timeDisplay;
  
  //check time
  setInterval(() => {
    clock_display_container[0].innerHTML = `<span>${getHours12Format()}:${getMinsFormat()}</span><span class='morning-afternoon'>${getMorningOrAfternoon()}</span>`;
    clock_display_container[1].innerHTML = `<span>${getHours12Format()}:${getMinsFormat()}</span><span class='morning-afternoon'>${getMorningOrAfternoon()}</span>`;
    //check if time matches the slot selected every 30s
    const timeInHoundreds = Number(`${getHours12Format()}${getMinsFormat()}`)
    const timeSlots = activeTimeSlots.map(({slot})=>slot)

    for(i=0;i<timeSlots.length;i++){
      debug('----currerent time -----::',timeInHoundreds)
      debug('compare to :',Number(timeSlots[i]))
      debug('timeInHoundreds % 20 === 0 ',!!timeInHoundreds % 20 === 0 )
    
      if(Number(timeSlots[i]) === timeInHoundreds ){
        if(PinIsOn===false){
          PinIsOn = true
          debug('==== PIN is set ON ====')
          break 
        }
        //break to not check rest of pins fo the batch
        debug('==== PIN is still... set  ON====')
        break
      }

      //chek every 20 mins
      if(PinIsOn===true && timeInHoundreds % 20 === 0 ) {
          PinIsOn = false
          debug('PIN is set OFF')
          break 
      }
      
    if(PinIsOn===true){
      debug('==== PIN is still... set  ON  from previous ON')
    }else {
      debug('==== PIN is still... set  OFF  from previous OFF')
    }
    
     
    }
  }, 35000)
  //---------//

  let activeTimeSlots = [];
  let PinIsOn = false;

  const minutesSlotsArray = Object.keys(minutesMapping)
  const foundClosestMinute = minutesSlotsArray
    .reverse()
    .find((slot) => slot <= getMins());
  const hoursInMinutesSlot = getHours12Format() * (minutesSlotsArray.length - 1);
  const minutesAfterFullHourMap = minutesMapping[foundClosestMinute];
  const timeBlockContainer = document.getElementById('time_blocks_container');

  const removeTimeSlot = (slot, slotToNumber) => {
    const indexToRemove = activeTimeSlots.findIndex((e) =>  e.slot === slotToNumber) 
    color = activeTimeSlots[indexToRemove].color
    //slice array before index and after index and combine
    activeTimeSlots = [
      ...activeTimeSlots.slice(0, indexToRemove),
      ...activeTimeSlots.slice(indexToRemove+1)
    ]
    debug('activeTimeSlots', activeTimeSlots);

    // set coloring
    const clockMarkings = document.querySelectorAll('.clock__indicator')
    const timeBlocks = document.querySelectorAll('.time_blocks')

    const currentClockMark = Array.from(clockMarkings).find(
      (mark) => mark.dataset.time === slot)
    currentClockMark.style.borderTop = `7px solid ${color}`;

    const currentBlock = Array.from(timeBlocks).find(
        (block) => block.dataset.time === slot)
    currentBlock.style.background = 'rgb(207, 111, 143)'
    currentBlock.style.color = 'black'
    
    //remove selected block from front 
    const clickedSlot = document.querySelector("[data-slot='" + slot + "']");
    timeBlockContainer.removeChild(clickedSlot);
   
  };
  const selectTimeSlot = (e) => {
    const slot = e.target.getAttribute('data-time');
    const slotToNumber = Number(slot.replace(/:/, ''));

    //if slot already selected
    if (!activeTimeSlots.some((e) => e.slot === slotToNumber)) {
      // set coloring
      const clockMarkings = document.querySelectorAll('.clock__indicator')
      const timeBlocks = document.querySelectorAll('.time_blocks')

      const currentClockMark = Array.from(clockMarkings).find(
        (mark) => mark.dataset.time === slot)
      

      const style = window.getComputedStyle(currentClockMark)
      const border = style.borderTop.match(/rgb.*/)
      currentClockMark.style.borderTop = '7px solid red';

      const currentBlock = Array.from(timeBlocks).find(
          (block) => block.dataset.time === slot)
      currentBlock.style.background = '#3c47c0'
      currentBlock.style.color = 'rgb(244, 238, 215)'

      const timeBlock = document.createElement('div');
      timeBlock.classList.add('time_blocks');
      activeTimeSlots.push({ slot: slotToNumber, color:border[0] });

      debug('activeTimeSlots', activeTimeSlots);
      timeBlock.innerHTML = slot;
      //remove slot on click on it
      timeBlock.addEventListener('click', () => {
        removeTimeSlot(slot,slotToNumber, e.target);
      });
      timeBlock.setAttribute('data-slot', slot);
      timeBlockContainer.appendChild(timeBlock);
    } else {
     removeTimeSlot(slot,slotToNumber);
  
    }
  };

  let timeHour = 0;
  let timeMinutes = 0;

  const setHour = (index) => {
    // only till 12
    if (timeHour >= 12) return 12;
    // 0 and 1 return 0
    if (index <= 1) return 12;
    // every 3 bars increase time
    if ((index + 1) % 3 === 0) timeHour++;

    return timeHour;
  };

  const setSlotMinutes = (index) => {
    //every 1,2 increase by 20 minutes
    if ((index + 1) % 3) {
      timeMinutes += 20;
    } else {
      timeMinutes = 0;
    }
    return timeMinutes === 0 ? '00' : timeMinutes.toString();
  };

  //current time selection
  const actualTimeSection = document.querySelector(
    `section:nth-of-type(${hoursInMinutesSlot + minutesAfterFullHourMap})`,
  );
  actualTimeSection.style.background = 'rgb(255,64,129)';
  actualTimeSection.dataset.current = true
  
  //Dome selection and manipulation
  const allTimeSotsContainer = document.getElementById('overlay-content-slots')
  const allTimeSlots = document.querySelectorAll('.clock__indicator');
  debug('allTimeSlots',allTimeSlots.length)
  Array.from(allTimeSlots).map((timeSlot, index) => {

    const minutes = setSlotMinutes(index);
    const hour = setHour(index);
    timeSlot.dataset.time =`${hour}:${minutes}`;

    const timeBlock = document.createElement('div');
    //!!! cheaky next line could be reused
    timeBlock.dataset.time =`${hour}:${minutes}`;
    timeBlock.classList.add('time_blocks');
    if(timeSlot.dataset.current){
      timeBlock.classList.add('selected');
    }
    timeBlock.innerHTML = timeSlot.dataset.time
    allTimeSotsContainer.appendChild(timeBlock);

    //add listener
    timeSlot.addEventListener('click', selectTimeSlot);
    timeBlock.addEventListener('click', selectTimeSlot);
  
  });

  //show what pin/pins are on
  const inputPins = [{setup:"OUTPUT",pinNumber:24 }]
  const PinsContainer = document.getElementById('pinContainer')
  inputPins.forEach(({pinNumber}) => {
   const pin = document.createElement('div')
   pin.classList.add('material-icons')
   pin.classList.add('mdl-badge')
   pin.classList.add('mdl-badge--overlap')
   pin.classList.add('navyBlueColor')
   pin.classList.add('mdl-badge--no-background')
   pin.id = `pin${pinNumber}`
   pin.setAttribute('data-badge',pinNumber)
   pin.textContent = "power"
   PinsContainer.appendChild(pin)
  });

});
