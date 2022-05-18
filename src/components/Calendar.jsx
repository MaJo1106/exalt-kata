import { useEffect, useState } from "react";
import moment from "moment";
import HeuresList from "../Constants";

// style
import './Calendar.css';

export default function Calendar() {
  const [eventsList, setEventsList] = useState(null);
  const [horaires, setHoraires] = useState(new Map());

  useEffect(() => {
    fetchElements();
  }, []);

  useEffect(() => {
    if (eventsList) {
    }
  }, [])

  const sortEvents = (list) => {
    const listSorted =  list?.slice().sort((e1, e2) => {
      return Date.parse('06/05/2022 ' + e1.start) - Date.parse('06/05/2022 ' + e2.start)
    });
    return listSorted;
  }

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
    return preHoraires;
  }

  const setSize = (heureStart, heureEnd) => {
    const start = Date.parse('06/05/2022 ' + heureStart);
    const end = Date.parse('06/05/2022 ', heureEnd);
    const diff = end - start;
    console.log(typeof diff);
  }

  handleHoraires()

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
          }
        }))
      })
  }
  return (
    <div className="calendar-container">
      {/* {eventsList && sortEvents(eventsList).map((event) => (
        <>
          {event.idsHours.length === 1 ? (
            <>
              <div key={event.idsHours[0]} className='heures-slice'>
                {event.start}-{event.end}
              </div>
            </>
          ) : (
            <>
              <div key={event.idsHours[0]} className='heures-slice'>
                {event.start}
              </div>
              <div key={event.idsHours[1]} className='heures-slice'>
                {event.end}
              </div>
            </>
          )}
        </>
      ))} */}
    </div>
  )
}
