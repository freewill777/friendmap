import { Camera, CameraType } from "expo-camera";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button, StyleSheet, TouchableOpacity, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";

import { Text, View } from "../../components/Themed";

export default function TabTwoScreen() {
  const [type, setType] = useState(CameraType.back);
  const [cameraPermission, requestCameraPermission] =
    Camera.useCameraPermissions();
  const [cameraPhoto, setCameraPhoto] = useState<string | null>(null);
  const [imagePick, setImagePick] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const camera = useRef();

  useEffect(() => {
    setCameraPhoto(null);
    setImagePick(null);
  }, []);

  if (!cameraPermission) {
    return <View />;
  }

  if (!cameraPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestCameraPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  async function takePhoto() {
    if (camera.current) {
      const photo = await (camera.current as any).takePictureAsync();
      setCameraPhoto(photo.uri);
    }
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

  if (cameraPhoto) {
    return (
      <>
        <Image style={{ flexGrow: 1 }} source={{ uri: cameraPhoto }} />
        <Button onPress={() => setCameraPhoto(null)} title="Discard" />
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

  return (
    <View style={styles.container}>
      <Camera
        ref={camera as any}
        style={styles.camera}
        type={type}
        onCameraReady={() => setIsCameraReady(true)}
      >
        {isCameraReady ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePhoto}>
              <Text style={styles.text}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={pickImage}>
              <Text style={styles.text}>Import Photo</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
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
