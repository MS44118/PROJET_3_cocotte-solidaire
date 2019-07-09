import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Badge } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import 'moment/locale/fr';
import dayEvents from '../../Utils/calendarUtil';
import 'antd/dist/antd.css';
import './CalendarHome.css';

function CalendarHome({ selectedDate }) {
  const [events, setEvents] = useState([]);
  const [actualMonth, setActualMonth] = useState(moment().format('YYYY-MM'));
  const [monthEvents, setMonthsEvents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/event/calendar')
      .then((data) => {
        const eventsTemp = [...data.data];
        for (let i = 0; i < eventsTemp.length; i += 1) {
          eventsTemp[i].placesAvailable = eventsTemp[i].capacity - eventsTemp[i].nb_persons;
        }
        setEvents(eventsTemp);
      });
  }, []);

  useEffect(() => {
    if (actualMonth.length > 0 && events.length > 0) {
      let eventsTemp = [];
      eventsTemp = events.filter(event => moment(event.date_b).format('YYYY-MM') === actualMonth);
      setMonthsEvents(eventsTemp);
    }
  }, [actualMonth, events.length]);

  const getListData = (value) => {
    let listData;
    switch (parseInt(moment(value).format('D'), 10)) {
      case 1:
        listData = dayEvents(monthEvents, 1);
        break;
      case 2:
        listData = dayEvents(monthEvents, 2);
        break;
      case 3:
        listData = dayEvents(monthEvents, 3);
        break;
      case 4:
        listData = dayEvents(monthEvents, 4);
        break;
      case 5:
        listData = dayEvents(monthEvents, 5);
        break;
      case 6:
        listData = dayEvents(monthEvents, 6);
        break;
      case 7:
        listData = dayEvents(monthEvents, 7);
        break;
      case 8:
        listData = dayEvents(monthEvents, 8);
        break;
      case 9:
        listData = dayEvents(monthEvents, 9);
        break;
      case 10:
        listData = dayEvents(monthEvents, 10);
        break;
      case 11:
        listData = dayEvents(monthEvents, 11);
        break;
      case 12:
        listData = dayEvents(monthEvents, 12);
        break;
      case 13:
        listData = dayEvents(monthEvents, 13);
        break;
      case 14:
        listData = dayEvents(monthEvents, 14);
        break;
      case 15:
        listData = dayEvents(monthEvents, 15);
        break;
      case 16:
        listData = dayEvents(monthEvents, 16);
        break;
      case 17:
        listData = dayEvents(monthEvents, 17);
        break;
      case 18:
        listData = dayEvents(monthEvents, 18);
        break;
      case 19:
        listData = dayEvents(monthEvents, 19);
        break;
      case 20:
        listData = dayEvents(monthEvents, 20);
        break;
      case 21:
        listData = dayEvents(monthEvents, 21);
        break;
      case 22:
        listData = dayEvents(monthEvents, 22);
        break;
      case 23:
        listData = dayEvents(monthEvents, 23);
        break;
      case 24:
        listData = dayEvents(monthEvents, 24);
        break;
      case 25:
        listData = dayEvents(monthEvents, 25);
        break;
      case 26:
        listData = dayEvents(monthEvents, 26);
        break;
      case 27:
        listData = dayEvents(monthEvents, 27);
        break;
      case 28:
        listData = dayEvents(monthEvents, 28);
        break;
      case 29:
        listData = dayEvents(monthEvents, 29);
        break;
      case 30:
        listData = dayEvents(monthEvents, 30);
        break;
      case 31:
        listData = dayEvents(monthEvents, 31);
        break;
      default:
    }
    return listData || [];
  };

  const dateCellRender = (value) => {
    const listData = getListData(value, monthEvents);
    return (
      <ul className="events">
        {listData.map(item => (
          <li key={item.content}>
            <Badge color={item.color} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  useEffect(() => {
    if (monthEvents.length > 0) {
      dateCellRender(monthEvents);
    }
  }, [monthEvents]);

  return (
    <div>
      <Calendar
        dateCellRender={dateCellRender}
        mode="month"
        onChange={date => setActualMonth(moment(date._d).format('YYYY-MM'))}
        onSelect={date => selectedDate(moment(date._d).format('LL'))}
      />
    </div>
  );
}

CalendarHome.propTypes = {
  selectedDate: PropTypes.func,
};

CalendarHome.defaultProps = {
  selectedDate: null,
};

export default CalendarHome;
