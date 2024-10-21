import { db, storage } from "@/firebaseConfig";
import useImagePicker from "@/hooks/useImagePicker";
import { setActiveGroupChatName } from "@/redux/slices/groupChatSlice";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
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
  const [users, setUsers] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [adminId, setAdminId] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [groupName, setGroupName] = useState(activeGroupChatName);
  const [groupImage, setGroupImage] = useState(activeGroupChatImage);
  const { pickImage } = useImagePicker();

  useEffect(() => {
    const fetchGroupInfo = async () => {
      try {
        const usersRef = collection(db, "users");
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

  const getParticipantUsername = (participantId) => {
    const user = users.find((user) => user.id === participantId);
    return user ? user.username : "Bilinmeyen Kullanıcı";
  };

  const handleUpdateGroupImage = async () => {
    try {
      const imageUri = await pickImage();
      if (!imageUri) {
        console.error("Image picking was canceled.");
        return;
      }

      const response = await fetch(imageUri);
      const blob = await response.blob();
      const storageRef = ref(storage, `Groups/${activeGroupChatId}/image`);
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const docRef = doc(db, "chats", activeGroupChatId);
      await updateDoc(docRef, {
        "groupInfo.groupImage": downloadURL,
      });

      setGroupImage(downloadURL);
      console.log("Grup resmi başarıyla güncellendi:", downloadURL);
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

  const handleAddParticipant = () => {};

  const handleRemoveParticipant = (userId) => {};

  return (
    <View className="flex-1 p-6 bg-white gap-4 justify-center">
      <View className="flex-1 items-center gap-4 justify-start">
        <Image
          source={{ uri: groupImage }}
          className="w-24 h-24 rounded-full"
        />

        {adminId === userData.id && (
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
            <View className="h-16 flex-row items-center justify-between px-4 bg-neutral-100 rounded-2xl">
              <Text className="text-xl font-medium text-zinc-600">
                {activeGroupChatName}
              </Text>
              {adminId === userData.id && (
                <TouchableOpacity onPress={() => setShowInput(true)}>
                  <Feather name="edit-3" size={24} color="gray" />
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
            {adminId === userData.id && (
              <TouchableOpacity onPress={handleAddParticipant}>
                <AntDesign name="pluscircle" size={24} color="white" />
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
                  {adminId === userData.id && (
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
      </View>
    </View>
  );
};

export default GroupInfo;
