import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import { connect } from 'react-redux';
import { Calendar, Badge } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import 'moment/locale/fr';
import dayEvents from '../../Utils/calendarUtil';
import 'antd/dist/antd.css';
import './CalendarHome.css';

function CalendarHome({
  selectedDate, events, filterCuisiner, filterManger, filterAutres,
}) {
  const [actualMonth, setActualMonth] = useState(moment().format('YYYY-MM'));
  const [monthEvents, setMonthsEvents] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    setFilters({ cuisiner: filterCuisiner, manger: filterManger, autre: filterAutres });
  }, [filterAutres, filterCuisiner, filterManger]);

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
        listData = dayEvents(monthEvents, filters, 1);
        break;
      case 2:
        listData = dayEvents(monthEvents, filters, 2);
        break;
      case 3:
        listData = dayEvents(monthEvents, filters, 3);
        break;
      case 4:
        listData = dayEvents(monthEvents, filters, 4);
        break;
      case 5:
        listData = dayEvents(monthEvents, filters, 5);
        break;
      case 6:
        listData = dayEvents(monthEvents, filters, 6);
        break;
      case 7:
        listData = dayEvents(monthEvents, filters, 7);
        break;
      case 8:
        listData = dayEvents(monthEvents, filters, 8);
        break;
      case 9:
        listData = dayEvents(monthEvents, filters, 9);
        break;
      case 10:
        listData = dayEvents(monthEvents, filters, 10);
        break;
      case 11:
        listData = dayEvents(monthEvents, filters, 11);
        break;
      case 12:
        listData = dayEvents(monthEvents, filters, 12);
        break;
      case 13:
        listData = dayEvents(monthEvents, filters, 13);
        break;
      case 14:
        listData = dayEvents(monthEvents, filters, 14);
        break;
      case 15:
        listData = dayEvents(monthEvents, filters, 15);
        break;
      case 16:
        listData = dayEvents(monthEvents, filters, 16);
        break;
      case 17:
        listData = dayEvents(monthEvents, filters, 17);
        break;
      case 18:
        listData = dayEvents(monthEvents, filters, 18);
        break;
      case 19:
        listData = dayEvents(monthEvents, filters, 19);
        break;
      case 20:
        listData = dayEvents(monthEvents, filters, 20);
        break;
      case 21:
        listData = dayEvents(monthEvents, filters, 21);
        break;
      case 22:
        listData = dayEvents(monthEvents, filters, 22);
        break;
      case 23:
        listData = dayEvents(monthEvents, filters, 23);
        break;
      case 24:
        listData = dayEvents(monthEvents, filters, 24);
        break;
      case 25:
        listData = dayEvents(monthEvents, filters, 25);
        break;
      case 26:
        listData = dayEvents(monthEvents, filters, 26);
        break;
      case 27:
        listData = dayEvents(monthEvents, filters, 27);
        break;
      case 28:
        listData = dayEvents(monthEvents, filters, 28);
        break;
      case 29:
        listData = dayEvents(monthEvents, filters, 29);
        break;
      case 30:
        listData = dayEvents(monthEvents, filters, 30);
        break;
      case 31:
        listData = dayEvents(monthEvents, filters, 31);
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

const mapStateToProps = store => ({
  events: store.events,
});

CalendarHome.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object),
  selectedDate: PropTypes.func,
  filterCuisiner: PropTypes.bool,
  filterManger: PropTypes.bool,
  filterAutres: PropTypes.bool,
};

CalendarHome.defaultProps = {
  events: mapStateToProps.events,
  selectedDate: null,
  filterCuisiner: null,
  filterManger: null,
  filterAutres: null,
};

export default connect(mapStateToProps)(CalendarHome);
