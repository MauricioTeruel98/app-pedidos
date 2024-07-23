import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { getAllClients } from '../libs/supabase'; // Ajusta la ruta según la ubicación de tu archivo supabase.js
import { Screen } from '../components/Screen';
import { Stack, useRouter } from 'expo-router';
import { styled } from "nativewind";
import { formatDate } from '../helpers/formatDate';

const StyledPressable = styled(Pressable);

export default function ClientsList() {
    const [clientes, setClientes] = useState([]);
    const [filteredClientes, setFilteredClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    const router = useRouter();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAllClients();
                setClientes(data);
                setFilteredClientes(data);
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
        const filtered = clientes.filter(cliente =>
            cliente.name.includes(text)
        );
        setFilteredClientes(filtered);
    };

    const handleEdit = (clienteId) => {
        router.push(`/cliente/${clienteId}`);
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
            <ScrollView>
                <Text style={styles.title}>Listado de pedidos</Text>
                <TextInput
                    style={styles.searchInput}
                    value={search}
                    onChangeText={handleSearch}
                    placeholder="Buscar pedidos..."
                />
                <FlatList
                    data={filteredClientes}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.productCard}>
                            <Text style={styles.productName}>{item.name}</Text>
                            <View className="flex-row">
                                <Text style={styles.productLabel}>Fecha de creación:</Text>
                                <Text style={styles.productName}> {formatDate(item.created_at)}</Text>
                            </View>
                            <View className="flex-row">
                                <Text style={styles.productLabel}>Email:</Text>
                                <Text style={styles.productDescription}> {item.email}</Text>
                            </View>
                            <View className="flex-row">
                                <Text style={styles.productLabel}>Teléfono:</Text>
                                <Text style={styles.productDescription}> {item.telefono}</Text>
                            </View>
                            <StyledPressable onPress={() => handleEdit(item.id)} className="mt-4 px-4 py-2 bg-blue-500 rounded-md">
                                <Text style={styles.editButtonText}>Editar Cliente</Text>
                            </StyledPressable>
                        </View>
                    )}
                />
            </ScrollView>
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
        fontWeight: 'bold',
    },
    editButtonText: {
        color: 'white',
        textAlign: 'center',
    },
});