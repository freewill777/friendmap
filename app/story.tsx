import React, { useState, useContext } from "react";
import { TouchableOpacity, View, StyleSheet, Text, Dimensions, Pressable } from "react-native";
import { Entypo } from '@expo/vector-icons';
import MovingLine from "./movingline";
import { Heap } from "./Heap";
import { useRouter } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { Image } from 'expo-image';
import { host } from "../appData";
import { ResizeMode, Video } from "expo-av";
import { MediaElement } from "../components/MediaElement";

const StoryScreen = () => {
  const { width, height } = Dimensions.get("window");
  const route = useRoute();
  const { params } = route;
  const id = params?.id;

  const [storyIndex, setStoryIndex] = useState(0)

  const { back } = useRouter();

  const url = `${host}/story?userId=${id}&index=${storyIndex}`

  return (
    <TouchableOpacity onPress={() => setStoryIndex(storyIndex + 1)}>
      <TouchableOpacity onPress={(event) => setStoryIndex(storyIndex + 1)}>
        <MediaElement
          userId={id}
          elementIndex={storyIndex}
          url={`${host}/story?userId=${id}&index=${storyIndex}`}
          onError={() => back()}
          roundBorder={false}
          style={{
            height: height - 400,
            marginTop: 200
          }}
          shouldPlay={true}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default StoryScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 100
  },
});
