import { createSlice } from "@reduxjs/toolkit";
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
export const listenToMessage = (channelId)=>(dispatch) => {
    if (!channelId) return;
    const q = query(
        collection(db, "channels", channelId, "message"),
        orderBy("createdAt","asc")
    )
    return onSnapshot(q, (snapshot) => {
        const message = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
        dispatch(setMessage(message))

    })
}

export const addMessage = async({channelId,text,userId,userEmail
})=> {
    await addDoc(collection(db, "channels", channelId, "message"), {
        text, userId, userEmail,
        createdAt:serverTimestamp()
})
}
const messageSlice = createSlice({
    name: "message",
    initialState: {
        list:[]
    },
    reducers: {
        setMessage: (state,action) => {
            state.list=action.payload
        },
        clearMessage: (state) => {
            state.list=[]
        }
    }
})

export const { setMessage, clearMessage } = messageSlice.actions;
export default messageSlice.reducer;