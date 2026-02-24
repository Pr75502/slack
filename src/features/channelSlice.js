import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  deleteDoc,
  doc,
  getDoc
} from "firebase/firestore";
import { db } from "../firebase";

/*
|--------------------------------------------------------------------------
| ASYNC THUNKS
|--------------------------------------------------------------------------
*/

/**
 * Add New Channel
 */

export const deleteChannel = createAsyncThunk("channel/deleteChannel", async ({ channelId, userId }, thunkAPI) => {
  

  try {
    const channelDoc = await getDoc(doc(db, "channels", channelId));
    if (channelDoc.data().createdBy !== userId) {
      return thunkAPI.rejectWithValue("You are not authorized to delete this channel");
    }
    await deleteDoc(
      doc(db,"channels",channelId)
    )

    
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
})
export const addChannel = createAsyncThunk(
  "channels/addChannel",
  async ({ name, userId }, thunkAPI) => {
    try {
      const docRef = await addDoc(collection(db, "channels"), {
        name,
        createdAt: serverTimestamp(),
        createdBy: userId,
      });

      return {
        id: docRef.id,
        name,
        createdBy: userId,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

/**
 * Realtime Listener
 */
export const listenToChannels = () => (dispatch) => {
  dispatch(setLoading(true));

  const q = query(collection(db, "channels"), orderBy("createdAt", "asc"));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
     const channels = snapshot.docs.map((doc) => {
       const data = doc.data();

       return {
         id: doc.id,
         ...data,
         createdAt: data.createdAt ? data.createdAt.toMillis() : null,
       };
     });

      dispatch(setChannels(channels));
      dispatch(setLoading(false));
    },
    (error) => {
      dispatch(setError(error.message));
      dispatch(setLoading(false));
    },
  );

  return unsubscribe;
};

/*
|--------------------------------------------------------------------------
| SLICE
|--------------------------------------------------------------------------
*/

const channelSlice = createSlice({
  name: "channels",
  initialState: {
    list: [],
    loading: false,
    error: null,
    activeChannel: null,
  },
  reducers: {
    setChannels: (state, action) => {
      state.list = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setActiveChannel: (state, action) => {
      state.activeChannel = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ADD CHANNEL
      .addCase(addChannel.pending, (state) => {
        state.loading = true;
      })
      .addCase(addChannel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(deleteChannel.pending, (state) => {
      state.loading=true
      })
      .addCase(deleteChannel.fulfilled, (state) => {
      state.loading=false
      })
      .addCase(deleteChannel.rejected, (state, action) => {
        state.loading = false
          state.error=action.payload
        
    })
  },
});

export const { setChannels, setLoading, setError, setActiveChannel } =
  channelSlice.actions;

export default channelSlice.reducer;
