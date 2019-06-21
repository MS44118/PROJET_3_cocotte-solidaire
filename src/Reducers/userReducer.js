const userReducer = (store = { updateUser: [], newUser: [] }, action) => {
    switch (action.type) {
      case 'UPDATE_USER': {
        const newstore = { ...store };
        newstore.updateUser = action.payload;
        return newstore;
      }
      case 'NEW_USER': {
        const newstores = { ...store };
        newstores.newUser = action.payload;
        return newstores;
      }
      default:
        return store;
    }
   };
   
   export default userReducer;