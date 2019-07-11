
const registrationsReducer = (store = [], action) => {
  switch (action.type) {
    case 'INIT_REGISTRATIONS': {
      return action.payload;
    }
    case 'REMOVE_REGISTRATION': {
      const index = store.findIndex(i => i.id_registration === action.payload);
      return [
        ...store.slice(0, [index]),
        ...store.slice([index + 1], store.length),
      ];
    }
    default:
      return store;
  }
};
export default registrationsReducer;

// const indexRegistrationToDelete = registrations.findIndex(i => i.id_registration === id);
// dispatch(removeRegistrationAction(id));
// const IdEventToUpdate = registrations[indexRegistrationToDelete].event_id;
// dispatch(updateEventAction(
//   { IdEventToUpdate },
// ));


// export const initRegistrationsAction = registrations => ({
//   type: 'INIT_REGISTRATIONS',
//   payload: registrations,
// });

// export const removeRegistrationAction = index => ({
//   type: 'REMOVE_REGISTRATION',
//   payload: index,
// });
