
const eventsReducer = (store = [], action) => {
  switch (action.type) {
    case 'INIT_EVENTS': {
      return action.payload;
    }
    case 'REMOVE_EVENT': {
      const index = store.findIndex(i => i.id_event === action.payload);
      return [
        ...store.slice(0, [index]),
        ...store.slice([index + 1], store.length),
      ];
    }
    case 'UPDATE_EVENT': {
      const registration = store.registrations[action.payload.registration];
      const index = store.findIndex(i => i.id_event === action.payload.id);
      console.log(action.payload.registration);
      console.log(action.payload.id);
      // break;
      const eventModified = {      
        NB_REG: store[index].NB_REG - registration.NB_REG,
        id_event: store[index].id_event,
        name_event: store[index].name_event,
        date_b: store[index].date_b,
        date_e: store[index].date_e,
        nb_adults: store[index].nb_adults - 1,
        nb_children: store[index].nb_children,
        nb_persons: store[index].nb_persons,
        capacity: store[index].capacity,
        nb_emails: store[index].nb_emails,
        nb_allergies: store[index].nb_allergies,
        nb_comment: store[index].nb_comment,
      };
      return [
        ...store.slice(0, [index]),
        eventModified,
        ...store.slice([index + 1], store.length),
      ];
    }

    default:
      return store;
  }
};

export default eventsReducer;

// export const initEventsAction = events => ({
//   type: 'INIT_EVENTS',
//   payload: events,
// });

// export const removeEventAction = index => ({
//   type: 'REMOVE_EVENT',
//   payload: index,
// });
