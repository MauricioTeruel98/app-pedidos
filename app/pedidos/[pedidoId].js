import { Stack, useLocalSearchParams } from "expo-router";
import { Screen } from "../../components/Screen";
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { getPedidoById, getProductsPedido } from "../../libs/supabase";
import { formatPrice } from "../../helpers/formatPrice";
import { CheckIcon, WarningIcon } from "../../components/Icons";

export default function PedidoDetalle() {
    const { pedidoId } = useLocalSearchParams();
    const [pedido, setPedido] = useState();
    const [products, setProducts] = useState();

    useEffect(() => {
        const fetchPedido = async () => {
            try {
                const data = await getPedidoById(pedidoId);
                setPedido(data);

                const dataProducts = await getProductsPedido(pedidoId);
                setProducts(dataProducts);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchPedido();
    }, [pedidoId]);

    if (!pedido) {
        return (
            <Screen>
                <ActivityIndicator color={'#ecbb20'} size={"large"} />
            </Screen>
        );
    }

    console.log(pedido);

    return (
        <Screen>
            <Stack.Screen
                options={{
                    headerStyle: { backgroundColor: "#ecbb20" },
                    headerTintColor: "black",
                    headerLeft: () => { },
                    headerRight: () => { }
                }}
            />
            <View>
                <Text className="text-2xl text-center">Pedido #{pedido.id}</Text>
                {
                    pedido.status === 0 && (
                        <View className='flex-row items-center gap-1 justify-end'>
                            <WarningIcon size={20} color={'orange'} />
                            <Text className="text-amber-500 text-xl">
                                Pendiente
                            </Text>
                        </View>
                    )
                }

                {
                    pedido.status === 1 && (
                        <View className='flex-row items-center gap-1 justify-end'>
                            <CheckIcon size={20} color={'green'} />
                            <Text className="text-green-500 text-xl">
                                Entregado
                            </Text>
                        </View>
                    )
                }
                <View className="pb-5 mb-5 border-b border-slate-700">
                    <View className="flex-row">
                        <Text className="text-lg">Cliente:</Text>
                        <Text className="font-bold text-lg"> {pedido.clients.name}</Text>
                    </View>

                    <View className="flex-row">
                        <Text className="text-lg">Total:</Text>
                        <Text className="font-bold text-lg"> {formatPrice(pedido.total)}</Text>
                    </View>
                </View>
                <View>
                    <Text className="mb-3 text-xl">Productos del pedido</Text>
                    {
                        !products ? (
                            <View>
                                <ActivityIndicator color={'#ecbb20'} size={"large"} />
                            </View>
                        ) : (
                            <FlatList
                                data={products}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <View style={styles.productCard}>
                                        <Text style={styles.productName}>{item.products.name}</Text>
                                        <View className="flex-row">
                                            <Text style={styles.productLabel}>Cantidad: </Text>
                                            <Text style={styles.productName}>{item.quantity}</Text>
                                        </View>
                                        <Text style={styles.productDescription}>{formatPrice(item.price_unit)}</Text>
                                    </View>
                                )}
                            />
                        )
                    }
                </View>
            </View>
        </Screen>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
    },
    productCard: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    productLabel: {
        fontSize: 18,
    },
    productDescription: {
        fontSize: 16,
        marginBottom: 10,
    },
    editButtonText: {
        color: 'white',
        textAlign: 'center',
    },
});