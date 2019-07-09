
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
