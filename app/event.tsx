import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Text, Button, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Image } from 'expo-image';
import { host } from "../appData";
import { Size } from "../constants/Sizes";
import { fontProps } from "./(tabs)";
import { colors } from "./colors";
import { TabBarIcon } from "./(tabs)/_layout";
import { AntDesign } from "@expo/vector-icons";

const fontFamily = 'NeueHaasDisplayBold';

const ButtonIcon = ({ text, iconName, iconStyle }: { text: string, iconName: string, iconStyle?: object }) => {
  const iconSize = 22
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15, }}>
      <View style={{
        backgroundColor: 'white',
        borderRadius: 56,
        width: iconSize,
        height: iconSize,
        flexDirection: 'row',
        justifyContent: 'center',
        ...iconStyle
      }}>
        <AntDesign
          name={iconName as any}
          color='#6AB3A0'
          size={iconSize - 3}
          style={{ marginRight: -1 }}
        />
      </View>
      <Text style={{ color: '#fff', marginLeft: 5, fontFamily }}>{text}</Text>
    </View>
  )
}

const spaceyButton = {
  borderWidth: 1,
  borderColor: '#fff',
  paddingHorizontal: 8,
  paddingVertical: 8,
  marginRight: 8,
  borderRadius: 4
}

const EventScreen = () => {
  const route = useRoute();
  const { params } = route;
  const { id } = params as any;
  const [eventDetails, setEventDetails] = useState<"" | { name: string, date: string }>("");

  const { width, height } = Dimensions.get("window");

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

  const primaryColor = colors.primary;
  const primaryRGB = hexToRGB(primaryColor);
  const iconName = "star"
  const iconSize = 28
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: `${host}/event-media?eventId=${id}` }}
        style={{
          width,
          height: height / 1.7,
          marginRight: Size,
          position: "absolute",
        }}
      />
      <View style={{ width, height: height / 1.7, alignItems: 'center', }}>
        <View style={{
          ...styles.item,
          alignItems: 'center',
          backgroundColor: `rgba(${primaryRGB}, 0.8)`,
          width,
        }}>
          <View >
            <Text style={{ fontFamily, color: '#fff', alignSelf: 'flex-start', paddingTop: 8, }}>{eventDetails && eventDetails?.date}</Text>
            <Text style={{ fontFamily, color: '#fff', fontSize: 22, paddingVertical: 5 }}>{eventDetails && eventDetails?.name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <Text style={{ fontFamily, color: '#fff', paddingBottom: 10 }}>
                Public ⋅ Event by{" "}
              </Text>
              <TouchableOpacity onPress={() => { }} style={{ alignItems: 'flex-end', flexDirection: 'row' }}>
                <Text style={{ fontFamily, color: '#fff', }}>
                  Cristian Sfetcu
                </Text>
              </TouchableOpacity>
            </View>

          </View>
          <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
            <TouchableOpacity onPress={() => { }} style={{ ...spaceyButton }}>
              <ButtonIcon text="Interested" iconName="star" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { }} style={{ ...spaceyButton }}>
              <ButtonIcon text="Going" iconName="login" iconStyle={{ paddingTop: 1 }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{ padding: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15, marginBottom: 8 }}>
          <View style={{
            borderRadius: 56,
            width: iconSize,
            height: iconSize,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
            <AntDesign
              name="clockcircleo"
              color='#6AB3A0'
              size={iconSize - 3}
              style={{ marginRight: -1 }}
            />
          </View>
          <Text style={{ color: '#354a45', marginLeft: 5, fontFamily }}>3 days</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15, marginBottom: 8 }}>
          <View style={{
            borderRadius: 56,
            width: iconSize,
            height: iconSize,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
            <AntDesign
              name="user"
              color='#6AB3A0'
              size={iconSize - 3}
              style={{ marginRight: -1 }}
            />
          </View>
          <Text style={{ color: '#354a45', marginLeft: 5, fontFamily }}>Event by Cristian Sfetcu</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15, marginBottom: 8 }}>
          <View style={{
            borderRadius: 56,
            width: iconSize,
            height: iconSize,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
            <AntDesign
              name="enviromento"
              color='#6AB3A0'
              size={iconSize - 3}
              style={{ marginRight: -1 }}
            />
          </View>
          <Text style={{ color: '#354a45', marginLeft: 5, fontFamily }}>Parcul Etnografic</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15, marginBottom: 8 }}>
          <View style={{
            borderRadius: 56,
            width: iconSize,
            height: iconSize,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
            <AntDesign
              name="checksquareo"
              color='#6AB3A0'
              size={iconSize - 3}
              style={{ marginRight: -1 }}
            />
          </View>
          <Text style={{ color: '#354a45', marginLeft: 5, fontFamily }}>200 going - 433 interested</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15, }}>
          <View style={{
            borderRadius: 56,
            width: iconSize,
            height: iconSize,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
            <AntDesign
              name="earth"
              color='#6AB3A0'
              size={iconSize - 3}
              style={{ marginRight: -1 }}
            />
          </View>
          <Text style={{ color: '#354a45', marginLeft: 5, fontFamily }}>Public</Text>
        </View>
      </View>
    </View >
  );
};

export default EventScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    position: "absolute",
    bottom: 0,
  }
});

function hexToRGB(hex: string) {
  // Remove the '#' character if it exists
  hex = hex.replace('#', '');

  // Convert the hex value to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `${r}, ${g}, ${b}`;
}