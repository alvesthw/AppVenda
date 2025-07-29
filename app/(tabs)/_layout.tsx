import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground.ios";
import { Tabs } from "expo-router";
import React from "react";
import { Dimensions, View } from "react-native";

export default function TabLayout() {
  const tabWidth = Dimensions.get("window").width - 20;

  return (
    <Tabs
      screenOptions={({ route }) => {
        const iconName =
          route.name === "index"
            ? "house.fill"
            : route.name === "relatorio"
            ? "chart.bar.fill"
            : "gearshape.fill";

        return {
          headerShown: false,
          tabBarShowLabel: false,
          tabBarButton: HapticTab,
          tabBarBackground: () => <TabBarBackground />,
          tabBarStyle: {
            bottom: 20,
            width: tabWidth,
            alignSelf: "center",
            borderRadius: 10,
            height: 60,
            paddingBottom: 10,
            paddingTop: 11,
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            backgroundColor: "transparent",
          },
          tabBarIcon: ({ focused, color }) => (
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: focused ? "#000000ff" : "transparent",
                alignItems: "center",
                justifyContent: "center",
                shadowOffset: { width: 0, height: 4 },
              }}
            >
              <IconSymbol
                size={24}
                name={iconName}
                color={focused ? "white" : color}
              />
            </View>
          ),
        };
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="relatorio" options={{ title: "Relatório" }} />
      <Tabs.Screen name="devedores" options={{ title: "Devedores" }} />
    </Tabs>
  );
}
