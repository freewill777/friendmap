import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  VirtualizedList,
  ScrollView,
} from "react-native";
import { Heap } from "../Heap";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { host } from "../../appData";
import * as ImagePicker from "expo-image-picker";
import { Video, ResizeMode } from "expo-av";
import { Size } from "../../constants/Sizes";
import { Image } from 'expo-image';
import { User } from "../visitingprofile";
import { fontProps } from ".";

type MediaElementProps = { storyIndex: number, setStoryIndex?: React.Dispatch<React.SetStateAction<number>>, userId: string }

const MediaElement = ({ storyIndex, userId: id }: MediaElementProps) => {
  const { width, height } = Dimensions.get("window");
  const [mode, setMode] = useState<'img' | 'video'>('img')
  const [loading, setLoading] = useState(true);
  const uri = `${host}/media?userId=${id}&index=${storyIndex}`

  useEffect(() => {
    fetch(uri)
      .then(response => {
        if (response.headers.get('content-type')?.startsWith('image/')) {
          setMode('img');
          setLoading(false)
        } else if (response.headers.get('content-type')?.startsWith('video/')) {
          setMode('video');
          setLoading(false)
        }
      })
      .catch(error => {
        console.error('Error fetching resource:', error);
      });
  }, [uri]);

  if (!loading) {
    if (mode === 'img') return (
      <Image
        cachePolicy='none'
        source={{ uri }}
        style={{
          width: width,
          height: height / 4,
          marginTop: 10,
          borderTopLeftRadius: 20,
          borderBottomLeftRadius: 20,
          borderTopRightRadius: width / 10,
          borderBottomRightRadius: width / 10
        }}
        key={storyIndex + 'image'}
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
          height: height / 4,
          marginTop: 10,
          borderTopLeftRadius: 20,
          borderBottomLeftRadius: 20,
          borderTopRightRadius: width / 10,
          borderBottomRightRadius: width / 10

        }}
        key={storyIndex + 'video'}
      />
    )
  } else {
    return <></>
  }
}

const Profile = () => {
  const {
    user,
    userId,
    profileImage,
    setProfileImage,
    items,
    itemsVideo,
    photosLength,
    videosLength,
    refreshData
  } = useContext(Heap);

  const { push } = useRouter();

  const { width, height } = Dimensions.get("window");

  useEffect(() => {
    refreshData()
  }, []);

  useEffect(() => {
    if (user === null) {
      push("/login");
    }
  }, [user]);



  if (user === null) {
    return (
      <View style={styles.containerCenter}>
        <Text style={{ ...styles.title, marginTop: 100, ...fontProps }}>
          Not authenticated
        </Text>
        <TouchableOpacity onPress={() => push("/login")}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => push("/register")}>
          <Text style={styles.link}>Create account</Text>
        </TouchableOpacity>
      </View >
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
  const [currentUser, setcurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${host}/user?id=${userId}`);
        if (response.ok) {
          const userData = await response.json();
          setcurrentUser(userData);
        } else {
          console.log("Failed to fetch user data");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const currentEmail = currentUser !== null ? currentUser.email : ""
  const currentName = currentUser !== null ? currentUser.name : ""
  const currentDescription1 = currentUser !== null ? currentUser.stats.description1 : ""
  const currentDescription2 = currentUser !== null ? currentUser.stats.description2 : ""

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
        <Text style={styles.description}>{currentDescription1}</Text>
        <Text style={styles.description}>{currentDescription2}</Text>
        <Text style={styles.description}></Text>
        <Text style={styles.description}>{userId && currentName}</Text>
        <Text style={styles.description}>{userId ? currentEmail : user}</Text>
      </View>
      <View style={styles.MainContainer}>
        {userId && <ScrollView >
          <MediaElement userId={userId} storyIndex={0} />
          <MediaElement userId={userId} storyIndex={1} />
          <MediaElement userId={userId} storyIndex={2} />
          <MediaElement userId={userId} storyIndex={3} />
          <MediaElement userId={userId} storyIndex={4} />
          <MediaElement userId={userId} storyIndex={5} />
          <MediaElement userId={userId} storyIndex={6} />
          <MediaElement userId={userId} storyIndex={7} />
          <MediaElement userId={userId} storyIndex={8} />
          <MediaElement userId={userId} storyIndex={9} />
          <MediaElement userId={userId} storyIndex={10} />
          <MediaElement userId={userId} storyIndex={11} />
          <MediaElement userId={userId} storyIndex={12} />
          <MediaElement userId={userId} storyIndex={13} />
          <MediaElement userId={userId} storyIndex={14} />
          <MediaElement userId={userId} storyIndex={15} />
        </ScrollView>}
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
