import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, ActivityIndicator, TextInput } from 'react-native';
import { getAllClients } from '../libs/supabase'; // Ajusta la ruta según la ubicación de tu archivo supabase.js
import { Stack, useRouter } from 'expo-router';
import { Screen } from '../components/Screen';

export default function NewPedido() {
    const [clients, setClients] = useState([]);
    const [filteredClientes, setFilteredClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const data = await getAllClients();
                setClients(data);
                setFilteredClientes(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    const handleSelectClient = (clientId) => {
        console.log(clientId);
        router.push(`/order/${clientId}`);
    };

    const handleSearch = (text) => {
        setSearch(text);
        const filtered = clients.filter(cliente =>
            cliente.name.includes(text)
        );
        setFilteredClientes(filtered);
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
            <View style={styles.container}>
                <Text style={styles.title}>Listado de Clientes</Text>
                <TextInput
                    style={styles.searchInput}
                    value={search}
                    onChangeText={handleSearch}
                    placeholder="Buscar cliente..."
                />
                <FlatList
                    data={filteredClientes}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <Pressable onPress={() => handleSelectClient(item.id)} style={styles.clientCard}>
                            <Text style={styles.clientName}>{item.name}</Text>
                        </Pressable>
                    )}
                />
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    clientCard: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
    },
    clientName: {
        fontSize: 18,
    },
});
