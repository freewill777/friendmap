import { ReactNode, createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { host } from "../appData";

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
  searching: "users" | "events" | "groups" | "messages" | undefined
  setSearching: any;
  items: any;
  itemsVideo: any;
  photosLength: any;
  videosLength: any;
  refreshData: () => void;
  searchText: string | undefined,
  setSearchText: (text: string) => void;
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
  const [user, setUser] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [photosLength, setPhotosLength] = useState<string | null>(null);
  const [videosLength, setVideosLength] = useState<string | null>(null);
  const [searching, setSearching] = useState(undefined)
  const [searchText, setSearchText] = useState<string | undefined>(undefined)

  const getPhotos = async () => {
    try {
      const response = await fetch(`${host}/photos-length?userId=${userId}`);
      const json = await response.json();
      setPhotosLength(json);
    } catch (error) {
      console.error('))*', error);
    }
  }

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
      getPhotos()
    }
  }, [userId]);

  useEffect(() => {
    async function getUserData() {
      try {
        const response = await fetch(`${host}/videos-length?userId=${userId}`);
        const json = await response.json();
        setVideosLength(json);
      } catch (error) {
      }
    }
    if (userId !== "") {
      getUserData();
    }
  }, [userId]);

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
    getPhotos()
  }

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
    setSearchText
  };

  return <Heap.Provider value={data}>{props.children}</Heap.Provider>;
};

export { Heap, HeapProvider };
