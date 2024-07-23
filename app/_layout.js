import { Link, Slot, Stack } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { Logo } from "../components/Logo";
import { InfoCircleIcon } from "../components/Icons";

export default function Layout() {
    return (
        <View className="flex-1">
            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: "#ecbb20" },
                    headerTintColor: "black",
                    headerTitle: "",
                    headerLeft: () => (<Text>App de pedidos</Text>),
                    headerRight: () => {}
                }}
            />
        </View>
    )
}