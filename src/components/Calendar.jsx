import { useEffect, useState } from "react";
import moment from "moment";
import HeuresList from "../Constants";

// style
import './Calendar.css';

export default function Calendar() {
  const [eventsList, setEventsList] = useState(null);
  const [horaires, setHoraires] = useState(null);

  useEffect(() => {
    fetchElements();
  }, []);

  useEffect(() => {
    if (eventsList) {
      handleHoraires()
    }
  }, [eventsList])

  const setPosition = (heure) => {
    const value = moment(heure, "HH:mm").get('minutes')
    if (value === 0) {
      return 'up';
    }
    return 'down';
  }

  const handleHoraires = () => {
    const preHoraires = new Map();
    HeuresList.forEach((heure) => {
      let listEvents = [];
      const heureStart = moment(heure.start, "HH:mm");
      const heureEnd = moment(heure.end, "HH:mm");
      eventsList.forEach((event) => {
        const start = moment(event.start, "HH:mm");
        const end = moment(event.end, "HH:mm");
        if (
          (start.isSame(heureStart) || start.isBetween(heureStart, heureEnd) || start.isBefore(heureStart)) &&
          (end.isSame(heureEnd) || end.isBetween(heureStart, heureEnd) || end.isAfter(heureEnd))
        ) {
          listEvents.push(event)
        }
      })
      preHoraires.set(heure.id, listEvents);
    })
    setHoraires(preHoraires);
  }

  const setSize = (heureStart, duration) => {
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

  const fetchElements = () => {
    fetch('./input.json', {
      headers: {
        Accept: 'application/json'
      }
    }).then((res) => res.json())
      .then((data) => {
        setEventsList(data.filter((event) => event.start.split(':')[0] !== '19')
        .map((event) => {
          const eventEnd = moment(event.start, 'HH:mm').add(event.duration, 'minutes').format('HH:mm');

          return {
            ...event,
            end: eventEnd,
            divPosition: setPosition(event.start),
            divSize: setSize(event.start, event.duration),
          }
        }))
      })
  }

  return (
    <div className="calendar-container">
      {horaires && HeuresList.map((heure) => (
        <div className="hour-container" key={heure.id}>
          {horaires.get(heure.id).map((event, index) => (
            <div
              className={`event-container ${event.divPosition}`}
              key={index}
              style={{ "height": event.divSize }}
            >
              {event.duration}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
