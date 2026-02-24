import { createSlice } from "@reduxjs/toolkit"
import { createAsyncThunk } from "@reduxjs/toolkit"
import {
    signInWithEmailAndPassword, createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    signInWithPopup
} from "firebase/auth"
import { auth, googleProvider } from "../firebase"

import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export const loginWithGoogle = createAsyncThunk("auth/loginWithGoogle", async (_, thunkAPI) => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Create/Update user doc in Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            username: user.displayName,
            email: user.email,
            isOnline: true,
            lastSeen: serverTimestamp()
        }, { merge: true });

        return {
            uid: user.uid,
            email: user.email,
            username: user.displayName,
            isOnline: true,
            lastSeen: Date.now()
        }
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
})

    
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
export const signUpUser = createAsyncThunk("auth/signUp", async ({ username,email, password }, thunkAPI) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        )
        await updateProfile(userCredential.user, {
            displayName:username
        })
        await setDoc(doc(db, "users", userCredential.user.uid), {
            uid: userCredential.user.uid,
            username: username,
            email: email,
            isOnline: true,
            lastSeen:serverTimestamp()
            
        })
        return {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            username: username,
            isOnline: true,
            lastSeen: Date.now()
        }
    } catch (error) {
       return  thunkAPI.rejectWithValue(error.message)
    }
    
})
export const logoutUser = createAsyncThunk("auth/signOut", async (_,thunkAPI) => {
    try {
        const { uid } = thunkAPI.getState().auth.user;
        await signOut(auth)
        await setDoc(doc(db, "users",uid), {
            isOnline: false,
            lastSeen: serverTimestamp()
        }, { merge: true });
        return 
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
    
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
            .addCase(loginWithGoogle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginWithGoogle.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loginWithGoogle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
        
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
            });
    }

})

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;