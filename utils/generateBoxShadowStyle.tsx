import { Platform } from "react-native";

interface BoxShadowStyle {
    shadowColor?: string;
    shadowOffset?: { width: number; height: number };
    shadowOpacity?: number;
    shadowRadius?: number;
    elevation?: number;
}

export const generateBoxShadowStyle = (
    xOffset: number,
    yOffset: number,
    shadowColorIos: string,
    shadowOpacity: number,
    shadowRadius: number,
    elevation: number,
    shadowColorAndroid: string,
): BoxShadowStyle => {
    const styles: { boxShadow?: BoxShadowStyle } = {};

    if (Platform.OS === 'ios') {
        styles.boxShadow = {
            shadowColor: shadowColorIos,
            shadowOffset: { width: xOffset, height: yOffset },
            shadowOpacity,
            shadowRadius,
        };
    } else if (Platform.OS === 'android') {
        styles.boxShadow = {
            elevation,
            shadowColor: shadowColorAndroid,
        };
    }

    return styles.boxShadow || {};
};