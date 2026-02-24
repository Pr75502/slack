import { createSlice } from "@reduxjs/toolkit";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";


export const listenToUsers = ()=>(dispatch) => {
    const q = collection(db, "users")  
    return onSnapshot(q, (snapshot) => {
        const users = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                lastSeen: data.lastSeen?.toMillis() || null
            };
        });
        dispatch(setUser(users));
    });
}

const userSlice = createSlice({
    name: "user",
    initialState: {
        list:[]
    },
    reducers: {
        setUser: (state,action) => {
            state.list=action.payload
        }
    }
})

export default userSlice.reducer
export const {setUser}=userSlice.actions