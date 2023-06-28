import { ReactNode, createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Data = {
  user: string | "";
  setUser: React.Dispatch<React.SetStateAction<string>>;
  save?: (value: string) => Promise<"" | undefined>;
  refreshName?: () => Promise<void>;
  logout?: () => Promise<boolean>;
  userId?: string;
  setUserId?: React.Dispatch<React.SetStateAction<string>>;
  saveUserId?: (userId: string) => Promise<void>;
};

const emptyData: Data = {
  user: "",
  setUser: () => undefined,
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

const Heap = createContext<Data>(emptyData);

const HeapProvider = (props: { children: ReactNode }) => {
  const userStorage = new UserStorage();
  const [user, setUser] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

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

  const saveUserId = async (userId: string) => {
    await AsyncStorage.setItem("@userId", userId);
    setUserId(userId);
  };

  const { save, logout } = userStorage;

  const data: Data = {
    user,
    setUser,
    save,
    logout,
    userId,
    setUserId,
    saveUserId,
  };

  return <Heap.Provider value={data}>{props.children}</Heap.Provider>;
};

export { Heap, HeapProvider };
