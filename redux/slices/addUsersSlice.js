import { chatRef, userChatsRef, usersRef } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  arrayUnion,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export const fetchUsers = createAsyncThunk(
  "addUsers/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const querySnapshot = await getDocs(usersRef);
      let users = [];

      querySnapshot.forEach((doc) => {
        if (doc.id !== userId) {
          users.push({ id: doc.id, ...doc.data() });
        }
      });

      return users;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addChats = createAsyncThunk(
  "addUsers/addChats",
  async ({ selectedUser }, { rejectWithValue }) => {
    const userId = await AsyncStorage.getItem("userId");

    try {
      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatsRef, selectedUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: userId,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatsRef, userId), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: selectedUser.id,
          updatedAt: Date.now(),
        }),
      });

      return { chatId: newChatRef.id, selectedUser };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const addUsersSlice = createSlice({
  name: "addUsers",
  initialState: {
    users: [],
    isLoading: false,
    errorMessage: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message;
      });

    builder
      .addCase(addChats.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(addChats.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(addChats.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message;
      });
  },
});

export default addUsersSlice.reducer;
