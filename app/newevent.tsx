import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  TextInput,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView
} from "react-native";

import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Heap } from "./Heap";
import { host, logo } from "../appData";
import { Image } from 'expo-image';
import { fontProps } from "./(tabs)";

const NewEventScreen = () => {
  const [eventName, setEventName] = useState("");
  const [submiting, setSubmiting] = useState(false);
  const [eventDate, setEventDate] = useState("");
  const [eventImage, setEventImage] = useState<string | null>(null);
  const { width } = Dimensions.get("window");
  const { back } = useRouter();

  useEffect(() => {
    if (eventDate.length === 2 || eventDate.length === 5) {
      setEventDate((eventDate) => eventDate + '-')
    }
  }, [eventDate])
  const {
    userId,
    refreshData
  } = useContext(Heap);

  const ready = Boolean(eventName) && Boolean(eventDate);

  const submitEvent = async () => {
    setSubmiting(true)
    const formData = new FormData();
    if (eventImage) {
      formData.append("files", {
        uri: eventImage,
        type: "image/jpeg",
        name: "event-photo.jpg",
      } as any);
      refreshData()
      back()
    }

    formData.append("userId", userId as string);
    formData.append("eventDate", eventDate);
    formData.append("eventName", eventName);
    const eventId = objectId()

    try {
      const data = await fetch(`${host}/events?event=true`, {
        method: "POST",
        headers: {
          userId,
          eventDate,
          eventName,
          mediaType: "image",
          isEventImage: "yes",
          'Content-Type': 'multipart/form-data',
          eventId,
        },
        body: formData,
      } as any);
      const { id } = await data.json()

      try {
        await fetch(`${host}/upload_files`, {
          method: "POST",
          headers: {
            userId: userId,
            mediaType: "image",
            isEventImage: "yes",
            eventId: id,
          },
          body: formData,
        } as any);
      } catch (error) {
        alert('Error when writing event media to disk');
      }

    } catch (error) {
      console.error('Error when creating an event', error);
    }


    // setEventName("");
    // setEventDate("");
    // setEventImage(null);
    // alert('Event created')

  }

  const handlePress = async () => {
    if (!ready) return alert('Please fill in form')

    const validDate = isDateFormatValid(eventDate);
    if (!validDate) return alert('Date must be of format DD-MM-YYY')

    if (ready) {
      await submitEvent();
      // push("profile")
    }
  }

  const pickPhoto = async () => {
    let result = (await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })) as any;
    if (!result.canceled) {
      setEventImage(result.assets[0].uri);
    }
  };

  return (
    <View style={{ ...styles.container }}>
      <Text style={{ opacity: 0.3, marginBottom: 40, ...fontProps }}>Tap to select a photo</Text>
      <TouchableOpacity activeOpacity={0.7} onPress={pickPhoto}>
        <Image
          source={eventImage ? eventImage : logo}
          style={{ minWidth: width, minHeight: 300 }}
        />
      </TouchableOpacity>
      <TextInput
        value={eventName}
        onChangeText={(eventName) => setEventName(eventName)}
        placeholder={"Event name"}
        placeholderTextColor={'black'}
        style={styles.input}
      />
      <TextInput
        value={eventDate}
        onChangeText={(text) => setEventDate(text)}
        placeholder={"Date"}
        placeholderTextColor={'black'}
        style={styles.input}
      />

      <TouchableOpacity onPress={handlePress} style={{ marginBottom: 100 }}>
        <View>
          <Text style={styles.link}>Create event</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default NewEventScreen;

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
    color: 'black',
    ...fontProps
  },
  link: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#6AB3AC",
    padding: 15,
    ...fontProps
  },
});

function isDateFormatValid(dateString: string): boolean {
  // 'DD-MM-YYYY'
  const dateFormatRegex = /^(0?[1-9]|[1-2]\d|3[0-1])-(0?[1-9]|1[0-2])-\d{4}$/;

  return dateFormatRegex.test(dateString);
}

function objectId(): string {
  const timestamp = Math.floor(Date.now() / 1000).toString(16);
  const randomPart = (Math.random() * 16777215).toString(16).padStart(6, '0');
  const counter = (objectId as any)._counter || Math.floor(Math.random() * 16777215);
  (objectId as any)._counter = (counter + 1) % 16777216;

  const computed = timestamp + randomPart + counter.toString(16).padStart(6, '0')
  return computed.replace('.', '').substring(0, 24);
}