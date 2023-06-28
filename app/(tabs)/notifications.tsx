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

const NotificationsScreen = () => {
  const { push } = useRouter();
  const { width } = Dimensions.get("window");

  const [items] = useState(list);
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
          <FlatList
            data={list}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={{ margin: 4 }} />}
          />
        </SafeAreaView>
      </ScrollView>
    </VirtualizedScrollView>
  );
};

export default NotificationsScreen;
