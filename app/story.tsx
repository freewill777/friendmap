import React, { useState, useContext } from "react";
import { Button, TextInput, View, StyleSheet, Text } from "react-native";
import { Heap } from "./Heap";
import { useRouter } from "expo-router";

const StoryScreen = () => {
  return (
    <View style={styles.container}>
      <Text>View Story</Text>
    </View>
  );
};

export default StoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
  },
});
