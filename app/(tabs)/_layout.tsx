import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, useRouter } from "expo-router";
import { Pressable, StyleSheet, Image, View, Text } from "react-native";
import { Heap } from "../Heap";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { logo } from "../../appData";
import { useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

// https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
  size?: number
}) {
  return <FontAwesome size={!!props.size ? props.size : 28} {...props} />;
}

export default function TabLayout() {
  const { user, setUser } = useContext(Heap);
  const { push } = useRouter();

  const logout = async () => {
    await AsyncStorage.setItem("@name", "");
    setUser("");
  };

  const HeaderToolbar = () => (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
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
      <Pressable onPress={() => push("chat ")}>
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
          />
        )}
      </Pressable>
    </View>
  )
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
            <Image
              source={logo}
              style={{ width: 72, height: 72, marginLeft: 5 }}
            />
          ),
          headerRight: () => <HeaderToolbar />,
          unmountOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="notifications"
        key="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color }) => <TabBarIcon name="bell" color={color} />,
          tabBarLabelStyle: { display: "none" },
          unmountOnBlur: true,
          headerRight: () => <HeaderToolbar />
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
          title: "Chat",
          tabBarIcon: ({ color }) => <TabBarIcon name="wechat" color={color} />,
          tabBarLabelStyle: { display: "none" },
          unmountOnBlur: true,
          headerRight: () => <HeaderToolbar />
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
});
