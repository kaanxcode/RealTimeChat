import { chatRef, db, storage } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  arrayUnion,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const sendMessageGroup = createAsyncThunk(
  "groupChat/sendMessageGroup",
  async (
    { text, activeGroupChatId, participants, fileUrl },
    { rejectWithValue }
  ) => {
    try {
      const userId = await AsyncStorage.getItem("userId");

      await updateDoc(doc(db, "chats", activeGroupChatId), {
        messages: arrayUnion({
          senderId: userId,
          text,
          createdAt: new Date(),
          ...(fileUrl && { fileUrl: fileUrl }),
        }),
      });

      for (const id of participants) {
        const groupChatsRef = doc(db, "groupChats", id);
        const groupChatsSnapshot = await getDoc(groupChatsRef);

        if (groupChatsSnapshot.exists()) {
          const groupChatsData = groupChatsSnapshot.data();

          const chatIndex = groupChatsData.chats.findIndex(
            (c) => c.chatId === activeGroupChatId
          );

          groupChatsData.chats[chatIndex].attachment = fileUrl ? fileUrl : "";
          groupChatsData.chats[chatIndex].lastMessage = text;
          groupChatsData.chats[chatIndex].senderId = userId;
          groupChatsData.chats[chatIndex].isSeen = id === userId ? true : false;
          groupChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(groupChatsRef, {
            chats: groupChatsData.chats,
          });
        }
      }

      return { text };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadGroupImage = createAsyncThunk(
  "groupChat/uploadGroupImage",
  async ({ userId, imageUri }, { rejectWithValue }) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const storageRef = ref(storage, `Groups/${userId}`);

      const snapshot = await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteGroupChat = createAsyncThunk(
  "groupChat/deleteGroupChat",
  async ({ chatId, participants }, { rejectWithValue }) => {
    try {
      const userId = await AsyncStorage.getItem("userId");

      if (!userId) {
        throw new Error("User not found");
      }

      await deleteDoc(doc(db, "chats", chatId));

      await Promise.all(
        participants.map(async (id) => {
          const groupChatsRef = doc(db, "groupChats", id);
          const groupChatsSnapshot = await getDoc(groupChatsRef);

          if (groupChatsSnapshot.exists()) {
            const groupChatsData = groupChatsSnapshot.data();

            const chatIndex = groupChatsData.chats.findIndex(
              (c) => c.chatId === chatId
            );

            if (chatIndex !== -1) {
              groupChatsData.chats.splice(chatIndex, 1);
              await updateDoc(groupChatsRef, {
                chats: groupChatsData.chats,
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

export const addGroupChat = createAsyncThunk(
  "groupChat/addGroupChat",
  async ({ selectedUsers, groupName, groupImage }, { rejectWithValue }) => {
    const userId = await AsyncStorage.getItem("userId");
    try {
      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        groupInfo: {
          groupName,
          groupImage,
          admin: userId,
        },
        createdAt: serverTimestamp(),
        messages: [],
        participants: selectedUsers.map((user) => user.id).concat(userId),
      });

      for (const user of selectedUsers) {
        await updateDoc(doc(db, "groupChats", user.id), {
          chats: arrayUnion({
            chatId: newChatRef.id,
            lastMessage: "",
            updatedAt: Date.now(),
          }),
        });
      }

      await updateDoc(doc(db, "groupChats", userId), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          updatedAt: Date.now(),
        }),
      });

      return { chatId: newChatRef.id, groupName, selectedUsers };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const groupChatSlice = createSlice({
  name: "groupChat",
  initialState: {
    activeGroupChatId: null,
    activeGroupChatImage: null,
    activeGroupChatName: null,
    activeGroupChatParticipants: [],
    groupChats: [],
    isLoading: false,
    errorMessage: null,
  },
  reducers: {
    setGroupChats: (state, action) => {
      state.groupChats = action.payload;
    },
    setActiveGroupChat: (state, action) => {
      state.activeGroupChatId = action.payload.chatId;
      state.activeGroupChatImage = action.payload.groupImage;
      state.activeGroupChatName = action.payload.groupName;
      state.activeGroupChatParticipants = action.payload.participants;
    },
    setActiveGroupChatName: (state, action) => {
      state.activeGroupChatName = action.payload;
    },
    setActiveGroupChatImage: (state, action) => {
      state.activeGroupChatImage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addGroupChat.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(addGroupChat.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(addGroupChat.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      });
    builder
      .addCase(uploadGroupImage.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(uploadGroupImage.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(uploadGroupImage.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      });
    builder
      .addCase(sendMessageGroup.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(sendMessageGroup.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(sendMessageGroup.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      });
  },
});

export const {
  setGroupChats,
  setActiveGroupChat,
  setActiveGroupChatName,
  setActiveGroupChatImage,
} = groupChatSlice.actions;

export default groupChatSlice.reducer;
