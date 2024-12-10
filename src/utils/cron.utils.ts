export function convertSecondsToTimeObject(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return { hours, minutes, seconds: secs };
}

export function getJobDescription(timeObject: {
  hours: number;
  minutes: number;
  seconds: number;
}) {
  const { hours, minutes, seconds } = timeObject;
  if (hours === 0 && minutes === 0) {
    return `${seconds} seconds`;
  } else if (hours === 0) {
    return `${minutes} minutes and ${seconds} seconds`;
  } else {
    return `${hours} hours, ${minutes} minutes and ${seconds} seconds`;
  }
}

export function createJobSchedule(timeObject: {
  hours: number;
  minutes: number;
  seconds: number;
}) {
  const { hours, minutes, seconds } = timeObject;
  if (hours === 0 && minutes === 0) {
    return `*/${seconds} * * * * *`;
  } else if (hours === 0) {
    return `*/${minutes} */${seconds} * * * *`;
  } else {
    return `*/${seconds} */${minutes} */${hours} * * *`;
  }
}
