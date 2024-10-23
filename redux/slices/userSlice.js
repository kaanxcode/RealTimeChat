import { db } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (_, { rejectWithValue }) => {
    try {
      const userId = await AsyncStorage.getItem("userId");

      if (!userId) {
        throw new Error("Token bulunamadı.");
      }

      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        throw new Error("Böyle bir belge yok!");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const updateUserData = createAsyncThunk(
  "user/updateUserData",
  async ({ username, profileImg, field }, { rejectWithValue }) => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const userRef = doc(db, "users", userId);

      if (field === "username") {
        await updateDoc(userRef, {
          username,
        });
        return { username };
      } else if (field === "profileImg") {
        await updateDoc(userRef, {
          profileImg,
        });
        return { profileImg };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoading: false,
    userData: null,
    errorMessage: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      });

    builder
      .addCase(updateUserData.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload.username) {
          state.userData = {
            ...state.userData,
            username: action.payload.username,
          };
        }

        if (action.payload.profileImg) {
          state.userData = {
            ...state.userData,
            profileImg: action.payload.profileImg,
          };
        }
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      });
  },
});

export default userSlice.reducer;
