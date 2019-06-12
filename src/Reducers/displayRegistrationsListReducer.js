const displayHomeRegistrationsList = (store = { newUser: 'none', knownUser: 'none' }, action) => {
  switch (action.type) {
    case 'DISPLAY_REGISTRATIONS_LIST':
      let newstore = {...store};
      newstore.newUser = action.payload
      return newstore;
    case 'DISPLAY_KNOWN_USER_FORM':
      let newstores = {...store};
      newstores.knownUser = action.payload
      return newstores;
    default:
      return store;
  }
}

export default displayHomeRegistrationsList;