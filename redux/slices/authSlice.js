import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";

// Register
export const register = createAsyncThunk(
  "auth/register",
  async ({ username, email, password, profileImg }, { rejectWithValue }) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", response.user.uid), {
        email,
        username,
        profileImg,
        id: response.user.uid,
      });
      await setDoc(doc(db, "userChats", response.user.uid), {
        chats: [],
      });
      await setDoc(doc(db, "groupChats", response.user.uid), {
        chats: [],
      });

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
      const userId = userCredential.user.uid;
      await AsyncStorage.setItem("userId", userId);
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

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (_, { rejectWithValue }) => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        throw new Error("No user ID found in AsyncStorage");
      }

      await AsyncStorage.removeItem("userId");
      await AsyncStorage.removeItem("userToken");
      await deleteDoc(doc(db, "users", userId));

      const user = auth.currentUser;
      if (user) {
        await user.delete();
      } else {
        throw new Error("No authenticated user found");
      }
    } catch (error) {
      return rejectWithValue(error.message);
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
      });
    builder
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
      });
    builder
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.errorMessage = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      });
    builder
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
      });
    builder.addCase(autoLogin.fulfilled, (state, action) => {
      if (action.payload) {
        state.isAuthenticated = true;
        state.token = action.payload.token;
      }
    });
    builder
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.errorMessage = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      });
  },
});

export default authSlice.reducer;
