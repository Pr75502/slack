import { createSlice } from "@reduxjs/toolkit"
import { createAsyncThunk } from "@reduxjs/toolkit"
import {
    signInWithEmailAndPassword, createUserWithEmailAndPassword,
    signOut,
} from "firebase/auth"
import { auth } from "../firebase"
    
export const loginUser = createAsyncThunk("auth/loginUser", async ({email,password},thunkAPI) => {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        )
        return {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
        }
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
})
export const signUpUser = createAsyncThunk("auth/signUp", async ({ email, password }, thunkAPI) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        )
  
        return {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
        }
    } catch (error) {
       return  thunkAPI.rejectWithValue(error.message)
    }
    
})
export const logoutUser = createAsyncThunk("auth/signOut", async () => {
    await signOut(auth)
})
    


const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading:false,
        user: null,
        error:null
        
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        },
    },
    extraReducers: (builder)=>{
        builder.addCase(loginUser.pending, (state) => {
            state.loading = true,
                state.error = null
        })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false,
                    state.user = action.payload
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload
            })
            .addCase(signUpUser.pending, (state) => {
                    state.loading = true,
                    state.error = null
            })
            .addCase(signUpUser.fulfilled, (state, action) => {
                state.loading = false,
                    state.user = action.payload
            })
            .addCase(signUpUser.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload
            })
        
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
            });
    }

})

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;