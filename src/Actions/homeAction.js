
export const initEventsAction = events => ({
  type: 'INIT_EVENTS',
  payload: events,
});

export const removeEventAction = id => ({
  type: 'REMOVE_EVENT',
  payload: id,
});


export const initRegistrationsAction = registrations => ({
  type: 'INIT_REGISTRATIONS',
  payload: registrations,
});

export const removeRegistrationAction = id => ({
  type: 'REMOVE_REGISTRATION',
  payload: id,
});
