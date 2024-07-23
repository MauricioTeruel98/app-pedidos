import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { getAllProducts } from '../libs/supabase'; // Ajusta la ruta según la ubicación de tu archivo supabase.js
import { Screen } from '../components/Screen';
import { Stack, useRouter } from 'expo-router';
import { styled } from "nativewind";
import { formatPrice } from '../helpers/formatPrice';

const StyledPressable = styled(Pressable);

export default function Productos() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    const router = useRouter();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAllProducts();
                setProducts(data);
                setFilteredProducts(data);
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
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    const handleEdit = (productId) => {
        router.push(`/editProduct/${productId}`);
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
                <Text style={styles.title}>Listado de Productos</Text>
                <TextInput
                    style={styles.searchInput}
                    value={search}
                    onChangeText={handleSearch}
                    placeholder="Buscar productos..."
                />
                <FlatList
                    data={filteredProducts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.productCard}>
                            <Text style={styles.productName}>{item.name}</Text>
                            <Text style={styles.productDescription}>{formatPrice(item.price)}</Text>
                            <StyledPressable onPress={() => handleEdit(item.id)} className="mt-2 px-4 py-2 bg-blue-500 rounded-md">
                                <Text style={styles.editButtonText}>Editar</Text>
                            </StyledPressable>
                        </View>
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
    productDescription: {
        fontSize: 16,
        marginBottom: 10,
    },
    editButtonText: {
        color: 'white',
        textAlign: 'center',
    },
});
