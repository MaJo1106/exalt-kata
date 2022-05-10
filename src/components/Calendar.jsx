import { useEffect, useState } from "react";
import HeuresList from "../Constants";

// style
import './Calendar.css';

export default function Calendar() {
  const [eventsList, setEventsList] = useState([]);

  useEffect(() => {
    fetchElements();
  }, []);

  const sortEvents = (list) => {
    const listSorted =  list?.slice().sort((e1, e2) => {
      return Date.parse('06/05/2022 ' + e1.start) - Date.parse('06/05/2022 ' + e2.start)
    });
    return listSorted;
  }
  const fetchElements = () => {
    fetch('./input.json', {
      headers: {
        Accept: 'application/json'
      }
    }).then((res) => res.json())
      .then((data) => {
        setEventsList(data.filter((event) => event.start.split(':')[0] !== '19').map((event) => {
          let endHour = event.start;
          const isMinutes = parseInt(event.duration) < 60;
          if (isMinutes) {
            const addMinutes = parseInt(event.start.split(':')[1]) + event.duration;
            if (addMinutes === 60) {
              endHour = `${parseInt(event.start.split(':')[0]) + 1}:00`;
            }
            if (addMinutes > 60) {
              const newMinutesAdd = addMinutes - 60;
              endHour = `${parseInt(event.start.split(':')[0]) + 1}:${newMinutesAdd}`
            } 
            if (addMinutes < 60) {
              endHour = `${parseInt(event.start.split(':')[0])}:${addMinutes}`
            }
          }
          if (parseInt(event.duration) === 60) {
            endHour = `${parseInt(event.start.split(':')[0]) + 1}:${parseInt(event.start.split(':')[1])}`
          }
          if (parseInt(event.duration) === 120) {
            endHour = `${parseInt(event.start.split(':')[0]) + 2}:${parseInt(event.start.split(':')[1])}`
          }
          const idStart = HeuresList.find((heure) =>
            heure.start.split(':')[0] === event.start.split(':')[0])?.id;
          const idEnd = event.duration < 60 && event.duration + parseInt(event.start.split(':')[1]) < 60 ? idStart : parseInt(idStart) + 1;
          const ids = idStart === idEnd ? [idStart.toString()] : [idStart.toString(), idEnd.toString()];
          return {
            ...event,
            end: endHour,
            noCompleteHour: isMinutes,
            idsHours: ids,
          }
        }))
      })
  }

  console.log('sort', sortEvents(eventsList));
  return (
    <div className="calendar-container">
      {eventsList && sortEvents(eventsList).map((event) => (
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
      ))}
    </div>
  )
}
