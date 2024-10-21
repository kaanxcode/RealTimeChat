import { chatRef, db, storage } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const sendMessageGroup = createAsyncThunk(
  "groupChat/sendMessageGroup",
  async ({ text, activeGroupChatId, participants }, { rejectWithValue }) => {
    try {
      const userId = await AsyncStorage.getItem("userId");

      await updateDoc(doc(db, "chats", activeGroupChatId), {
        messages: arrayUnion({
          senderId: userId,
          text,
          createdAt: new Date(),
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

export const { setGroupChats, setActiveGroupChat } = groupChatSlice.actions;

export default groupChatSlice.reducer;
