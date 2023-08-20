import {
  FlatList,
  TouchableOpacity,
  View,
  Dimensions,
  Text,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { texts, list } from "../../appData";
import { useRouter } from "expo-router";
import VirtualizedScrollView from "../VirtualizedScrollView";
import { useState } from "react";
import { Entypo } from '@expo/vector-icons';
import { fontProps } from ".";

const GroupsScreen = () => {
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
          <Text style={{ color: "white", padding: 12 }}>{text}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <VirtualizedScrollView>
      <ScrollView style={{ marginVertical: 10 }}>
        <SafeAreaView>
          {!items.length && (
            <View style={{ marginLeft: width / 3, marginTop: height / 3.5 }}>
              <Entypo name="notifications-off" size={124} color="#6AB3AC" />
              <Text style={{ marginLeft: 2, fontSize: 20, ...fontProps }}>No groups</Text>
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

export default GroupsScreen;
