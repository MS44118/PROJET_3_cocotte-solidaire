import moment from 'moment';

function dayEvents(monthEvents, day) {
  let listData = [];
  for (let i = 0; i < monthEvents.length; i += 1) {
    if (parseInt(moment(monthEvents[i].date_b).format('D'), 10) === day) {
      if (monthEvents[i].placesAvailable <= 0) {
        listData = [...listData,
          { color: '#808080', content: `${monthEvents[i].name_event || monthEvents[i].name_activity}` },
        ];
      } else if (monthEvents[i].id_activity === 1) {
        listData = [...listData,
          { color: '#108ee9', content: `${monthEvents[i].name_event || monthEvents[i].name_activity}` },
        ];
      } else if (monthEvents[i].id_activity === 2) {
        listData = [...listData,
          { color: '#87d068', content: `${monthEvents[i].name_event || monthEvents[i].name_activity}` },
        ];
      } else {
        listData = [...listData,
          { color: '#f50', content: `${monthEvents[i].name_event || monthEvents[i].name_activity}` },
        ];
      }
    }
  }
  return listData;
}

export default dayEvents;
