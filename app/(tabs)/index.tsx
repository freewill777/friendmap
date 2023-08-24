import {
  StyleSheet,
  FlatList,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Modal,
  StyleProp,
  TextStyle,
  Platform,
} from "react-native";
import { Image } from 'expo-image';
import * as React from "react";
import { View } from "../../components/Themed";
import { Text } from "../../components/Text";
import { list, host } from "../../appData";
import { useRouter, useNavigation } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Heap } from "../Heap";
import { colors } from "../colors";

import VirtualizedScrollView from "../VirtualizedScrollView";
import { Size } from "../../constants/Sizes";
import { generateBoxShadowStyle } from "../../utils/generateBoxShadowStyle";

export const fontProps: StyleProp<TextStyle> = {
  fontFamily: 'RobotoMedium',
  letterSpacing: 0,
  textTransform: 'capitalize',
}

export const shadowProps = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,

  elevation: 1,
}

const Dropdown = ({ label, data, onSelect, selectedEvent, currentElement }) => {
  const DropdownButton = React.useRef();
  const [visible, setVisible] = React.useState(false);
  const [selected, setSelected] = React.useState(undefined);
  const [dropdownTop, setDropdownTop] = React.useState(0);

  const toggleDropdown = (): void => {
    visible ? setVisible(false) : openDropdown();
  };

  const openDropdown = (): void => {
    DropdownButton.current?.measure((_fx: number, _fy: number, _w: number, h: number, _px: number, py: number) => {
      setDropdownTop(py + h);
    });
    setVisible(true);
  };

  const onItemPress = (item: any): void => {
    onSelect(item);
    setVisible(false);
    if (item.label === 'Delete') {
      fetch(`${host}/events/${currentElement._id}`, { method: 'DELETE' })
    }
  };

  const renderDropdownItem = ({ item }: any): React.ReactElement<any, any> => (
    <TouchableOpacity style={styles.item} onPress={() => onItemPress(item)}>
      <Text style={{ color: 'black', ...fontProps }}>{item.label}</Text>
    </TouchableOpacity >
  );

  const renderDropdown = (): React.ReactElement<any, any> => {
    return (
      <Modal visible={visible} transparent animationType="none">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setVisible(false)}
        >
          <View style={[styles.dropdown, { top: dropdownTop }]}>
            <FlatList
              data={data}
              renderItem={renderDropdownItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <TouchableOpacity
      ref={DropdownButton}
      style={{ ...styles.button, marginRight: 10, ...(visible ? { backgroundColor: '#efefef' } : null) }}
      onPress={toggleDropdown}
    >
      {renderDropdown()}
      <Text style={styles.buttonText}>
        {(!!selected && selected.label) || label}
      </Text>
      <Text>&nbsp;</Text>
      <Text>&nbsp;</Text>
      <Text>&nbsp;</Text>
      <Ionicons name="ellipsis-horizontal-sharp" size={24} color="#000" />
      <Text>&nbsp;</Text>
      <Text>&nbsp;</Text>
      <Text>&nbsp;</Text>
    </TouchableOpacity>
  );
};

const dropdownMenuItems = [
  { label: 'Delete', value: '1' },
  { label: 'Share', value: '2' },
  { label: 'Edit', value: '3' },
];

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
      setStories(responseData)
    }
    getStories()
  }, [])

  const { width } = Dimensions.get("window");
  const { push } = useRouter();
  const navigation = useNavigation();

  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (item.key === 1) {
            return push("newstory");
          }
          navigation.navigate('story', { id: item.id });
        }}
      >
        <View
          style={{
            backgroundColor: "transparent",
            alignItems: "center",
          }}
        >
          <View
            style={{
              padding: item.key !== 1 ? 2 : 3,
              backgroundColor: "#6AB3AC",
              marginTop: 8,
              marginHorizontal: item.key === 1 ? 0 : 8,
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
          <Text style={{ color: "#000", fontSize: 9, ...fontProps }}>
            {item.key !== 1 ? item.userName : 'Add Story'}
          </Text>
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
        ItemSeparatorComponent={() => <View style={{ marginVertical: 4 }} />}
      />
    </SafeAreaView>
  </ScrollView> : null
    ;
};

const Feed = () => {
  const { width } = Dimensions.get("window");
  const navigation = useNavigation();
  const [events, setEvents] = React.useState([])
  const [selectedEvent, setSelectedEvent] = React.useState(undefined);

  const { userId } = React.useContext(Heap);

  React.useEffect(() => {
    (async () => {
      const response = await fetch(`${host}/events`, {
        method: "GET",
        headers: {
          userId: userId,
        },
      })
      const responseData = await response.json();
      setEvents(responseData)
    })()
  }, [])

  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("event", { id: item._id })}
        style={{
          marginBottom: 20,
          marginHorizontal: 15

        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Image
            source={{ uri: `${host}/event-media?eventId=${item._id}` }}
            style={{
              width: 56,
              height: 56,
              borderRadius: 64,
              margin: Size,
            }}
          />
          <View style={{ flexGrow: 2, backgroundColor: "#fff" }}>
            <Text style={{ color: "#000", ...fontProps }}>{item.name}</Text>
            <Text style={{ color: "#aaaaaa", fontSize: 11, ...fontProps, lineHeight: 11 }}>{item.date}</Text>
          </View>
          <Dropdown label="Select Item" selectedEvent={selectedEvent} currentElement={item} data={dropdownMenuItems} onSelect={() => setSelectedEvent(item._id)} />
        </View>
        <Image
          source={{ uri: `${host}/event-media?eventId=${item._id}` }}
          style={{
            height: 80,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
        />
        <View style={{ backgroundColor: '#fff', ...styles.shadowProp }}>
          <View
            style={{
              backgroundColor: "#fff",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              margin: Size,
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
              <Text style={{ color: "#aaa", ...fontProps }}>101 Likes</Text>
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
              <Text style={{ color: "#aaa", ...fontProps }}>100 Comments</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Entypo
                name="share"
                color="#aaa"
                style={{ marginRight: Size / 2 }}
              />
              <Text style={{ color: "#aaa", ...fontProps }}>35 share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity >
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
    <SafeAreaView>
      <VirtualizedScrollView>
        <View style={{ backgroundColor: colors.white }}>
          <StoriesThumbnails />
          <Feed />
        </View>
      </VirtualizedScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    zIndex: 1,
    borderRadius: 6
  },
  buttonText: {
    flex: 1,
    textAlign: 'center',
  },
  icon: {
    marginRight: 10,
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: '100%',
    shadowColor: '#000000',
    shadowRadius: 4,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.5,
  },
  overlay: {
    width: '100%',
    height: '100%',
  },
  item: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  shadowProp: {
    ...generateBoxShadowStyle(0, 1, '#99a9a9', 0.35, 1, 2, '#99a9a9'),

  },
});
