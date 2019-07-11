
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
      const idRegistrationToDelete = action.payload.regId;
      const registrations = action.payload.reg;
      const indexRegistrationToDelete = registrations.findIndex(i => i.id_registration === idRegistrationToDelete);
      const registration = action.payload.reg[indexRegistrationToDelete];

      const idEventToUpdate = action.payload.reg[indexRegistrationToDelete].event_id;
      const indexEvent = store.findIndex(i => i.id_event === idEventToUpdate);
      const event = store[indexEvent];

      const eventModified = {
        NB_REG: event.NB_REG - 1,
        id_event: event.id_event,
        name_event: event.name_event,
        date_b: event.date_b,
        date_e: event.date_e,
        nb_adults: event.nb_adults - registration.quantity_adult,
        nb_children: event.nb_children - registration.quantity_children,
        nb_persons: event.nb_persons - (registration.quantity_adult + registration.quantity_children / 2),
        capacity: event.capacity,
        nb_emails: event.nb_emails,
        nb_allergies: event.nb_allergies,
        nb_comment: event.nb_comment,
      };

      console.log(event);
      console.log(eventModified);
      return store;

      // return [
      //   ...store.slice(0, [index]),
      //   eventModified,
      //   ...store.slice([index + 1], store.length),
      // ];
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

// export const updateEventAction = datasForUpdate => ({
//   type: 'UPDATE_EVENT',
//   payload: datasForUpdate,
// });
