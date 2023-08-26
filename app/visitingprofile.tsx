import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ScrollView,
} from "react-native";
import { Text as DefaultText } from "../components/Text";
import { Heap } from "./Heap";
import { useContext, useEffect, useState, memo } from "react";
import { useRouter, usePathname, useSegments, useSearchParams } from "expo-router";
import { host } from "../appData";
import * as ImagePicker from "expo-image-picker";
import { Video, ResizeMode } from "expo-av";
import { Size } from "../constants/Sizes";
import { Image } from 'expo-image';
import { fontProps } from "./(tabs)";
import { MediaElement } from "../components/MediaElement";

export interface User {
  _id: string;
  name: string;
  email: string;
  stats: {
    description1: string;
    description2: string;
  }
}

const VisitingProfile = () => {
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

  const { profileId } = useSearchParams();

  console.log({ profileId })
  const { width, height } = Dimensions.get("window");

  const Text = (props: any) => {
    const { style, ...otherProps } = props;
    return <DefaultText style={[{ color: '#000' }]} {...otherProps} />
  }

  useEffect(() => {
    refreshData()
  }, []);

  if (user === null) {
    return (
      <View style={styles.containerCenter}>
        {/* <Text style={{ ...styles.title, marginTop: 100, marginBottom: 150 }}>
          Not authenticated
        </Text> */}
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

  const [visitingUser, setVisitingUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${host}/user?id=${profileId}`);
        if (response.ok) {
          const userData = await response.json();
          setVisitingUser(userData);
        } else {
          console.log("Failed to fetch user data");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  console.log('visitingUser', visitingUser)
  const visitingEmail = visitingUser !== null ? visitingUser.email : ""
  const visitingName = visitingUser !== null ? visitingUser.name : ""
  const visitingDescription1 = visitingUser !== null ? visitingUser.stats.description1 : ""
  const visitingDescription2 = visitingUser !== null ? visitingUser.stats.description2 : ""
  return (
    <View style={{ flex: 1, marginHorizontal: Size }}>
      <View style={styles.container}>
        <TouchableOpacity activeOpacity={0.7} onPress={pickAvatar}>
          <Image
            source={{ uri: `${host}/avatar?userId=${profileId}` }}
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
        <Text style={styles.description}>{visitingDescription1}{visitingDescription2}</Text>
        <Text style={styles.description}></Text>
        <Text style={styles.description}>{profileId && visitingName}</Text>
        <Text style={styles.description}>{profileId ? visitingEmail : user}</Text>
      </View>
      <View style={styles.MainContainer}>
        {typeof profileId === 'string' && < ScrollView >
          <MediaElement userId={profileId} elementIndex={0} />
          <MediaElement userId={profileId} elementIndex={1} />
          <MediaElement userId={profileId} elementIndex={2} />
          <MediaElement userId={profileId} elementIndex={3} />
          <MediaElement userId={profileId} elementIndex={4} />
          <MediaElement userId={profileId} elementIndex={5} />
          <MediaElement userId={profileId} elementIndex={6} />
          <MediaElement userId={profileId} elementIndex={7} />
          <MediaElement userId={profileId} elementIndex={8} />
          <MediaElement userId={profileId} elementIndex={9} />
          <MediaElement userId={profileId} elementIndex={10} />
          <MediaElement userId={profileId} elementIndex={11} />
          <MediaElement userId={profileId} elementIndex={12} />
          <MediaElement userId={profileId} elementIndex={13} />
          <MediaElement userId={profileId} elementIndex={14} />
          <MediaElement userId={profileId} elementIndex={15} />
        </ScrollView>}
      </View>
    </View >
  );
};

export default VisitingProfile;

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
    ...fontProps
  },
  statsItemValue: {
    fontSize: 30,
    fontWeight: "bold",
    ...fontProps
  },
  link: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#6AB3AC",
    padding: 15,
    ...fontProps
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
    ...fontProps
  },
});
