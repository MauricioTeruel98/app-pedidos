import { Tabs } from "expo-router";
import { CartShopping, HomeIcon, UserIcon } from "../../components/Icons";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: { backgroundColor: "#ecbb20", height: 60},
                tabBarActiveTintColor: "black",
                tabBarInactiveTintColor: "white"
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <HomeIcon color={color} />
                }}
            />

            <Tabs.Screen
                name="pedidos"
                options={{
                    title: 'Pedidos',
                    tabBarIcon: ({ color }) => <CartShopping color={color} />
                }}
            />

            <Tabs.Screen
                name="clientes"
                options={{
                    title: 'Clientes',
                    tabBarIcon: ({ color }) => <UserIcon color={color} />
                }}
            />
        </Tabs>
    )
}