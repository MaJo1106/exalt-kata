import moment from "moment";

export const setSize = (heureStart, duration) => {
    const start = moment(heureStart, "HH:mm").get('minutes');
    if (start === 0 ) {
      if (duration < 60) {
        return (duration * 100) / 60;
      }
      if (duration >= 60) {
        return 100;
      }
    }
    return (start * 100) / 60;
  }

export const setPosition = (heure) => {
    const value = moment(heure, "HH:mm").get('minutes')
    if (value === 0) {
      return 'up';
    }
    return 'down';
  }