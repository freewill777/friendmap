import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Button,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import { Video } from "expo-av";
import { Camera, CameraType, CameraRecordingOptions } from "expo-camera";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Entypo } from "@expo/vector-icons";
import { Heap } from "../Heap";
import { host } from "../../appData";

const NewMediaScreen = () => {
  const [showIcon, setShowIcon] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowIcon((showIcon) => !showIcon);
    }, 1000);
    () => clearInterval(interval);
  }, []);

  const [type, setType] = useState(CameraType.back);
  const [cameraPhoto, setCameraPhoto] = useState<string | null>(null);
  const [cameraVideo, setCameraVideo] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [imagePick, setImagePick] = useState<string | null>(null);

  const { userId } = useContext(Heap);

  useEffect(() => {
    (async () => await Camera.requestCameraPermissionsAsync())();
    (async () => await Camera.requestMicrophonePermissionsAsync())();
  }, []);

  const [isRecording, setIsRecording] = useState(false);
  const camera = useRef<CameraType>();
  const video = React.useRef(null);

  const { width, height } = Dimensions.get("window");

  useEffect(() => {
    setCameraPhoto(null);
    setCameraVideo(null);
  }, []);

  const savePhoto = async () => {
    const formData = new FormData();
    formData.append("files", {
      uri: cameraPhoto,
      type: "image/jpeg",
      name: "my-image.jpg",
    });
    formData.append("userId", userId!);

    try {
      const response = await fetch(`${host}/upload_files`, {
        method: "POST",
        headers: {
          userId: userId!,
          mediaType: "image",
        },
        body: formData,
      });
      // const responseData = await response.json();
    } catch (error) {
      console.error('))-', error);
    } finally {
      setCameraPhoto(null);
    }
  };

  const saveVideo = async () => {
    const formData = new FormData();
    formData.append("files", {
      uri: cameraVideo,
      type: "video/quicktime",
      name: "my-video.mov",
    } as any);
    formData.append("userId", userId!);
    try {
      const response = await fetch(`${host}/upload_files`, {
        method: "POST",
        headers: {
          userId: userId,
          mediaType: "video",
        },
        body: formData,
      });
      // const responseData = await response.json();
    } catch (error) {
      alert(error);
    } finally {
      setCameraVideo(null);
    }
  };

  if (cameraPhoto) {
    return (
      <>
        <Image style={{ flexGrow: 1 }} source={{ uri: cameraPhoto }} />
        <Button onPress={savePhoto} title="Post" />
        <Button onPress={() => setCameraPhoto(null)} title="Discard" />
      </>
    );
  }

  if (cameraVideo) {
    return (
      <>
        <Video
          useNativeControls
          style={{ flexGrow: 1 }}
          source={{ uri: cameraVideo }}
          ref={video}
        />
        <Button
          onPress={() => (video.current as any).playAsync()}
          title="Play"
        />
        <Button onPress={() => setCameraVideo(null)} title="Discard" />
        <Button onPress={saveVideo} title="Post" />
      </>
    );
  }

  if (imagePick) {
    return (
      <>
        <Image style={{ flexGrow: 1 }} source={{ uri: imagePick }} />
        <Button onPress={() => setImagePick(null)} title="Discard" />
      </>
    );
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImagePick(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 7, borderRadius: 10 }}>
        <Camera
          ref={camera as any}
          style={styles.camera}
          type={type}
          onCameraReady={() => setIsCameraReady(true)}
        >
          {isCameraReady ? (
            <View style={styles.buttonContainer}>
              {isRecording ? (
                <Entypo
                  name="controller-record"
                  size={24}
                  color={showIcon ? "red" : "transparent"}
                  style={{
                    paddingLeft: width / 3 - 13,
                    position: "absolute",
                    // TODO: should add +20 on ios
                    marginTop: height / 7,
                  }}
                />
              ) : null}

              <TouchableOpacity
                style={styles.button}
                onPress={takePhoto}
                onLongPress={recordVideo}
                onPressOut={() => {
                  if (isRecording) {
                    stopRecording();
                  }
                }}
                delayLongPress={500}
              >
                {isRecording ? (
                  <Ionicons
                    name="recording"
                    size={90}
                    color={"white"}
                    style={{
                      borderRadius: 64,
                      padding: 5,
                    }}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="record-circle-outline"
                    size={90}
                    color={"white"}
                    style={{
                      borderRadius: 64,
                      padding: 5,
                    }}
                  />
                )}
              </TouchableOpacity>
            </View>
          ) : null}
        </Camera>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row-reverse",
          alignContent: "center",
          backgroundColor: "black",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.button}
            onPress={toggleCameraType}
            disabled={isRecording}
          >
            <MaterialIcons
              name="flip-camera-android"
              size={90}
              color={"white"}
              style={{
                borderRadius: 64,
                padding: 5,
              }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <TouchableOpacity onPress={pickImage}>
            <Text style={{ color: "white" }}>Import Photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  async function takePhoto() {
    if (camera.current) {
      const photo = await (camera.current as any).takePictureAsync({
        quality: 0,
      });
      setCameraPhoto(photo.uri);
    }
  }

  async function recordVideo() {
    setIsRecording(true);
    const options: CameraRecordingOptions = {
      quality: "480p",
      maxDuration: 10,
      mute: false,
    };

    if (camera.current) {
      const video = await (camera.current as any)
        .recordAsync(options)
        .then(async (video: any) => {
          setCameraVideo(video.uri);
          setIsRecording(false);
        })
        .catch((e: typeof Error) => {
          alert(e);
        });
      setCameraVideo(video.uri);
    }
  }

  function stopRecording() {
    setIsRecording(false);
    (camera.current as any).stopRecording();
  }
};

export default NewMediaScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
