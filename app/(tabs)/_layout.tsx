import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, useRouter } from "expo-router";
import { Pressable, StyleSheet, Image, View, Text, TextInput, Button, TouchableWithoutFeedback, Dimensions } from "react-native";
import { Data, Heap } from "../Heap";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { logo } from "../../appData";
import { useContext, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from '@expo/vector-icons';
import { fontProps } from ".";

// https://icons.expo.fyi/
export function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
  size?: number
}) {
  return <FontAwesome size={!!props.size ? props.size : 28} {...props} />;
}

const SearchBar = ({
  searchText,
  setSearchText,
  setSearching,
  searching
}: Partial<Data>) => {
  const inputRef = useRef<TextInput>(null);
  return (<View style={{ flexDirection: "row", alignItems: 'center', }}>
    <Pressable onPress={() => {
      setSearching(undefined);
      setSearchText && setSearchText("");
    }}>
      <FontAwesome
        name="times-circle"
        size={30}
        style={{ marginRight: 11, color: '#454545' }}
      />
    </Pressable>
    <TextInput
      value={searchText}
      onChangeText={(text) => setSearchText && setSearchText(text)}
      placeholder={"Search " + searching}
      placeholderTextColor={"#454545"}
      style={{ ...styles.input }}
      ref={inputRef}
    />
  </View>)
}

const HeaderButtonsBar = ({ setSearching }: any) => {
  const { push } = useRouter();
  return (<>
    <Pressable onPress={() => push("newevent")}>
      {({ pressed }) => (
        <MaterialIcons name="addchart"
          size={24}
          color="#696969"
          style={{
            marginRight: 15,
            marginTop: 1,
            opacity: pressed ? 0.5 : 1,
          }}
        />
      )}
    </Pressable>
    <Pressable onPress={() => push("notifications")}>
      {({ pressed }) => (
        <Ionicons
          name="ios-notifications-circle-outline"
          size={28}
          color="#696969"
          style={{
            marginRight: 15,
            marginTop: 1,
            opacity: pressed ? 0.5 : 1,
          }}
        />
      )}
    </Pressable>
    <Pressable onPress={() => push("chat")}>
      {({ pressed }) => (
        <Ionicons
          name="ios-chatbubble-outline"
          size={24}
          color="#696969"
          style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
        />
      )}
    </Pressable>
    <Pressable>
      {({ pressed }) => (
        <Ionicons
          name="search"
          size={24}
          color="#696969"
          style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
          onPress={() => setSearching("users")}
        />
      )}
    </Pressable>
  </>)
}

const HeaderToolbar = ({ searching,
  searchText,
  setSearching,
  setSearchText
}: Partial<Data> & {
  searching: string | undefined
}) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {searching ? (
        <SearchBar
          searchText={searchText}
          setSearchText={setSearchText}
          setSearching={setSearching}
          searching={searching}
        />
      ) : (
        <HeaderButtonsBar
          setSearching={setSearching}
        />
      )}
    </View>
  )
}


export default function TabLayout() {
  const {
    user,
    setUser,
    searching,
    setSearching,
    setSearchText,
    searchText
  } = useContext(Heap);

  const logout = async () => {
    await AsyncStorage.setItem("@name", "");
    setUser("");
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#6AB3AC",
      }}
    >
      <Tabs.Screen
        name="index"
        key="index"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          tabBarLabelStyle: { display: "none" },
          headerLeft: () => (
            !searching ? <Image
              source={logo}
              style={{ width: 72, height: 72, marginLeft: 5 }}
            /> : null
          ),
          headerRight: () => <HeaderToolbar
            searching={searching}
            setSearchText={setSearchText}
            setSearching={setSearching}
          />,
          unmountOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="groups"
        key="groups"
        options={{
          title: "Groups",
          tabBarIcon: ({ color }) => <TabBarIcon name="group" color={color} />,
          tabBarLabelStyle: { display: "none" },
          unmountOnBlur: true,
          headerRight: () => <HeaderToolbar searching={searching}
            setSearchText={setSearchText}
            setSearching={setSearching} />
        }}
      />
      <Tabs.Screen
        name="newmedia"
        key="plus"
        options={{
          title: "Add",
          tabBarIcon: ({ color }) => (
            <View style={{ backgroundColor: 'white', marginTop: -40, borderRadius: 56, width: 56, height: 56, flexDirection: 'row', justifyContent: 'center' }}>
              <TabBarIcon name="plus-circle" color='#6AB3A0' size={56} />
            </View>
          ),
          unmountOnBlur: true,
          tabBarLabelStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="chat"
        key="chat"
        options={{
          title: searching ? "" : "Chat",
          tabBarIcon: ({ color }) => <TabBarIcon name="wechat" color={color} />,
          tabBarLabelStyle: { display: "none" },
          unmountOnBlur: true,
          headerRight: () => <HeaderToolbar
            searching={searching}
            setSearchText={setSearchText}
            setSearching={setSearching}
          />
        }}
      />

      <Tabs.Screen
        name="profile"
        key="profile"
        options={{
          title: user ? user : "",
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          tabBarLabelStyle: { display: "none" },
          unmountOnBlur: true,
          headerRight: () => {
            if (user) {
              return (
                <Pressable onPress={logout}>
                  {({ pressed }) => (
                    <MaterialCommunityIcons
                      name="progress-close"
                      size={24}
                      color={"black"}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              );
            }
          },
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#6AB3AC",
  },
  input: {
    paddingHorizontal: 10,
    borderRadius: 3,
    width: Dimensions.get("window").width / 1.2,
    marginRight: 10,
    height: 30,
    backgroundColor: "#F0F0F0",
    color: "black",
    fontFamily: "NeueHaasDisplayThin",
  },
});
