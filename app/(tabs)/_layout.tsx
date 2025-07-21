import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground.ios";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Tabs } from "expo-router";
import React from "react";
import { Dimensions, View } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const tabWidth = Dimensions.get("window").width - 80;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
        tabBarShowLabel: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => <TabBarBackground />,
        tabBarStyle: {
          position: "absolute",
          bottom: 20,
          width: Dimensions.get("window").width - 0, // margens de 40px de cada lado
          alignSelf: "center",
          borderRadius: 10,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          backgroundColor: "transparent", // para o blur aparecer
        },

        tabBarIcon: ({ focused, color }) => {
          const iconName =
            route.name === "index"
              ? "house.fill"
              : route.name === "relatorio"
              ? "chart.bar.fill"
              : "gearshape.fill";

          return (
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: focused ? "#007BFF" : "transparent",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: focused ? "#007BFF" : "transparent",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
                elevation: focused ? 6 : 0,
              }}
            >
              <IconSymbol
                size={24}
                name={iconName}
                color={focused ? "white" : color}
              />
            </View>
          );
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="relatorio" options={{ title: "Relatório" }} />
      <Tabs.Screen name="configuracao" options={{ title: "Configurações" }} />
    </Tabs>
  );
}
