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
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

import VirtualizedScrollView from "../VirtualizedScrollView";
import { Size } from "../../constants/Sizes";

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
            backgroundColor: "#fff",
            alignItems: "center",
          }}
        >
          <View
            style={{
              padding: item.key !== 1 ? 2 : 3,
              backgroundColor: "#6AB3AC",
              marginVertical: 1,
              marginHorizontal: 4,
              borderRadius: 64,
            }}
          >
            <View
              style={{
                padding: 1,
                backgroundColor: item.key !== 1 ? "#fff" : "#b4d9cf",
                borderRadius: 64,
              }}
            >
              {item.key !== 1 ? (
                <Image
                  source={userPhoto}
                  style={{ width: 56, height: 56, borderRadius: 64 }}
                />
              ) : (
                <AntDesign
                  name="plus"
                  size={30}
                  color="#5FA190"
                  style={{ padding: 12 }}
                />
              )}
            </View>
          </View>
          <Text style={{ color: "#000" }}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      horizontal
      style={{ width, paddingStart: Size, marginVertical: Size / 2 }}
    >
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
            backgroundColor: "#fff",
            marginBottom: Size * 2,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: Size / 2,
            }}
          >
            <Image
              source={userPhotos[0]}
              style={{
                width: 56,
                height: 56,
                borderRadius: 64,
                marginRight: Size,
              }}
            />
            <View style={{ flexGrow: 2, backgroundColor: "#fff" }}>
              <Text style={{ color: "#000", fontSize: 18 }}>Alicia Sierra</Text>
              <Text style={{ color: "#aaaaaa" }}>Bucharest, Romania</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="ellipsis-vertical-sharp" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              color: "#aaaaaa",
              paddingBottom: Size,
              backgroundColor: "#fff",
            }}
          >
            {text}
          </Text>
          <Image
            source={mediaImage}
            style={{
              width: width - Size * 4,
              height: 128,
              borderTopRightRadius: 16,
              borderTopLeftRadius: 16,
            }}
          />
          <View
            style={{
              backgroundColor: "#fff",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: Size,
              marginHorizontal: Size,
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                marginRight: Size * 2,
                alignItems: "center",
              }}
            >
              <Entypo
                name="heart"
                color="#aaa"
                style={{ marginRight: Size / 2 }}
              />
              <Text style={{ color: "#aaa" }}>101 Likes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                flexGrow: 2,
                alignItems: "center",
              }}
            >
              <Entypo
                name="chat"
                color="#aaa"
                style={{ marginRight: Size / 2 }}
              />
              <Text style={{ color: "#aaa" }}>100 Comments</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Entypo
                name="share"
                color="#aaa"
                style={{ marginRight: Size / 2 }}
              />
              <Text style={{ color: "#aaa" }}>35 share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={{ marginVertical: Size }}>
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
        <View
          style={{
            backgroundColor: "#fff",
            marginHorizontal: Size * 2,
          }}
        >
          <Feed />
        </View>
      </VirtualizedScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
