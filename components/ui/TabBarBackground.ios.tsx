import { BlurView } from "expo-blur";
import { Dimensions, StyleSheet, View, ViewStyle } from "react-native";

export default function TabBarBackground() {
  const tabWidth = Dimensions.get("window").width - 80;

  return (
    <View style={[styles.wrapper, { width: tabWidth }]}>
      <BlurView tint="systemChromeMaterial" intensity={100} style={styles.blur} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    height: "100%",
    borderRadius: 30,
    overflow: "hidden",
  } as ViewStyle,
  blur: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  } as ViewStyle,
});
