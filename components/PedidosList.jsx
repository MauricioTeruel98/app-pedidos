import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { getAllPedidos, getAllProducts } from '../libs/supabase'; // Ajusta la ruta según la ubicación de tu archivo supabase.js
import { Screen } from '../components/Screen';
import { Stack, useRouter } from 'expo-router';
import { styled } from "nativewind";
import { formatPrice } from '../helpers/formatPrice';
import { formatDate } from '../helpers/formatDate';

const StyledPressable = styled(Pressable);

export default function PedidosList() {
    const [pedidos, setPedidos] = useState([]);
    const [filteredPedidos, setFilteredPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    const router = useRouter();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAllPedidos();
                setPedidos(data);
                setFilteredPedidos(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleSearch = (text) => {
        setSearch(text);
        const filtered = pedidos.filter(pedido =>
            pedido.cliente_id.includes(text)
        );
        setFilteredPedidos(filtered);
    };

    const handleDetail = (pedidoId) => {
        router.push(`/pedidos/${pedidoId}`);
    };

    if (loading) {
        return (
            <Screen>
                <ActivityIndicator color={'#ecbb20'} size={"large"} />
            </Screen>
        );
    }

    if (error) {
        return (
            <Screen>
                <Text>Error: {error}</Text>
            </Screen>
        );
    }
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
                <Text style={styles.title}>Listado de pedidos</Text>
                <TextInput
                    style={styles.searchInput}
                    value={search}
                    onChangeText={handleSearch}
                    placeholder="Buscar pedidos..."
                />
                <FlatList
                    data={filteredPedidos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.productCard}>
                            <Text style={styles.productName}>{item.clients.name}</Text>
                            <View className="flex-row">
                                <Text style={styles.productLabel}>Fecha:</Text>
                                <Text style={styles.productName}> {formatDate(item.created_at)}</Text>
                            </View>
                            <View className="flex-row">
                            <Text style={styles.productLabel}>Total:</Text>
                                <Text style={styles.productDescription}> {formatPrice(item.total)}</Text>
                            </View>
                            <StyledPressable onPress={() => handleDetail(item.id)} className="mt-2 px-4 py-2 bg-blue-500 rounded-md">
                                <Text style={styles.editButtonText}>Ver detalles</Text>
                            </StyledPressable>
                        </View>
                    )}
                />
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
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    editButtonText: {
        color: 'white',
        textAlign: 'center',
    },
});