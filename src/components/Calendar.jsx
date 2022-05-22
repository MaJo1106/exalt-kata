import { useEffect, useState } from "react";
import moment from "moment";
import HoursList from "../Constants";

// style
import './Calendar.css';
import { setPosition, setSize } from "../utils/methods";

export default function Calendar() {
  const [eventsList, setEventsList] = useState(null);
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    fetchElements();
  }, []);

  useEffect(() => {
    if (eventsList) {
      handleSchedule()
    }
  }, [eventsList])

  const handleSchedule = () => {
    const preSchedule = new Map();
    HoursList.forEach((heure) => {
      let listEvents = [];
      const hourStart = moment(heure.start, "HH:mm");
      const hourEnd = moment(heure.end, "HH:mm");
      eventsList.forEach((event) => {
        const start = moment(event.start, "HH:mm");
        const end = moment(event.end, "HH:mm");
        if (
          (start.isSame(hourStart) || start.isBetween(hourStart, hourEnd) || start.isBefore(hourStart)) &&
          (end.isSame(hourEnd) || end.isBetween(hourStart, hourEnd) || end.isAfter(hourEnd))
        ) {
          listEvents.push(event)
        }
      })
      preSchedule.set(heure.id, listEvents);
    })
    setSchedule(preSchedule);
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
      {schedule && HoursList.map((heure) => (
        <div className="hour-container" key={heure.id}>
          {schedule.get(heure.id).map((event, index) => (
            <div
              className={`event-container ${event.divPosition}`}
              key={index}
              style={{ "height": event.divSize }}
            >
              {event.id}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
