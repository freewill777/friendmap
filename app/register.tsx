import React, { useState, useContext } from "react";
import {
  Image,
  TextInput,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import { Heap } from "./Heap";
import { useRouter } from "expo-router";
import { host, logo } from "../appData";

const RegisterScreen = () => {
  const { save, setUser, saveUserId, setUserId } = useContext(Heap);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedAccountType, setSelectedAccountType] = useState<
    "user" | "sportiv" | "business" | "club"
  >("user");
  const os = Platform.OS;
  const { back, push } = useRouter();

  const ready = Boolean(username) && Boolean(password);

  const handlePressLogin = async () => {
    if (!username) {
      return alert("enter username");
    }
    if (!password) {
      return alert("enter password");
    }
    const address =
      `${host}/register` +
      `?name=${username}` +
      `&email=${email}` +
      `&password=${password}`;
    try {
      const response = await fetch(address, { method: "POST" });
      const json = await response.json();
      const { id } = json;

      if (id) {
        const saveId = async (userId: string) => {
          await saveUserId!(userId);
        };
        setUserId!(id);
        saveId(id);
        save!(username).then(async () => {
          setUser(username);
          push("profile");
        });
      } else {
        alert("Exista deja un cont asociat userului/emailuli");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const displayAccountType =
    selectedAccountType.charAt(0).toUpperCase() +
      selectedAccountType.slice(1) || "";

  return (
    <View style={{ ...styles.container, paddingTop: 120 }}>
      <Image
        source={logo}
        style={{ width: 72, height: 72, marginBottom: 80 }}
      />
      <View>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#CAD9D8",
            width: 330,
            borderTopEndRadius: 5,
            borderTopStartRadius: 5,
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <Text style={{ color: "#696969", padding: 8 }}>
            Alege tipul de cont:
          </Text>
          <Text style={{ color: "#696969", padding: 8, marginEnd: 10 }}>
            {displayAccountType}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginBottom: 30,
            backgroundColor: "#CAD9D8",
            width: 330,
            borderBottomEndRadius: 5,
            borderBottomStartRadius: 5,
          }}
        >
          <ScrollView horizontal>
            <TouchableOpacity onPress={() => setSelectedAccountType("user")}>
              <Text
                style={{
                  ...styles.link,
                  ...(selectedAccountType === "user" && styles.selectedItem),
                }}
              >
                User
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedAccountType("sportiv")}>
              <Text
                style={{
                  ...styles.link,
                  ...(selectedAccountType === "sportiv" && styles.selectedItem),
                }}
              >
                Sportiv
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedAccountType("business")}
            >
              <Text
                style={{
                  ...styles.link,
                  ...(selectedAccountType === "business" &&
                    styles.selectedItem),
                }}
              >
                Business
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedAccountType("club")}>
              <Text
                style={{
                  ...styles.link,
                  ...(selectedAccountType === "club" && styles.selectedItem),
                }}
              >
                Club
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      <View>
        {os === "ios" ? (
          <Text style={{ color: "#696969" }}>Username</Text>
        ) : null}
        <TextInput
          value={username}
          onChangeText={(username) => setUsername(username)}
          placeholder={"Username"}
          style={styles.input}
        />
        {os === "ios" ? <Text style={{ color: "#696969" }}>Email</Text> : null}
        <TextInput
          value={email}
          onChangeText={(email) => setEmail(email)}
          placeholder={"Email"}
          style={styles.input}
        />
        {os === "ios" ? (
          <Text style={{ color: "#696969" }}>Password</Text>
        ) : null}
        <TextInput
          value={password}
          onChangeText={(password) => setPassword(password)}
          placeholder={"Password"}
          secureTextEntry={true}
          style={styles.input}
        />
      </View>

      <TouchableOpacity onPress={handlePressLogin}>
        <View style={{ marginTop: 50, marginBottom: 50 }}>
          <Text style={styles.link}>Creaza cont</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ecf0f1",
  },
  input: {
    width: 330,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 10,
    borderRadius: 4,
  },
  link: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#6AB3AC",
    paddingVertical: 15,
    paddingHorizontal: 5,
    margin: 3,
  },
  selectedItem: {
    backgroundColor: "#616961",
    color: "#CAD9D8",
    borderRadius: 6,
  },
});
