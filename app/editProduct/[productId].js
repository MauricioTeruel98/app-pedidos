import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '../../components/Screen';
import { Stack } from 'expo-router';
import { styled } from "nativewind";
import { getProductById, updateProduct } from '../../libs/supabase'; // Ajusta la ruta según la ubicación de tu archivo supabase.js

const StyledPressable = styled(Pressable);

export default function EditProduct() {
    const { productId } = useLocalSearchParams();
    const router = useRouter();
    const [product, setProduct] = useState(null);
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductById(productId);
                setProduct(data);
                setName(data.name);
                setPrice(data.price);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [productId]);

    console.log(price);

    const handleUpdate = async () => {
        try {
            await updateProduct(productId, { name, price });
            router.back();
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    if (!product) {
        return (
            <Screen>
                <ActivityIndicator color={'#ecbb20'} size={"large"} />
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
                <Text style={styles.title}>Editar Producto</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Nombre del producto"
                />
                <TextInput
                    style={styles.input}
                    value={price}
                    onChangeText={setPrice}
                    placeholder="Precio"
                />
                <StyledPressable onPress={handleUpdate} className="w-full flex-row justify-center items-center bg-yellow-500 rounded-xl py-3 active:bg-yellow-600">
                    <Text className="">
                        Guardar Producto
                    </Text>
                </StyledPressable>
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
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
    },
});
