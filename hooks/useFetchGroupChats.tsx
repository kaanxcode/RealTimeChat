import { db } from "@/firebaseConfig";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";

const useFetchGroupChats = (userId, setGroupChats) => {
  useEffect(() => {
    if (userId) {
      const unsub = onSnapshot(
        doc(db, "groupChats", userId),
        async (docSnapshot) => {
          try {
            if (docSnapshot.exists()) {
              const groupChatData = docSnapshot.data().chats || [];

              const groupChatsWithDetails = await Promise.all(
                groupChatData.map(async (chat) => {
                  try {
                    const chatDoc = await getDoc(doc(db, "chats", chat.chatId));
                    if (chatDoc.exists()) {
                      const chatData = chatDoc.data();

                      return {
                        chatId: chat.chatId,
                        groupImage: chatData.groupInfo.groupImage,
                        groupName: chatData.groupInfo.groupName,
                        lastMessage: chat.lastMessage,
                        senderId: chat.senderId,
                        participants: chatData.participants,
                        updatedAt: chat.updatedAt,
                      };
                    }
                  } catch (error) {
                    console.log("Error fetching chat details:", error);
                  }
                  return null;
                })
              );

              const filteredChats = groupChatsWithDetails
                .filter(Boolean)
                .sort((a, b) => b.updatedAt - a.updatedAt);
              setGroupChats(filteredChats);
            }
          } catch (error) {
            console.log(
              "usefetchgroupchats in error fetching chat data:",
              error
            );
          }
        }
      );

      return () => unsub();
    }
  }, [userId, setGroupChats]);
};

export default useFetchGroupChats;
