import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Image } from 'expo-image';

import { host } from "../appData";
import { Size } from "../constants/Sizes";

const EventScreen = () => {
  const route = useRoute();
  const { params } = route;
  const { id } = params;
  const [eventDetails, setEventDetails] = useState<string>("");

  const { width } = Dimensions.get("window");

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${host}/event?id=${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const json = await response.json();
        setEventDetails(json);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: `${host}/event-media?eventId=${id}` }}
        style={{
          width,
          height: 400,
          marginRight: Size,
        }}
      />
      <Text>{eventDetails && eventDetails?.date}</Text>
      <Text>{eventDetails && eventDetails?.name}</Text>
    </View>
  );
};

export default EventScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
  },
});
