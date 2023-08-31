import {
  FlatList,
  TouchableOpacity,
  View,
  Dimensions,
  Text,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Image } from 'expo-image';
import { useRouter } from "expo-router";
import VirtualizedScrollView from "./VirtualizedScrollView";
import { useContext, useEffect, useState } from "react";
import { Entypo } from '@expo/vector-icons';

import { fontProps } from "./(tabs)";
import { Heap } from "./Heap";
import { colors } from "./colors";
import { host } from "../appData";
import { Size } from "../constants/Sizes";
import { User } from "./visitingprofile";
import { fontFamily, spaceyButton } from "./event";

export const randomPhoto = () => Math.random() > 0.5
  ? `https://picsum.photos/200` : `https://picsum.photos/300`

const PendingFriendsScreen = () => {
  const { setSearching, userId } = useContext(Heap);

  useEffect(() => {
    setSearching(undefined)
  }, [])

  const { push } = useRouter();
  const { width, height } = Dimensions.get("window");

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const getData = async () => {
    const response = await fetch(`${host}/user?id=${userId}`);
    if (response.ok) {
      const userData = await response.json();
      setCurrentUser(userData);
    } else {
      console.error("Failed to fetch user data");
    }
  }

  useEffect(() => {
    getData()
  }, []);

  const acceptRequest = async (requesterId: string) => {
    return await fetch(`${host}/accept-request?userId=${userId}&friendId=${requesterId}`, { method: 'POST' })
  }

  const renderItem = ({ item, index }: any) => {
    return (
      <TouchableOpacity
        onPress={() => push({
          params: {},
          pathname: '/chat'
        })}
        key={index}
      >
        <View
          style={{
            backgroundColor: colors.gray,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={{ uri: `${host}/avatar?userId=${item?._id}` }}
              style={{
                width: 56,
                height: 56,
                borderRadius: 64,
                margin: Size,
              }}
            />
            <View style={{ backgroundColor: colors.gray }}>
              <Text style={{ color: "#000", ...fontProps as any }}>{item?.name}</Text>
              <Text style={{ color: "#aaaaaa", fontSize: 11, ...fontProps, lineHeight: 11 }}>{item?.email}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => undefined}
              style={{
                ...spaceyButton,
                borderColor: '#000',
                backgroundColor: false ? '#fff' : "transparent",
                alignSelf: 'center',
              }}
            >
              <Text style={{ color: true ? '#012012' : '#fff', fontFamily }}>{"Reject"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={async () => {
              await acceptRequest(item?._id)
              getData()
            }}
              style={{
                ...spaceyButton,
                borderColor: '#000',
                backgroundColor: false ? '#fff' : "transparent",
                alignSelf: 'center',
              }}
            >
              <Text style={{ color: true ? '#6AB3A0' : '#fff', fontFamily }}>{"Accept"}</Text>
            </TouchableOpacity>
          </View>

        </View>
      </TouchableOpacity >
    );
  };

  const text = "No pending friends"

  return (
    <VirtualizedScrollView>
      <ScrollView style={{ marginVertical: 10 }}>
        <SafeAreaView>
          {!currentUser?.stats.pendingFriends.length && (
            <View style={{ marginLeft: width / 3, marginTop: height / 3.5 }}>
              <Entypo name="notifications-off" size={124} color="#6AB3AC" />
              <Text style={{ marginLeft: -1 * text.length, fontSize: 14, ...fontProps }}>No pending friends</Text>
            </View>
          )}
          <FlatList
            data={currentUser?.stats.pendingFriends || []}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={{ margin: 4 }} />}
          />
        </SafeAreaView>
      </ScrollView>
    </VirtualizedScrollView>
  );
};

export default PendingFriendsScreen;
