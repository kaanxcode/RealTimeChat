import { auth, db, storage } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (_, { rejectWithValue }) => {
    try {
      // AsyncStorage'dan token alma
      const userId = await AsyncStorage.getItem("userId");

      if (!userId) {
        throw new Error("Token bulunamadı.");
      }

      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data(); // Kullanıcı verilerini döndür
      } else {
        throw new Error("Böyle bir belge yok!");
      }
    } catch (error) {
      return rejectWithValue(error.message); // Hata varsa yakala
    }
  }
);
// Kullanıcı bilgilerini Firestore'da güncelleme
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

// Profil resmini Firebase Storage'a yükleme ve Firestore'da güncelleme
export const updateProfilePicture = createAsyncThunk(
  "user/updateProfilePicture",
  async ({ userId, imageUri }, { rejectWithValue }) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const storageRef = ref(storage, `Images/${userId}`);

      const snapshot = await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
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
    // fetchUserData durumları
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

    // updateUserData durumları
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

    // updateProfilePicture durumları
    builder
      .addCase(updateProfilePicture.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(updateProfilePicture.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(updateProfilePicture.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      });
  },
});

export default userSlice.reducer;
