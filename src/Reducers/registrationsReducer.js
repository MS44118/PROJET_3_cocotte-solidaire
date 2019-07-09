
const registrationsReducer = (store = [], action) => {
  switch (action.type) {
    case 'INIT_REGISTRATIONS': {
      return action.payload;
    }
    case 'REMOVE_REGISTRATION': {
      return store[action.payload];
    }
    default:
      return store;
  }
};
export default registrationsReducer;


// export const initRegistrationsAction = registrations => ({
//   type: 'INIT_REGISTRATIONS',
//   payload: registrations,
// });

// export const removeRegistrationAction = index => ({
//   type: 'REMOVE_REGISTRATION',
//   payload: index,
// });
