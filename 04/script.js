const fs = require('fs');

const load = () => fs.readFileSync('./data.txt', 'utf-8')
  .trim()
  .split("\n")


const parseLog = (log) => {
  const re = /\[(\d+)-(\d+)-(\d+) (\d+):(\d+)\] (Guard #)?(\d+ )?(.+)/;
  const stampData = log.match(re);
  const [, year, month, day, hours, minutes] = stampData;
  const time = new Date(year, month - 1, day, hours, minutes);
  return {
    time,
    guard_id: Number(stampData[7]),
    action: stampData[8].trim()
  }
};

const updateGuard = (guard, start, end) => {
  while (end - start !== 0) {
    const newMinutes = end.getMinutes() - 1; 
    end.setMinutes(newMinutes);
    guard.minuteLog[newMinutes] = guard.minuteLog[newMinutes] || 0;
    guard.minuteLog[newMinutes] += 1;
  }

  return guard;
}

const findMaxSleepTime = (logs) => {
  let currentGuard = null;
  let sleepStart = null;
  let bigSleeper = null;
  let maxMinutesSlept = null;
  const sleepLog = {};


  logs.forEach(log => {
    switch(log.action) {
      case 'begins shift':
        currentGuard = log.guard_id;
        break;
      case 'falls asleep':
        sleepStart = log.time;
        break;
      case 'wakes up':
        let guard = sleepLog[currentGuard] || {
          id: log.guard_id || currentGuard,
          minuteLog: {}
        };

        guard = updateGuard(guard, sleepStart, log.time);
        sleepLog[currentGuard] = guard;

        const minutes = Object.values(guard.minuteLog)
          .reduce((accum, n) => accum + n, 0);

        if (minutes > maxMinutesSlept) {
          maxMinutesSlept = minutes;
          bigSleeper = guard.id;
        }

        break;
      default:
        throw Error(`invalid action: ${log.action}`);
    }
  });

  const sleepy = sleepLog[bigSleeper];
  sleepy.minutesSlept = maxMinutesSlept;
  return [sleepy, sleepLog];
}

const findSleepiestMinute = (log) => {
  const sortedMinutes = Object.entries(log)
    .sort((a, b) => b[1] - a[1])
  return sortedMinutes[0];
}

const findMostReliable = (logs) => {
  let sleepy = null
  let reliableMinute = null;
  let max = null;

  const sleeps = Object.values(logs).map(Object.values);
  for (let i = 0; i < sleeps.length; i += 1) {
    const [ minute, cnt] = findSleepiestMinute(sleeps[i][1])
    if (cnt > max) {
      reliableMinute = Number(minute);
      sleepy = sleeps[i][0];
      max = cnt;
    }
  }

  return [sleepy, reliableMinute];
}

const run = () => {
  const data = load();
  const logs = data.map(parseLog)
    .sort((a, b) => a.time - b.time);

  const [bigSleeper, sleepLog] = findMaxSleepTime(logs);
  const { minutesSlept, id, minuteLog } = bigSleeper;


  const [sleepiestMinute, count] = findSleepiestMinute(minuteLog);

  const [ consistentSleeper, minute ] = findMostReliable(sleepLog);
   
  console.log(`The guard with the most hours slept is: ${id} and they slept ${minutesSlept} minutes.; the most slept minute was ${sleepiestMinute}; the id multipled by the sleepiest minute is ${id * sleepiestMinute}`);
  console.log(`The guard with the sleepiest minute is ${consistentSleeper}; the sleepiest minute is: ${minute}; the minute times the guard's id is: ${consistentSleeper * minute}`)
}

run();
