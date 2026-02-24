import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
export const listenToMessage = (channelId) => (dispatch) => {
  if (!channelId) return;
  const q = query(
    collection(db, "channels", channelId, "message"),
    orderBy("createdAt", "asc"),
  );
  return onSnapshot(q, (snapshot) => {
   const message = snapshot.docs.map((doc) => {
     const data = doc.data();

     return {
       id: doc.id,
       ...data,
       createdAt: data.createdAt ? data.createdAt.toMillis() : null,
       updatedAt: data.updatedAt ? data.updatedAt.toMillis() : null,
     };
   });

    dispatch(setMessage(message));
  });
};

 export const addMessage = async ({ channelId, text, userId, userEmail,username }) => {
  await addDoc(collection(db, "channels", channelId, "message"), {
    text,
    userId,
    userEmail,
    username,
    createdAt: serverTimestamp(),
  });
};
export const listenToTyping = (channelId) => (dispatch)=>{
  if (!channelId) return 
  const typingRef = collection(db, "channels", channelId, "typing")
  return onSnapshot(typingRef, (snapshot) => {
    const typingUsers = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        ...data,
        createdAt: data.createdAt ? data.createdAt.toMillis() : null
      }
    })
    dispatch(setTypingUsers(typingUsers))
    console.log("🔥 typing snapshot", snapshot.docs.length);
  })
}
export const deleteMessage = createAsyncThunk("message/deleteMessage", async ({ channelId, messageId }, thunkAPI) => {
  try {
    await deleteDoc(
      doc(db, "channels", channelId, "message", messageId)
   ) 
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
  
})


export const editMessage = createAsyncThunk("message/editMessage", async ({channelId,messageId,newText},thunkAPI) => {
  try {
    await updateDoc(
     doc(db,"channels",channelId,"message",messageId),{
        text: newText,
        edited: true,
        updatedAt:serverTimestamp()
     }
   )
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
})
const messageSlice = createSlice({
  name: "message",
  initialState: {
    list: [],
    typingUsers:[],
    error:null
  },
  reducers: {
    setMessage: (state, action) => {
      state.list = action.payload;
    },
    clearMessage: (state) => {
      state.list = [];
    },
    setTypingUsers: (state, action) => {
      state.typingUsers=action.payload
    }
  },
  extraReducers: (builder)=>{
    // builder
    //   .addCase(addMessage.pending, (state) => {
    //     state.loading = true
    //   })
    //   .addCase(addMessage.fulfilled, (state) => {
    //     state.loading = false
    //   })
    //   .addCase(addMessage.rejected, (state, action) => {
    //     state.loading = false,
    //       state.error = action.paylaod
    //   });
     builder
       .addCase(deleteMessage.pending, (state) => {
         state.loading = true;
       })
       .addCase(deleteMessage.fulfilled, (state) => {
         state.loading = false;
       })
       .addCase(deleteMessage.rejected, (state, action) => {
         state.loading = false
          state.error = action.payload;
       });
     builder
       .addCase(editMessage.pending, (state) => {
         state.loading = true;
       })
       .addCase(editMessage.fulfilled, (state) => {
         state.loading = false;
       })
       .addCase(editMessage.rejected, (state, action) => {
         state.loading = false;
         state.error = action.payload;
       });
  }
});

export const { setMessage, clearMessage,setTypingUsers } = messageSlice.actions;
export default messageSlice.reducer;
