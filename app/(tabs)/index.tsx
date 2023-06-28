import {
  StyleSheet,
  FlatList,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import * as React from "react";
import { Text, View } from "../../components/Themed";
import { userPhotos, mediaImages, list, texts } from "../../appData";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

import VirtualizedScrollView from "../VirtualizedScrollView";

const StoriesThumbnails = () => {
  const stories = list;
  const { width } = Dimensions.get("window");
  const { push } = useRouter();

  const renderItem = ({ item }: any) => {
    const userPhoto = userPhotos[item.key];
    return (
      <TouchableOpacity
        onPress={() => {
          if (item.key === 1) {
            return push("newstory");
          }
          push("story");
        }}
      >
        <View
          style={{
            padding: 4,
            backgroundColor: "#6AB3AC",
            marginVertical: 16,
            marginHorizontal: 4,
            borderRadius: 64,
          }}
        >
          {item.key !== 1 ? (
            <Image
              source={userPhoto}
              style={{ width: 72, height: 72, borderRadius: 64 }}
            />
          ) : (
            <AntDesign
              name="plus"
              size={48}
              color="white"
              style={{ padding: 12 }}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <ScrollView horizontal style={{ width: width - 8 }}>
      <SafeAreaView>
        <FlatList
          data={stories}
          renderItem={renderItem}
          numColumns={list.length}
          ItemSeparatorComponent={() => <View style={{ margin: 4 }} />}
        />
      </SafeAreaView>
    </ScrollView>
  );
};

const Feed = () => {
  const { width } = Dimensions.get("window");
  const { push } = useRouter();

  const feed = list;

  const renderItem = ({ item }: any) => {
    const mediaImage = mediaImages[item.key - 1];
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
          <Image source={mediaImage} style={{ width, height: 128 }} />
          <Text style={{ color: "white", padding: 12 }}>{text}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <ScrollView style={{ marginVertical: 10 }}>
      <SafeAreaView>
        <FlatList
          data={feed}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{ margin: 4 }} />}
        />
      </SafeAreaView>
    </ScrollView>
  );
};

export default function TabOneScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <VirtualizedScrollView>
        <StoriesThumbnails />
        <Feed />
      </VirtualizedScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
