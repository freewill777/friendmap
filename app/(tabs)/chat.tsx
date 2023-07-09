import {
  FlatList,
  TouchableOpacity,
  View,
  Dimensions,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
} from "react-native";
import { texts, list, userPhotos } from "../../appData";
import { useRouter } from "expo-router";
import VirtualizedScrollView from "../VirtualizedScrollView";
import { Size } from "../../constants/Sizes";

const ChatScreen = () => {
  const { push } = useRouter();
  const { width } = Dimensions.get("window");

  const renderItem = ({ item }: any) => {
    const text = texts[item.key - 1];
    return (
      <TouchableOpacity onPress={() => push("chatThread")}>
        <View
          style={{
            backgroundColor: "#fff",
            width: width - Size * 4,
            overflow: "hidden",
            flexDirection: "row",
            marginHorizontal: Size,
          }}
        >
          <Image
            source={userPhotos[0]}
            style={{ width: 56, height: 56, borderRadius: 64 }}
          />
          <View
            style={{
              marginLeft: Size,
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",

                width: width - Size * 11,
              }}
            >
              <View>
                <Text style={{ color: "black" }}>Cristi</Text>
              </View>
              <View>
                <Text style={{ color: "black" }}>10:20 am</Text>
              </View>
            </View>
            <Text style={{ color: "#aaa" }} numberOfLines={1}>
              {text}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <VirtualizedScrollView style={{ backgroundColor: "#fff" }}>
      <ScrollView style={{ marginVertical: Size }}>
        <SafeAreaView>
          <FlatList
            data={list}
            renderItem={renderItem}
            ItemSeparatorComponent={() => (
              <View style={{ margin: 4, height: 10 }} />
            )}
          />
        </SafeAreaView>
      </ScrollView>
    </VirtualizedScrollView>
  );
};

export default ChatScreen;
