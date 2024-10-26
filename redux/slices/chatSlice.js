import { db } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  arrayUnion,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (
    { text, activeChatId, activeChatUser, fileUrl },
    { rejectWithValue }
  ) => {
    try {
      const userId = await AsyncStorage.getItem("userId");

      await updateDoc(doc(db, "chats", activeChatId), {
        messages: arrayUnion({
          senderId: userId,
          text,
          createdAt: new Date(),
          ...(fileUrl && { fileUrl: fileUrl }),
        }),
      });

      const userIDs = [userId, activeChatUser.id];

      for (const id of userIDs) {
        const userChatsRef = doc(db, "userChats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === activeChatId
          );

          userChatsData.chats[chatIndex].attachment = fileUrl ? fileUrl : "";
          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].senderId = userId;
          userChatsData.chats[chatIndex].isSeen = id === userId ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      }

      return { text };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Chat delete
export const deleteChat = createAsyncThunk(
  "chat/deleteChat",
  async ({ chatId, activeUser }, { rejectWithValue }) => {
    try {
      const userId = await AsyncStorage.getItem("userId");

      if (!userId) {
        throw new Error("User not found");
      }

      await deleteDoc(doc(db, "chats", chatId));

      const userIDs = [userId, activeUser];

      await Promise.all(
        userIDs.map(async (id) => {
          const userChatsRef = doc(db, "userChats", id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if (userChatsSnapshot.exists()) {
            const userChatsData = userChatsSnapshot.data();

            const chatIndex = userChatsData.chats.findIndex(
              (c) => c.chatId === chatId
            );

            if (chatIndex !== -1) {
              userChatsData.chats.splice(chatIndex, 1);
              await updateDoc(userChatsRef, {
                chats: userChatsData.chats,
              });
            }
          }
        })
      );

      return { success: true };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    activeChatId: null,
    activeChatUser: null,
    chats: [],
    isLoading: false,
    errorMessage: null,
  },
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChatId = action.payload.chatId;
      state.activeChatUser = action.payload.user;
    },
    resetActiveChat: (state) => {
      state.activeChatId = null;
      state.activeChatUser = null;
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      });
    builder
      .addCase(deleteChat.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = null;
      })
      .addCase(deleteChat.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      });
  },
});

export const { setActiveChat, resetActiveChat, setChats } = chatSlice.actions;

export default chatSlice.reducer;
