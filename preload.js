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

window.addEventListener('DOMContentLoaded', () => {
//Dome selection and manipulation
const allTimeSotsContainer = document.getElementById('overlay-content-slots')
const timeBlockContainer = document.getElementById('time_blocks_container');
const clockMarksContainer = document.querySelector('.clock');
const $every12minSlot = 12;
const $slotsPerHour = 60 / $every12minSlot; 
const $clockFaceHours = 12;
const $allSlots = $slotsPerHour * $clockFaceHours; 


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
  const getHours12Format = () => new Date().getHours() % 12 || 12;
  const getMorningOrAfternoon = ()=> new Date().getHours() >= 12 ? 'PM':'AM'
  const getMins = () => new Date().getMinutes();
  const getMinsFormat = () => (getMins() < 10 ? `0${getMins()}` : getMins());

  const checkCurrentTimeSlot= (asString = false) =>{
    const foundClosestMinute = [0,12,24,36,48,59]
      .reverse()
      .find((slot) => slot <= getMins());
    const formatMinutes = foundClosestMinute === 0 ? '00' : foundClosestMinute

    return asString ? `${getHours12Format()}:${formatMinutes}`: Number(`${getHours12Format()}${formatMinutes}`)
  }

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
    const timeInHundreds = Number(`${getHours12Format()}${getMinsFormat()}`)
    const currentTimeBlock = checkCurrentTimeSlot()
    const timeSlots = activeTimeSlots.map(({slot})=>slot)


    //filter slots that smaller that current time
    const BlocksUpwardsCurrentTimeBlock = timeSlots.filter((timeSlot)=>{
      return timeSlot >= currentTimeBlock
    })
    debug('BlocksUpwardsCurrentTimeBlock',BlocksUpwardsCurrentTimeBlock)

    for(i=0;i<BlocksUpwardsCurrentTimeBlock.length;i++){
      debug('::----current time -----::',timeInHundreds)
      debug('::----compares to ----::',BlocksUpwardsCurrentTimeBlock[i])

      //first condition check upward only from the current time 
      //so current time is 12:00 check 12:12 but don`t check 11 etc 
      if(BlocksUpwardsCurrentTimeBlock[i] === currentTimeBlock){

          if(PinIsOn===false){
            PinIsOn = true
            debug('==== PIN is set ON ====', null,'green')
            break 
          }
          //break to not check rest of pins fo the batch
          debug('==== PIN is still... set ON from previous ON', null ,'green')
          break
        } else {
          if(PinIsOn===true){
            PinIsOn = false
            debug('PIN is set OFF',null, 'red')
            break
          }
          debug('==== PIN is still... set OFF from previous OFF', null ,'red')
        }
      }

  //once there are no slots bigger than current time continue with timer and set Pin OFF until loop continues 
  //for next selected slide after 12 hour mark
    if(BlocksUpwardsCurrentTimeBlock.length === 0){
      debug('::----current time -----:: ',timeInHundreds)

      if(PinIsOn===true){
        PinIsOn = false
        debug('PIN is set OFF',null, 'red')
        return
      }
      debug('==== PIN is still... set OFF from previous OFF', null ,'red')
    }
    
  }, 35000)
  //---------//

  let activeTimeSlots = [];
  let PinIsOn = false;

  const removeTimeSlot = (slot, slotToNumber) => {
    const indexToRemove = activeTimeSlots.findIndex((e) =>  e.slot === slotToNumber) 
    color = activeTimeSlots[indexToRemove].color

    //slice array before index and after index and combine
    activeTimeSlots = [
      ...activeTimeSlots.slice(0, indexToRemove),
      ...activeTimeSlots.slice(indexToRemove+1)
    ]
  
    // set coloring
    const clockMarkings = document.querySelectorAll('.clock__indicator')
    const timeBlocks = document.querySelectorAll('.time_blocks')

    const currentClockMark = Array.from(clockMarkings).find((mark) => mark.dataset.time === slot)
    currentClockMark.style.borderTop = `7px solid ${color}`;

    const currentBlock = Array.from(timeBlocks).find((block) => block.dataset.time === slot)
    currentBlock.style.background = 'rgb(207, 111, 143)'
    currentBlock.style.color = 'black'
    
    //remove selected block from front 
    const clickedSlot = document.querySelector("[data-slot='" + slot + "']");
    timeBlockContainer.removeChild(clickedSlot);

    debug('activeTimeSlots', activeTimeSlots);
  };
  const selectTimeSlot = (e) => {
    const slot = e.target.getAttribute('data-time');
    const slotToNumber = Number(slot.replace(/:/, ''));

    //if slot already selected
    if (!activeTimeSlots.some((e) => e.slot === slotToNumber)) {
      // set coloring
      const clockMarkings = document.querySelectorAll('.clock__indicator')
      const timeBlocks = document.querySelectorAll('.time_blocks')

      const currentClockMark = Array.from(clockMarkings).find((mark) => mark.dataset.time === slot)
      const style = window.getComputedStyle(currentClockMark)
      const border = style.borderTop.match(/rgb.*/)
      currentClockMark.style.borderTop = '7px solid red';

      const currentBlock = Array.from(timeBlocks).find((block) => block.dataset.time === slot)
      currentBlock.style.background = '#3c47c0'
      currentBlock.style.color = 'rgb(244, 238, 215)'

      const timeBlock = document.createElement('div');
      timeBlock.classList.add('time_blocks');
      activeTimeSlots.push({ slot: slotToNumber, color:border[0] });
      //sort slots ascending
      activeTimeSlots.sort((a, b) => a.slot - b.slot);
      timeBlock.innerHTML = slot;
      timeBlock.setAttribute('data-slot', slot);
      timeBlock.addEventListener('click', () => removeTimeSlot(slot,slotToNumber, e.target));

      timeBlockContainer.appendChild(timeBlock);
    } else {
     removeTimeSlot(slot,slotToNumber);
    }
  };

  let timeHour = 0;
  let timeMinutes = 0;

  const setHour = (index) => {
    // increase hour by every $slotsPerHour
    if ((index + 1) % $slotsPerHour === 0) timeHour++;
    if (timeHour === 0 ) return 12;

    return timeHour;
  };

  const setSlotMinutes = (index) => {
    //every 1,2 increase by 20 minutes
    if ((index + 1) % $slotsPerHour) {
      timeMinutes += $every12minSlot;
    } else {
      timeMinutes = 0;
    }
    return timeMinutes === 0 ? '00' : timeMinutes.toString();
  };

  Array($allSlots).fill('').map((_,index) => {
    const timeSlot = document.createElement('section')
    timeSlot.classList.add('clock__indicator')
    clockMarksContainer.appendChild(timeSlot)

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
    //highlight current time block 
    if(`${hour}:${minutes}` === checkCurrentTimeSlot(true)){
      timeBlock.style.background = 'rgb(255,64,129)'
    }

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
