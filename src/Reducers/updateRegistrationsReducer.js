
const updateRegistrationsReducer = (store = [], action) => {
  switch (action.type) {
    case 'UPDATE_REGISTRATIONS': {
      return store;
    }
    default:
      return store;
  }
};

export default updateRegistrationsReducer;
