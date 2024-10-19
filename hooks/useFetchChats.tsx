import { userChatsRef, usersRef } from "@/firebaseConfig";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";

const useFetchChats = (userId, setChats) => {
  useEffect(() => {
    if (userId) {
      const unsub = onSnapshot(
        doc(userChatsRef, userId),
        async (docSnapshot) => {
          try {
            if (docSnapshot.exists()) {
              const chatData = docSnapshot.data().chats || [];

              const chatsWithUserDetails = await Promise.all(
                chatData.map(async (chat) => {
                  try {
                    const userDoc = await getDoc(
                      doc(usersRef, chat.receiverId)
                    );
                    if (userDoc.exists()) {
                      const user = userDoc.data();
                      return { ...chat, user };
                    }
                    return chat;
                  } catch (error) {
                    console.log("Error fetching user details:", error);
                    return chat;
                  }
                })
              );

              const sortedChats = chatsWithUserDetails.sort(
                (a, b) => b.updatedAt - a.updatedAt
              );
              setChats(sortedChats);
            }
          } catch (error) {
            console.log("Error fetching chat data:", error);
          }
        }
      );

      return () => unsub();
    }
  }, [userId, setChats]);
};

export default useFetchChats;
