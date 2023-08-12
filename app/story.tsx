import React, { useState, useContext } from "react";
import { Animated, View, StyleSheet, Text, Dimensions, Pressable } from "react-native";
import { Entypo } from '@expo/vector-icons';
import MovingLine from "./movingline";
import { Heap } from "./Heap";
import { useRouter } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { Image } from 'expo-image';
import { host } from "../appData";


const StoryScreen = () => {
  const route = useRoute();
  const { params } = route;
  const [storyIndex, setStoryIndex] = useState(0)
  const { back } = useRouter();
  const id = params?.id;
  const { width, height } = Dimensions.get("window");

  const Step = ({ storyIndex }: { storyIndex: number }) => {
    return (
      <Image
        cachePolicy='none'
        source={{ uri: `${host}/story?userId=${id}&index=${storyIndex}` }}
        style={{
          width: width,
          height: height,
          borderRadius: width / 4.0 / 2.0,
        }}
        onError={() => back()}
      />
    )
  }

  return (
    <Pressable onPress={() => setStoryIndex(storyIndex + 1)}>
      <View style={styles.container}>
        {/* <MovingLine /> */}
        <Step storyIndex={storyIndex} />
      </View>
    </Pressable>
  );
};

export default StoryScreen;

const styles = StyleSheet.create({
  container: {

  },
});
