import React, { useState, useContext } from "react";
import { Animated, View, StyleSheet, Text, Dimensions, Pressable } from "react-native";
import { Entypo } from '@expo/vector-icons';
import MovingLine from "./movingline";
import { Heap } from "./Heap";
import { useRouter } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { Image } from 'expo-image';
import { host } from "../appData";
import { ResizeMode, Video } from "expo-av";


const StoryScreen = () => {
  const { width, height } = Dimensions.get("window");
  const route = useRoute();
  const { params } = route;
  const id = params?.id;

  const [storyIndex, setStoryIndex] = useState(0)

  const { back } = useRouter();

  const [mode, setMode] = useState<'img' | 'video'>('img')
  const uri = `${host}/story?userId=${id}&index=${storyIndex}`

  type StepProps = { storyIndex: number, setStoryIndex: React.Dispatch<React.SetStateAction<number>> }

  const Step = ({ storyIndex, setStoryIndex }: StepProps) => {
    const [mode, setMode] = useState<'img' | 'video'>('img')
    const uri = `${host}/story?userId=${id}&index=${storyIndex}`

    if (mode === 'img') return (
      <Image
        cachePolicy='none'
        source={{ uri }}
        style={{
          width: width,
          height: height,
          borderRadius: width / 4.0 / 2.0,
        }}
        onError={() => setMode('video')}
      />
    )
    if (mode === 'video') return (
      <Video
        source={{ uri }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        style={{
          width: width,
          height: height - 300,
          marginTop: 100,
        }}
        onError={() => setMode('img')}
      />
    )
  }

  return (
    <Pressable onPress={() => setStoryIndex(storyIndex + 1)}>
      <View style={styles.container}>
        {/* <MovingLine /> */}
        {/* <Step storyIndex={storyIndex} setStoryIndex={setStoryIndex} />
         */}

        {/* {mode === 'img' && (
        )} */}
        <Image
          cachePolicy='none'
          source={{ uri }}
          style={{
            width: width,
            height: height / 2,
            borderRadius: width / 4.0 / 2.0,
          }}
          onError={() => setMode('video')}
        />
        {/* {mode === 'video' && (
        )} */}

        <Video
          source={{ uri }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          style={{
            width: width,
            height: height / 2,
            marginTop: 100,
          }}
          onError={() => setMode('img')}
        />
      </View>
      <View><Text>{storyIndex}</Text></View>
    </Pressable>
  );
};

export default StoryScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 100
  },
});
