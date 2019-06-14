const displayUserFormReducer = (store = { newUser: 'none', knownUser: 'none' }, action) => {
  switch (action.type) {
    case 'DISPLAY_NEW_USER_FORM': {
      const newstore = { ...store };
      newstore.newUser = action.payload;
      return newstore;
    }
    case 'DISPLAY_KNOWN_USER_FORM': {
      const newstores = { ...store };
      newstores.knownUser = action.payload;
      return newstores;
    }
    default:
      return store;
  }
};

export default displayUserFormReducer;
