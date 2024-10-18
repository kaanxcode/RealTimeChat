import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chatId: null, // Şu anda aktif olan sohbetin kimliği
    user: null, // Sohbet edilen kullanıcının bilgileri
    isLoading: false,
    errorMessage: null,
  },
  reducers: {
    setChat: (state, action) => {
      state.chatId = action.payload.chatId;
      state.user = action.payload.user;
    },
    resetChat: (state) => {
      state.chatId = null;
      state.user = null;
    },
  },
});

export const { setChat, resetChat } = chatSlice.actions;
export default chatSlice.reducer;
