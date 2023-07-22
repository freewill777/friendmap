import {
  FlatList,
  TouchableOpacity,
  View,
  Dimensions,
  Text,
  ScrollView,
  SafeAreaView,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";
import { texts, list, userPhotos, host } from "../../appData";
import { useRouter } from "expo-router";
import VirtualizedScrollView from "../VirtualizedScrollView";
import { Size } from "../../constants/Sizes";
import socket from "../socket";
import { useContext, useEffect, useState } from "react";
import { Heap } from "../Heap";
import { Image } from 'expo-image';


const ChatScreen = () => {
  const { userId, user } = useContext(Heap);

  socket.connect()
  const [inputText, setInputText] = useState("");

  const [messageLedger, setMessageLedger] = useState([]);

  socket.on('chat ledger', (ledger) => {
    setMessageLedger(ledger)
  })

  useEffect(() => {
    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    if (user === null) {
      push("/login");
    }
  }, [user]);


  const { push } = useRouter();
  const { width } = Dimensions.get("window");

  const renderItem = ({ item }: any) => {

    return (
      <TouchableOpacity onPress={() => push("chatThread")}>
        <View
          style={{
            backgroundColor: "#fff",
            width: width - Size * 4,
            overflow: "hidden",
            flexDirection: "row",
            marginHorizontal: Size,
          }}
        >

          <Image
            source={{ uri: `${host}/avatar?userId=${item.author.id}` }}
            style={{ width: 56, height: 56, borderRadius: 64 }}
          />
          <View
            style={{
              marginLeft: Size,
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",

                width: width - Size * 11,
              }}
            >
              <View>
                <Text style={{ color: "black" }}>{item.author.name}</Text>
              </View>
              <View>
                <Text style={{ color: "black" }}>{item.date}</Text>
              </View>
            </View>
            <Text style={{ color: "#aaa" }} numberOfLines={1}>
              {item.body}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    Boolean(user) ? <>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
        <TextInput
          style={{ flex: 1, height: 50, borderColor: "#696969", borderWidth: 1 }}
          onChangeText={(text) => setInputText(text)}
          value={inputText}
        />
        <Pressable style={styles.button} onPress={() => {
          socket.emit("chat message", { body: inputText, author: { id: userId, name: user }, date: Date.now() });
          setInputText("");
        }} >
          <Text style={styles.text}>Send</Text>
        </Pressable>
      </View>
      <VirtualizedScrollView style={{ backgroundColor: "#fff" }}>
        <ScrollView style={{ marginVertical: Size }}>
          <SafeAreaView>
            <FlatList
              data={messageLedger}
              renderItem={renderItem}
              ItemSeparatorComponent={() => (
                <View style={{ margin: 4, height: 10 }} />
              )}
            />
          </SafeAreaView>
        </ScrollView>
      </VirtualizedScrollView>
    </> : null
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#6AB3AC',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});