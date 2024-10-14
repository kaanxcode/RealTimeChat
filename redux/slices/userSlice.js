import { db, storage } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { doc, getDoc, updateDoc } from "firebase/firestore";

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
export const updateUsername = createAsyncThunk(
  "user/updateUserData",
  async ({ username }, { rejectWithValue }) => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        username,
      });

      return username;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Profil resmini Firebase Storage'a yükleme ve Firestore'da güncelleme
export const updateProfilePicture = createAsyncThunk(
  "user/updateProfilePicture",
  async ({ userId, imageFile }, { rejectWithValue }) => {
    try {
      // Storage'a yükleme işlemi
      const storageRef = ref(storage, `profile_pictures/${userId}`);
      await uploadBytes(storageRef, imageFile);

      // Yüklenen resmin URL'ini al
      const downloadURL = await getDownloadURL(storageRef);

      // Firestore'da profil resmi URL'ini güncelle
      await firestore.collection("users").doc(userId).update({
        profilePicture: downloadURL,
      });

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
      .addCase(updateUsername.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(updateUsername.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = { ...state.userData, username: action.payload };
      })
      .addCase(updateUsername.rejected, (state, action) => {
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
        if (state.userData) {
          state.userData.profilePicture = action.payload; // Profil resmi URL'ini güncelle
        }
      })
      .addCase(updateProfilePicture.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      });
  },
});

export default userSlice.reducer;
