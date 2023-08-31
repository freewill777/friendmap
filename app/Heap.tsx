import { ReactNode, createContext, useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { host } from "../appData";
import { TouchableOpacity, View, Text } from "react-native";
import { colors } from "./colors";
import { fontProps } from "./(tabs)";
import { useRouter, useNavigation } from "expo-router";
import { Image } from "expo-image";
import { Size } from "../constants/Sizes";

export type Data = {
  user: string | "";
  setUser: React.Dispatch<React.SetStateAction<string>>;
  save?: (value: string) => Promise<"" | undefined>;
  refreshName?: () => Promise<void>;
  logout?: () => Promise<boolean>;
  userId?: string;
  setUserId?: React.Dispatch<React.SetStateAction<string>>;
  saveUserId?: (userId: string) => Promise<void>;
  profileImage?: string | null;
  setProfileImage: React.Dispatch<React.SetStateAction<string | null>>;
  setPhotosLength: React.Dispatch<React.SetStateAction<string | null>>;
  setVideosLength: React.Dispatch<React.SetStateAction<string | null>>;
  searching: "users" | "events" | "groups" | "messages" | undefined;
  setSearching: any;
  items: any;
  itemsVideo: any;
  photosLength: any;
  videosLength: any;
  refreshData: () => void;
  searchText: string | undefined;
  setSearchText: (text: string) => void;
  renderChip: ({ item, index }: any) => JSX.Element;
  renderItemUser: ({ item, index }: any) => JSX.Element;
  renderItemEvent: ({ item, index }: any) => JSX.Element;
};

class UserStorage {
  getName = async () => {
    try {
      return await AsyncStorage.getItem("@name");
    } catch (e) {
      return "";
    }
  };
  save = async (value: string) => {
    try {
      await AsyncStorage.setItem("@name", value);
    } catch (e) {
      return "";
    }
  };
  logout = async () => {
    try {
      await AsyncStorage.setItem("@name", "");
      return true;
    } catch (e) {
      return false;
    }
  };
}

const Heap = createContext<Data>({} as Data);

const HeapProvider = (props: { children: ReactNode }) => {
  const userStorage = new UserStorage();
  const { push } = useRouter();
  const navigation = useNavigation();

  const [user, setUser] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [photosLength, setPhotosLength] = useState<string | null>(null);
  const [videosLength, setVideosLength] = useState<string | null>(null);
  const [searching, setSearching] = useState(undefined);
  const [searchText, setSearchText] = useState<string | undefined>(undefined);

  useEffect(() => {
    (async () => {
      userStorage.getName().then((username) => setUser(username!));
    })();
  }, [user]);

  useEffect(() => {
    (async () => {
      AsyncStorage.getItem("@userId").then((userId) => setUserId(userId!));
    })();
  }, [user]);

  useEffect(() => {
    if (userId) {
      (async () => {
        try {
          const response = await fetch(
            `${host}/photos-length?userId=${userId}`
          );
          const json = await response.json();
          setPhotosLength(json);
        } catch (error) {
          console.error("))*", error);
        }
      })();
    }
  }, [userId]);

  useEffect(() => {
    async function getUserData() {
      try {
        const response = await fetch(`${host}/videos-length?userId=${userId}`);
        const json = await response.json();
        setVideosLength(json);
      } catch (error) { }
    }
    if (userId !== "") {
      getUserData();
    }
  }, [userId]);

  const getPhotos = async () => {
    try {
      const response = await fetch(`${host}/photos-length?userId=${userId}`);
      const json = await response.json();
      setPhotosLength(json);
    } catch (error) {
      console.error("))*", error);
    }
  };

  const saveUserId = async (userId: string) => {
    await AsyncStorage.setItem("@userId", userId);
    setUserId(userId);
  };

  const items = Array.apply(null, Array(photosLength)).map((v, i) => {
    return { id: i, src: "http://placehold.it/200x200?text=" + (i + 1) };
  });

  const itemsVideo = Array.apply(null, Array(videosLength)).map((v, i) => {
    return { id: i, src: "http://placehold.it/200x200?text=" + (i + 1) };
  });

  const { save, logout } = userStorage;

  const refreshData = () => {
    getPhotos();
  };

  const renderChip = useCallback(({ item, index }: any) => {
    return (
      <TouchableOpacity onPress={() => setSearching(item.name)} key={index}>
        <View
          style={{
            backgroundColor: colors.gray,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            marginRight: 8,
          }}
        >
          <View
            style={{
              backgroundColor:
                searching === item.name ? colors.darkergray : colors.darkgray,
              borderRadius: 30,
              padding: 10,
            }}
          >
            <Text style={{ color: colors.white, fontSize: 12, ...fontProps }}>
              {item.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, []);

  const renderItemUser = useCallback(({ item, index }: any) => {
    return (
      <TouchableOpacity
        onPress={() =>
          push({
            params: { profileId: item._id },
            pathname: "/visitingprofile",
          })
        }
        key={index}
      >
        <View
          style={{
            backgroundColor: colors.gray,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Image
            source={{ uri: `${host}/avatar?userId=${item._id}` }}
            style={{
              width: 56,
              height: 56,
              borderRadius: 64,
              margin: Size,
            }}
          />
          <View style={{ backgroundColor: colors.gray }}>
            <Text style={{ color: "#000", ...(fontProps as any) }}>
              {item.name}
            </Text>
            <Text
              style={{
                color: "#aaaaaa",
                fontSize: 11,
                ...fontProps,
                lineHeight: 11,
              }}
            >
              {item.email}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, []);

  const renderItemEvent = useCallback(({ item, index }: any) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("event", { id: item._id })}
        key={index}
      >
        <View
          style={{
            backgroundColor: colors.gray,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Image
            source={{ uri: `${host}/event-media?eventId=${item._id}` }}
            style={{
              width: 56,
              height: 56,
              borderRadius: 64,
              margin: Size,
            }}
          />
          <View style={{ backgroundColor: colors.gray }}>
            <Text style={{ color: "#000", ...(fontProps as any) }}>
              {item.name}
            </Text>
            <Text
              style={{
                color: "#aaaaaa",
                fontSize: 11,
                ...fontProps,
                lineHeight: 11,
              }}
            >
              {item.date}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, []);

  const data: Data = {
    user,
    setUser,
    save,
    logout,
    userId,
    setUserId,
    saveUserId,
    profileImage,
    setProfileImage,
    items,
    itemsVideo,
    setVideosLength,
    setPhotosLength,
    photosLength,
    videosLength,
    refreshData,
    searching,
    setSearching,
    searchText,
    setSearchText,
    renderChip,
    renderItemUser,
    renderItemEvent,
  };

  return <Heap.Provider value={data}>{props.children}</Heap.Provider>;
};

export { Heap, HeapProvider };
