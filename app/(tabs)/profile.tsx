import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import { Heap } from "../Heap";
import { useContext, useEffect, useState, memo } from "react";
import { useRouter } from "expo-router";
import { host } from "../../appData";
import * as ImagePicker from "expo-image-picker";
import { Video, ResizeMode } from "expo-av";
import { Size } from "../../constants/Sizes";
import { Image } from 'expo-image';

const Profile = () => {
  const {
    user,
    userId,
    profileImage,
    setProfileImage,
    items,
    itemsVideo,
    photosLength,
    refreshData
  } = useContext(Heap);
  const { push } = useRouter();

  const { width, height } = Dimensions.get("window");

  useEffect(() => {
    if (user === null) {
      push("/login");
    }
  }, [user]);

  useEffect(() => {
    refreshData()
  }, []);

  if (user === null) {
    return (
      <View style={styles.containerCenter}>
        <Text style={{ ...styles.title, marginTop: 100, marginBottom: 150 }}>
          Not authenticated
        </Text>
        <TouchableOpacity onPress={() => push("/login")}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => push("/register")}>
          <Text style={styles.link}>Create account</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pickAvatar = async () => {
    let result = (await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })) as any;
    if (!result.canceled) {
      const formData = new FormData();
      setProfileImage(result.assets[0].uri);
      formData.append("files", {
        uri: profileImage ? profileImage : result.assets[0].uri,
        type: "image/jpeg",
        name: "my-image.jpg",
      } as any);
      formData.append("userId", userId as string);
      try {
        await fetch(`${host}/upload_files?avatar=true`, {
          method: "POST",
          headers: {
            userId: userId,
            mediaType: "image",
            isAvatar: "yes",
          },
          body: formData,
        } as any);
      } catch (error) {
        console.error('Avatar issue', error);
      }
    }
  };

  const totalItems = [...items, ...itemsVideo];

  return (
    <View style={{ flex: 1, marginHorizontal: Size }}>
      <View style={styles.container}>
        <TouchableOpacity activeOpacity={0.7} onPress={pickAvatar}>
          <Image
            source={{ uri: `${host}/avatar?userId=${userId}` }}
            style={{
              width: width / 4.0,
              height: width / 4.0,
              borderRadius: width / 4.0 / 2.0,
            }}
          />
        </TouchableOpacity>
        <View style={{ flexDirection: "row" }}>
          <View style={{ marginRight: 5 }}>
            <Text style={styles.statsItemValue}>{totalItems.length || ""}</Text>
            <Text style={styles.statsItemKey}>posts</Text>
          </View>
          <View style={{ marginRight: 5 }}>
            <Text style={styles.statsItemValue}>446</Text>
            <Text style={styles.statsItemKey}>followers</Text>
          </View>
          <View>
            <Text style={styles.statsItemValue}>444</Text>
            <Text style={styles.statsItemKey}>following</Text>
          </View>
        </View>
      </View>
      <View style={{ marginBottom: 8 }}>
        <Text style={styles.description}>{user}</Text>
        <Text style={styles.description}>🤠 💝 💯 🤠</Text>
      </View>
      <View style={styles.MainContainer}>
        <View style={{ flex: 1, flexDirection: "column", margin: 1 }}>
        </View>
        {photosLength && userId ? (
          <FlatList
            data={totalItems}
            renderItem={({ item }) =>
              item.id < photosLength ? (
                <View style={{ flex: 1, flexDirection: "column", margin: 1 }}>
                  <Image
                    style={{
                      width: width / 3.0 - 16,
                      height: height / 5.0,
                      borderRadius: 8,
                      margin: 8,
                    }}
                    source={{
                      uri: `${host}/photo?userId=${userId}&index=${item.id % photosLength
                        }`,
                    }}
                  />
                </View>
              ) : (
                <TouchableOpacity activeOpacity={0.8}>
                  <Video
                    source={{
                      uri: `${host}/video?userId=${userId}&index=${item.id}`,
                    }}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping
                    style={{
                      width: width / 3.0 - 16,
                      height: height / 5.0,
                      borderRadius: 8,
                      margin: 8,
                    }}
                  />
                </TouchableOpacity>
              )
            }
            numColumns={3}
          />
        ) : null}
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "auto",
    justifyContent: "space-between",
    padding: 20,
    flexDirection: "row",
  },
  containerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
  },
  statsItemKey: {
    fontSize: 20,
  },
  statsItemValue: {
    fontSize: 30,
    fontWeight: "bold",
  },
  link: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#6AB3AC",
    padding: 15,
  },
  MainContainer: {
    justifyContent: "center",
    flex: 1,
  },

  imageThumbnail: {
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },

  description: {
    fontSize: 22,
    marginHorizontal: 10,
  },
});
