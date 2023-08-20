import {
  FlatList,
  TouchableOpacity,
  View,
  Dimensions,
  Text,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { texts } from "../appData";
import { useRouter } from "expo-router";
import VirtualizedScrollView from "./VirtualizedScrollView";
import { useState } from "react";
import { Entypo } from '@expo/vector-icons';
import { fontProps } from "./(tabs)";

const NotificationsScreen = () => {
  const { push } = useRouter();
  const { width, height } = Dimensions.get("window");

  const [items] = useState([]);
  const renderItem = ({ item }: any) => {
    const text = texts[item.key - 1];
    return (
      <TouchableOpacity onPress={() => push("event")}>
        <View
          style={{
            backgroundColor: "#6AB3AC",
            borderRadius: 10,
            width: width - 8,
            overflow: "hidden",
          }}
        >
          <Text style={{ color: "white", padding: 12, ...fontProps }}>{text}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <VirtualizedScrollView>
      <ScrollView style={{ marginVertical: 10 }}>
        <SafeAreaView>
          {!items.length && (
            <View style={{ marginLeft: width / 3, flex: 1, marginTop: height / 3.5 }}>
              <Entypo name="notifications-off" size={124} color="#6AB3AC" />
              <Text style={{ fontSize: 20, ...fontProps, marginLeft: -20 }}>No notifications</Text>
            </View>
          )}
          <FlatList
            data={items}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={{ margin: 4 }} />}
          />
        </SafeAreaView>
      </ScrollView>
    </VirtualizedScrollView>
  );
};

export default NotificationsScreen;
