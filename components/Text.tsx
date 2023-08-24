import { Text as DefaultText, TextProps, } from "react-native";
import { useThemeColor } from "./Themed";
import { fontProps } from "../app/(tabs)";

export const Text = (props: TextProps) => {
    const color = useThemeColor({}, 'text');
    const { style, ...otherProps } = props;
    return <DefaultText style={[{ color }, style,]} {...otherProps} />
}
