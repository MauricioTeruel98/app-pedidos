import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import { Screen } from '../components/Screen';
import { Stack } from 'expo-router';
import { styled } from "nativewind";
import { crearProducto } from '../libs/supabase'; // Asegúrate de que la ruta sea correcta

const StyledPressable = styled(Pressable);

export default function NewProducto() {
    const [nombre, setNombre] = useState('');
    const [price, setPrice] = useState('');

    const handleSubmit = async () => {
        try {
            const newClient = await crearProducto({ name: nombre, price });
            Alert.alert('Éxito', 'Producto creado con éxito');
            console.log('Producto creado:', newClient);
            
            // Limpiar campos después del envío
            setNombre('');
            setPrice('')
        } catch (error) {
            Alert.alert('Error', 'Hubo un problema al crear el Producto');
            console.error('Error al crear Producto:', error);
        }
    };

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
            <ScrollView contentContainerStyle={styles.container}>
                <Text className="text-2xl text-center mb-5">
                    Crear un Producto
                </Text>
                <View>
                    <Text style={styles.label}>Nombre de producto</Text>
                    <TextInput
                        style={styles.input}
                        value={nombre}
                        onChangeText={setNombre}
                        placeholder="Ingrese el nombre"
                    />

                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        value={price}
                        onChangeText={setPrice}
                        placeholder="Ingrese el precio"
                    />
                    <StyledPressable onPress={handleSubmit} className="w-full flex-row justify-center items-center bg-yellow-500 rounded-xl py-3 active:bg-yellow-600">
                        <Text className="">
                            Guardar Producto
                        </Text>
                    </StyledPressable>
                </View>
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
    },
});
