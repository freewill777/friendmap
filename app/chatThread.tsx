import {
  FlatList,
  TouchableOpacity,
  View,
  Dimensions,
  Text,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { list, texts } from "../appData";
import { useRouter } from "expo-router";
import VirtualizedScrollView from "./VirtualizedScrollView";
import { fontProps } from "./(tabs)";

const ChatThreadScreen = () => {
  const { push } = useRouter();
  const { width } = Dimensions.get("window");

  const renderItem = ({ item }: any) => {
    const text = texts[item.key - 1];
    return (
      <TouchableOpacity onPress={() => push("chatThread")}>
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

export default ChatThreadScreen;
