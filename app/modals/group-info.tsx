import { db, usersRef } from "@/firebaseConfig";
import useImagePicker from "@/hooks/useImagePicker";
import useFileUpload from "@/hooks/useUploadFile";
import { setActiveGroupChatName } from "@/redux/slices/groupChatSlice";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const GroupInfo = () => {
  const dispatch = useDispatch();

  const { activeGroupChatImage, activeGroupChatName, activeGroupChatId } =
    useSelector((state) => state.groupChat);
  const { userData } = useSelector((state) => state.user);
  const { pickImage } = useImagePicker();
  const { uploadFile } = useFileUpload();

  const [groupName, setGroupName] = useState(activeGroupChatName);
  const [groupImage, setGroupImage] = useState(activeGroupChatImage);
  const [users, setUsers] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [adminId, setAdminId] = useState("");

  useEffect(() => {
    const fetchGroupInfo = async () => {
      try {
        const querySnapshot = await getDocs(usersRef);
        const fetchedUsers = [];
        querySnapshot.forEach((doc) => {
          fetchedUsers.push({ id: doc.id, ...doc.data() });
        });
        setUsers(fetchedUsers);

        const docRef = doc(db, "chats", activeGroupChatId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setParticipants(data.participants);
          setAdminId(data.groupInfo.admin);
          setGroupName(data.groupInfo.groupName);
          setGroupImage(data.groupInfo.groupImage);
        }
      } catch (error) {
        console.error("Error fetching group info:", error);
      }
    };

    fetchGroupInfo();
  }, [activeGroupChatId]);

  const handleUpdateGroupImage = async () => {
    try {
      const result = await pickImage({ toast: true });
      if (!result) console.log("Resim seçilmedi.");

      const fileDownloadURL = await uploadFile(result.uri, result.type);

      const docRef = doc(db, "chats", activeGroupChatId);
      await updateDoc(docRef, {
        "groupInfo.groupImage": fileDownloadURL,
      });
      setGroupImage(fileDownloadURL);
      console.log("Grup resmi başarıyla güncellendi:", fileDownloadURL);
    } catch (error) {
      console.error("Grup resmi güncellenirken bir hata oluştu:", error);
    }
  };

  const handleChangeGroupname = async () => {
    if (!groupName || groupName.trim() === "") {
      console.error("Yeni grup adı boş olamaz.");
      return;
    }
    try {
      const docRef = doc(db, "chats", activeGroupChatId);
      await updateDoc(docRef, {
        "groupInfo.groupName": groupName,
      });
      dispatch(setActiveGroupChatName(groupName));

      console.log("Grup adı başarıyla güncellendi:", groupName);
      setShowInput(false);
    } catch (error) {
      console.error("Grup adı güncellenirken bir hata oluştu:", error);
    }
  };

  const handleAddParticipants = async () => {
    if (selectedUserIds?.length === 0) {
      console.error("Lütfen en az bir kullanıcı seçin.");
      return;
    }
    try {
      const newParticipants = Array.from(
        new Set([...participants, ...selectedUserIds])
      );

      const docRef = doc(db, "chats", activeGroupChatId);
      await updateDoc(docRef, {
        participants: newParticipants,
      });

      await Promise.all(
        selectedUserIds.map(async (userId) => {
          const activeGroupRef = doc(db, "groupChats", userId);

          const docSnap = await getDoc(activeGroupRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const chats = data.chats || [];

            const newChatEntry = {
              chatId: activeGroupChatId,
              updatedAt: Date.now(),
            };

            await updateDoc(activeGroupRef, {
              chats: [...chats, newChatEntry],
            });
          } else {
            console.log("Döküman mevcut değil!", userId);
          }
        })
      );

      setParticipants(newParticipants);
      setSelectedUserIds([]);
      setIsModalVisible(false);
      console.log("Kullanıcılar başarıyla gruba eklendi:", selectedUserIds);
    } catch (error) {
      console.error("Kullanıcılar eklenirken bir hata oluştu:", error);
    }
  };

  const handleRemoveParticipant = async (userId) => {
    try {
      const updatedParticipants = participants.filter((id) => id !== userId);

      const activeChatRef = doc(db, "chats", activeGroupChatId);
      await updateDoc(activeChatRef, {
        participants: updatedParticipants,
      });

      const activeGroupRef = doc(db, "groupChats", userId);

      const docSnap = await getDoc(activeGroupRef);
      console.log("Döküman mevcut mu?", docSnap.data());
      if (docSnap.exists()) {
        const data = docSnap.data();
        const chats = data.chats || [];

        const updatedChats = chats.filter(
          (chat) => chat.chatId !== activeGroupChatId
        );

        await updateDoc(activeGroupRef, {
          chats: updatedChats,
        });
        setParticipants(updatedParticipants);

        console.log("Kullanıcı başarıyla gruptan çıkarıldı:", userId);
      } else {
        console.log("Döküman mevcut değil!");
      }
    } catch (error) {
      console.error("Kullanıcı çıkarılırken bir hata oluştu:", error);
    }
  };

  const handleSelectUser = (userId) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  const getParticipantUsername = (participantId) => {
    const user = users?.find((user) => user?.id === participantId);
    return user ? user?.username : "Bilinmeyen Kullanıcı";
  };

  const getNonParticipants = () =>
    users?.filter((user) => !participants.includes(user.id));

  return (
    <View className="flex-1 p-6 bg-white gap-4 justify-center">
      <View className="flex-1 items-center gap-4 justify-start">
        <Image
          source={{ uri: groupImage }}
          className="w-24 h-24 rounded-full"
        />

        {adminId === userData?.id && (
          <TouchableOpacity onPress={handleUpdateGroupImage} className="mt-4">
            <Text className="text-indigo-500 text-md font-medium">
              Grup resmini değiştir
            </Text>
          </TouchableOpacity>
        )}

        <View className=" w-full gap-4 ">
          {showInput ? (
            <View className="h-16 flex-row items-center justify-between px-4 bg-neutral-100 rounded-2xl">
              <TextInput
                placeholder=""
                className="flex-1 text-md font-semibold  text-zinc-900"
                placeholderTextColor={"gray"}
                value={groupName}
                onChangeText={(value) => setGroupName(value)}
              />
              <TouchableOpacity onPress={handleChangeGroupname}>
                <Feather name="send" size={24} color="gray" />
              </TouchableOpacity>
              <TouchableOpacity
                className="ml-4"
                onPress={() => setShowInput(false)}
              >
                <MaterialIcons name="cancel" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ) : (
            <View className="h-16 flex-row items-center justify-between px-4 bg-indigo-500 rounded-2xl ">
              <Text className="text-2xl  font-bold text-white">
                {activeGroupChatName}
              </Text>
              {adminId === userData?.id && (
                <TouchableOpacity onPress={() => setShowInput(true)}>
                  <Feather className="" name="edit-3" size={20} color="white" />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <View className="flex-1 w-full">
          <View className="flex-row items-center justify-between px-4">
            <Text className="text-2xl font-bold text-indigo-500">
              Katılımcılar
            </Text>
            {adminId === userData?.id && (
              <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                <AntDesign name="pluscircle" size={24} color="indigo" />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={participants}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              const username = getParticipantUsername(item);
              return (
                <View className="flex-row justify-between items-center p-4 bg-zinc-100 my-2 rounded-md">
                  <Text className="text-lg font-semibold">{username}</Text>
                  {adminId !== item && (
                    <TouchableOpacity
                      onPress={() => handleRemoveParticipant(item)}
                    >
                      <AntDesign name="deleteuser" size={24} color="red" />
                    </TouchableOpacity>
                  )}
                </View>
              );
            }}
          />
        </View>

        <Modal
          animationType="slide"
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-indigo-500 bg-opacity-50 ">
            <View className="bg-white p-6 rounded-lg w-3/4">
              <Text className="text-xl font-bold mb-4">Gruba Ekle</Text>

              <FlatList
                data={getNonParticipants()}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  const isSelected = selectedUserIds.includes(item.id);
                  return (
                    <TouchableOpacity
                      className={`flex-row justify-between items-center p-4 my-2 rounded-md ${
                        isSelected ? "bg-indigo-500" : "bg-zinc-100"
                      }`}
                      onPress={() => handleSelectUser(item.id)}
                    >
                      <Text
                        className={`text-lg font-semibold ${
                          isSelected ? "text-white" : "text-black"
                        }`}
                      >
                        {item.username}
                      </Text>
                      {isSelected ? (
                        <AntDesign name="checkcircle" size={24} color="white" />
                      ) : (
                        <AntDesign name="pluscircle" size={24} color="indigo" />
                      )}
                    </TouchableOpacity>
                  );
                }}
              />

              <View className="flex-row justify-end mt-4">
                <TouchableOpacity
                  onPress={() => setIsModalVisible(false)}
                  className="mr-4"
                >
                  <Text className="text-red-500">İptal</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAddParticipants}>
                  <Text className="text-indigo-500">Ekle</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default GroupInfo;
