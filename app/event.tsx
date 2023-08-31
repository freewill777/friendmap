import { useState, useEffect, useContext } from "react";
import { View, StyleSheet, Dimensions, Text, Button, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Image } from 'expo-image';
import { host } from "../appData";
import { Size } from "../constants/Sizes";
import { fontProps } from "./(tabs)";
import { colors } from "./colors";
import { TabBarIcon } from "./(tabs)/_layout";
import { AntDesign } from "@expo/vector-icons";
import { Heap } from "./Heap";

export const fontFamily = 'NeueHaasDisplayBold';

const ButtonIcon = ({ text, iconName, iconStyle, inversed }: { text: string, iconName: string, iconStyle?: object, inversed?: boolean }) => {
  const iconSize = 22
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
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
      <Text style={{ color: inversed ? '#6AB3A0' : '#fff', marginLeft: 5, fontFamily }}>{text}</Text>
    </View>
  )
}

export const spaceyButton = {
  borderWidth: 1,
  borderColor: '#fff',
  paddingHorizontal: 8,
  paddingVertical: 3,
  marginHorizontal: 8,
  borderRadius: 4,
}

type EventDetails = {
  name: string,
  date: string,
  going: string[],
  interested: string[],
}
const EventScreen = () => {
  const route = useRoute();
  const { params } = route;
  const { id } = params as any;
  const { userId } = useContext(Heap)
  const [eventDetails, setEventDetails] = useState<EventDetails | undefined>(undefined);

  const goingItems = eventDetails?.going?.length || 0
  const interestedItems = eventDetails?.interested?.length || 0

  const interested = userId ? eventDetails?.interested?.includes(userId) : false
  const going = userId ? eventDetails?.going?.includes(userId) : false

  const { width, height } = Dimensions.get("window");

  const getData = async () => {
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
  }

  useEffect(() => {
    getData();
  }, []);

  const primaryColor = colors.primary;
  const primaryRGB = hexToRGB(primaryColor);
  const iconName = "star"
  const iconSize = 28

  const handleInterested = async () => {
    await fetch(`${host}/event-interested?userId=${userId}&eventId=${id}`)
    getData()
  }

  const handleGoing = async () => {
    await fetch(`${host}/event-going?userId=${userId}&eventId=${id}`);
    getData()
  }

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
            <TouchableOpacity onPress={handleInterested} style={{ ...spaceyButton, backgroundColor: interested ? '#fff' : "transparent" }}>
              <ButtonIcon text="Interested" iconName="star" inversed={interested} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleGoing} style={{ ...spaceyButton, backgroundColor: going ? '#fff' : "transparent" }}>
              <ButtonIcon text="Going" iconName="login" iconStyle={{ paddingTop: 1 }} inversed={going} />
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
          <Text style={{ color: '#354a45', marginLeft: 5, fontFamily }}>{goingItems} going - {interestedItems} interested</Text>
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