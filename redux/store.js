import { configureStore } from "@reduxjs/toolkit";
import addUsersReducer from "./slices/addUsersSlice";
import authReducer from "./slices/authSlice";
import chatReducer from "./slices/chatSlice";
import userReducer from "./slices/userSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    chat: chatReducer,
    addUsers: addUsersReducer,
  },
});

export default store;
