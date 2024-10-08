import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import { Screen } from '../components/Screen';
import { Stack } from 'expo-router';
import { styled } from "nativewind";
import { crearCliente } from '../libs/supabase'; // Asegúrate de que la ruta sea correcta

const StyledPressable = styled(Pressable);

export default function NewCliente() {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');

    const handleSubmit = async () => {
        try {
            const newClient = await crearCliente({ name: nombre, email, telefono });
            Alert.alert('Éxito', 'Cliente creado con éxito');
            console.log('Cliente creado:', newClient);
            
            // Limpiar campos después del envío
            setNombre('');
            setEmail('');
            setTelefono('');
        } catch (error) {
            Alert.alert('Error', 'Hubo un problema al crear el cliente');
            console.error('Error al crear cliente:', error);
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
                    Crear un cliente
                </Text>
                <View>
                    <Text style={styles.label}>Nombre</Text>
                    <TextInput
                        style={styles.input}
                        value={nombre}
                        onChangeText={setNombre}
                        placeholder="Ingrese el nombre"
                    />

                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Ingrese el email"
                        keyboardType="email-address"
                    />

                    <Text style={styles.label}>Teléfono</Text>
                    <TextInput
                        style={styles.input}
                        value={telefono}
                        onChangeText={setTelefono}
                        placeholder="Ingrese el teléfono"
                        keyboardType="phone-pad"
                    />
                    <StyledPressable onPress={handleSubmit} className="w-full flex-row justify-center items-center bg-yellow-500 rounded-xl py-3 active:bg-yellow-600">
                        <Text className="">
                            Guardar cliente
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
