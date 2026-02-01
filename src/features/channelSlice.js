import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    collection,
    onSnapshot,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    getDocs,
} from "firebase/firestore";
import { db } from "../firebase";

export const listenToChannel = () =>(dispatch)=> {
    dispatch(setLoading(true));
    const q = query(collection(db, "channels"), orderBy("createdAt", "asc"))
    return onSnapshot(q, (snapshot) => {
        console.log("🔥 snapshot fired", snapshot.docs.length);
        const channels = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }))
        dispatch(setChannels(channels))
        dispatch(setLoading(false));
    })
}
export const addChannel = async ({ name, userId }) => {
    try {
        console.log("🔥 Writing channel to Firestore");

        await addDoc(collection(db, "channels"), {
            name,
            createdAt: serverTimestamp(),
            createdBy: userId,
        });

        console.log("✅ Channel written successfully");
    } catch (err) {
        console.error("❌ Firestore write error:", err);
    }
};

export const fetchChannels = createAsyncThunk("channel/fetchChannels", async (_, thunkAPI) => {
    try {
        const querySnapshot = await getDocs(collection(db, "channels"))
        const channels = []
        
        querySnapshot.forEach((doc) => {
            channels.push({
                id: doc.id,
                ...doc.data()
            })
        })
        return channels
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
    
})

const channelSlice = createSlice({
    name: "channels",
    initialState: {
        list: [],
        loading: false,
        error: null,
        activeChannel:null
        
    },
    reducers: {
        setChannels: (state,action) => {
            state.list=action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setActiveChannel: (state,action) => {
            state.activeChannel=action.payload
        }
    },
    extraReducers: (builder)=>{
        builder
            

            // FETCH CHANNELS
            .addCase(fetchChannels.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchChannels.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchChannels.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})
export const { setChannels, setLoading,setActiveChannel } = channelSlice.actions;
export default channelSlice.reducer;