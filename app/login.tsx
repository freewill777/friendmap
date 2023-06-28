import React, { useState, useContext } from "react";
import {
  Button,
  TextInput,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { Heap } from "./Heap";
import { useRouter } from "expo-router";
import { host } from "../appData";

const LoginScreen = () => {
  const { save, setUser, setUserId, saveUserId } = useContext(Heap);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { back, push } = useRouter();

  const ready = Boolean(username) && Boolean(password);

  const handlePressLogin = async () => {
    const address = `${host}/login?email=${username}&password=${password}`;
    const response = await fetch(address);
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
        back();
      });
    } else {
      alert("User/parola gresite");
    }
  };

  return (
    <View style={{ ...styles.container, paddingTop: 200 }}>
      <TextInput
        value={username}
        onChangeText={(username) => setUsername(username)}
        placeholder={"Username"}
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={(password) => setPassword(password)}
        placeholder={"Password"}
        secureTextEntry={true}
        style={styles.input}
      />

      <TouchableOpacity onPress={handlePressLogin} disabled={!ready}>
        <View style={{ marginTop: 100 }}>
          <Text style={styles.link}>Login</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => push("/register")}>
        <View>
          <Text style={styles.link}>Create account</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
  },
  input: {
    width: 330,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 10,
  },
  link: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#6AB3AC",
    padding: 15,
  },
});
