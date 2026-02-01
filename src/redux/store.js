import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice.js"
import channelReducer from "../features/channelSlice.js"
import messageReducer from "../features/messageSlice.js"
const store = configureStore({
    reducer: {
        auth: authReducer,
        channel: channelReducer,
        message:messageReducer
        
    }
})
export default store