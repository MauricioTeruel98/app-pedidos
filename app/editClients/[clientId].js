import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '../../components/Screen';
import { Stack } from 'expo-router';
import { styled } from "nativewind";
import { getClientById, getProductById, updateClient, updateProduct } from '../../libs/supabase'; // Ajusta la ruta según la ubicación de tu archivo supabase.js

const StyledPressable = styled(Pressable);

export default function EditClient() {
    const { clientId } = useLocalSearchParams();
    const router = useRouter();
    const [client, setClient] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const data = await getClientById(clientId);
                console.log('Fetched client data:', data); // Verificar los datos obtenidos
                setClient(data);
                setName(data.name);
                setEmail(data.email);
                setTelefono(data.telefono?.toString() || ''); // Convertir a cadena si es necesario
                console.log('Telefono set to:', data.telefono?.toString()); // Verificar el valor de telefono
            } catch (error) {
                console.error('Error fetching client:', error);
            }
        };

        fetchClient();
    }, [clientId]);

    const handleUpdate = async () => {
        try {
            await updateClient(clientId, { name, email, telefono });
            router.back();
        } catch (error) {
            console.error('Error updating client:', error);
        }
    };

    if (!client) {
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
                <Text style={styles.title}>Editar Cliente</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Nombre del producto"
                />
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Precio"
                />
                <TextInput
                    style={styles.input}
                    value={telefono}
                    onChangeText={setTelefono}
                    placeholder="Teléfono"
                    keyboardType="numeric"
                />
                <StyledPressable onPress={handleUpdate} className="w-full flex-row justify-center items-center bg-yellow-500 rounded-xl py-3 active:bg-yellow-600">
                    <Text className="">
                        Guardar Cliente
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
