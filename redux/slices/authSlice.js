import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../../firebaseConfig";

// Register
export const register = createAsyncThunk(
  "auth/register",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      return null;
    } catch (error) {
      return rejectWithValue(error.code);
    }
  }
);

// Login
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const token = userCredential.user.stsTokenManager.accessToken;
      await AsyncStorage.setItem("userToken", token);

      return { token };
    } catch (error) {
      return rejectWithValue(error.code);
    }
  }
);

// Logout
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("userToken");

      return null;
    } catch (error) {
      return rejectWithValue(error.code);
    }
  }
);

// Password Reset
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (email, { rejectWithValue }) => {
    try {
      await sendPasswordResetEmail(auth, email);

      return null;
    } catch (error) {
      return rejectWithValue(error.code);
    }
  }
);

// Auto Login
export const autoLogin = createAsyncThunk(
  "auth/autoLogin",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        return new Promise((resolve, reject) => {
          const unsubscribe = auth.onAuthStateChanged(
            (user) => {
              if (user) {
                resolve({ token });
              } else {
                resolve(null);
              }
              unsubscribe();
            },
            (error) => {
              reject(rejectWithValue(error.code));
            }
          );
        });
      }
      return null;
    } catch (error) {
      return rejectWithValue(error.code);
    }
  }
);

// Auth slice
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: null,
    token: null,
    isLoading: false,
    errorMessage: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isAuthenticated = false;
        state.errorMessage = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.errorMessage = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.errorMessage = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.errorMessage = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      })
      .addCase(autoLogin.fulfilled, (state, action) => {
        if (action.payload) {
          state.isAuthenticated = true;
          state.token = action.payload.token;
        }
      });
  },
});

export default authSlice.reducer;
