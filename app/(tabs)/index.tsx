import {
  StyleSheet,
  FlatList,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Image } from 'expo-image';
import * as React from "react";
import { Text, View } from "../../components/Themed";
import { userPhotos, mediaImages, list, texts, host } from "../../appData";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Heap } from "../Heap";

import VirtualizedScrollView from "../VirtualizedScrollView";
import { Size } from "../../constants/Sizes";

const StoriesThumbnails = () => {
  const { userId } = React.useContext(Heap);
  const [stories, setStories] = React.useState([])

  React.useEffect(() => {
    const getStories = async () => {
      const response = await fetch(`${host}/stories`, {
        method: "GET",
        headers: {
          userId: userId,
          mediaType: "video",
        },

      })
      const responseData = await response.json();
      console.log('responseData', responseData)
      setStories(responseData)
    }
    getStories()
  }, [])

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
                  source={{ uri: `${host}/avatar?userId=${item.id}` }}
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
          <Text style={{ color: "#000" }}>{item.userName}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return !!stories.length ? <ScrollView
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
  </ScrollView> : null
    ;
};

const Feed = () => {
  const { width } = Dimensions.get("window");
  const { push } = useRouter();

  const [events, setEvents] = React.useState([])
  const { userId } = React.useContext(Heap);
  console.log('events', events)
  React.useEffect(() => {
    const getEvents = async () => {
      const response = await fetch(`${host}/events`, {
        method: "GET",
        headers: {
          userId: userId,
        },
      })
      const responseData = await response.json();
      setEvents(responseData)
    }
    getEvents()
  }, [])

  const renderItem = ({ item }: any) => {
    const mediaImage = mediaImages[item.key - 1];
    const text = texts[item.key - 1];
    return (
      <TouchableOpacity onPress={() => push("event")}>
        <View
          style={{
            backgroundColor: "#fff",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              marginBottom: 8
            }}
          >
            <Image
              source={{ uri: `${host}/event-media?eventId=${item._id}` }}
              style={{
                width: 56,
                height: 56,
                borderRadius: 64,
                marginRight: Size,
              }}
            />
            <View style={{ flexGrow: 2, backgroundColor: "#fff" }}>
              <Text style={{ color: "#000", fontSize: 18 }}>{item.name}</Text>
              <Text style={{ color: "#aaaaaa" }}>{item.date}</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="ellipsis-vertical-sharp" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <Image
            // source={mediaImage}
            source={{ uri: `${host}/event-media?eventId=${item._id}` }}
            style={{
              width: width - Size * 4,
              height: 80,
              borderBottomRightRadius: 2,
              borderBottomLeftRadius: 2,
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
    !!events.length ? <ScrollView style={{ marginVertical: Size }}>
      <SafeAreaView>
        <FlatList
          data={events}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{ margin: 4 }} />}
        />
      </SafeAreaView>
    </ScrollView> : null
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
