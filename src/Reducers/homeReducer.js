
const updateEventsReducer = (store = [], action) => {
  switch (action.type) {
    case 'UPDATE_EVENTS': {
      return [...store, action.payload];
    }
    default:
      return store;
  }
};

export default updateEventsReducer;
