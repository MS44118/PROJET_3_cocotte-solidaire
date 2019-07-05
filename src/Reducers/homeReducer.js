const homeReducer = (store = [], action) => {
  switch (action.type) {
    case 'UPDATE_EVENTS': {
      const newstore = { ...store };
      newstore.updateEvents = action.payload;
      return newstore;
    }
    default:
      return store;
  }
};

export default homeReducer;
