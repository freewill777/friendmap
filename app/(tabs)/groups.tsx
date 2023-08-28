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
import VirtualizedScrollView from "../VirtualizedScrollView";
import { useContext, useEffect, useState } from "react";
import { Entypo } from '@expo/vector-icons';

import { fontProps } from ".";
import { Heap } from "../Heap";
import { colors } from "../colors";
import { texts, list, host } from "../../appData";
import { Size } from "../../constants/Sizes";

export const randomPhoto = () => Math.random() > 0.5
  ? `https://picsum.photos/200` : `https://picsum.photos/300`

const GroupsScreen = () => {
  const { setSearching } = useContext(Heap);

  useEffect(() => {
    setSearching(undefined)
  }, [])

  const { push } = useRouter();
  const { width, height } = Dimensions.get("window");

  const [groups, setGroups] = useState([])

  useEffect(() => {
    (async () => {
      const response = await fetch(`${host}/groups`)
      const data = await response.json();
      setGroups(data)
    })()
  }, []);

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
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Image
            // source={{ uri: `${host}/avatar?userId=${item._id}` }}
            source={{ uri: randomPhoto() }}
            style={{
              width: 56,
              height: 56,
              borderRadius: 64,
              margin: Size,
            }}
          />
          <View style={{ backgroundColor: colors.gray }}>
            <Text style={{ color: "#000", ...fontProps as any }}>{item.name}</Text>
            <Text style={{ color: "#aaaaaa", fontSize: 11, ...fontProps, lineHeight: 11 }}>{item.members} members</Text>
          </View>
        </View>
      </TouchableOpacity >
    );
  };

  return (
    <VirtualizedScrollView>
      <ScrollView style={{ marginVertical: 10 }}>
        <SafeAreaView>
          {!groups.length && (
            <View style={{ marginLeft: width / 3, marginTop: height / 3.5 }}>
              <Entypo name="notifications-off" size={124} color="#6AB3AC" />
              <Text style={{ marginLeft: 2, fontSize: 20, ...fontProps }}>No groups</Text>
            </View>
          )}
          <FlatList
            data={groups}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={{ margin: 4 }} />}
          />
        </SafeAreaView>
      </ScrollView>
    </VirtualizedScrollView>
  );
};

export default GroupsScreen;
