import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, TextInput, Modal, ActivityIndicator } from 'react-native';
import { getClientById, getAllProducts, createOrder } from '../../libs/supabase'; // Ajusta la ruta según la ubicación de tu archivo supabase.js
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Screen } from '../../components/Screen';
import { styled } from 'nativewind';

const StyledPressable = styled(Pressable);

export default function Order() {
    const [client, setClient] = useState(null);
    const [products, setProducts] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [prices, setPrices] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { clientId } = useLocalSearchParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const clientData = await getClientById(clientId);
                setClient(clientData);

                const productsData = await getAllProducts();
                setProducts(productsData);

                // Inicializar precios con los datos obtenidos
                const initialPrices = {};
                productsData.forEach(product => {
                    initialPrices[product.id] = product.price;
                });
                setPrices(initialPrices);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [clientId]);

    const handleQuantityChange = (productId, quantity) => {
        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [productId]: quantity === '' ? '' : parseInt(quantity)
        }));
    };

    const handlePriceChange = (productId, price) => {
        setPrices(prevPrices => ({
            ...prevPrices,
            [productId]: price === '' ? '' : parseFloat(price)
        }));
    };

    const handleConfirmOrder = async () => {
        try {
            const orderData = {
                clientId,
                products: Object.keys(quantities).map(productId => ({
                    productId,
                    quantity: quantities[productId],
                    price: prices[productId]
                }))
            };
            await createOrder(orderData);
            setModalVisible(false);
            router.push('/pedidos');
        } catch (error) {
            setError(error.message);
        }
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
                <Text style={styles.title}>Hacer Pedido</Text>
                {client && <Text style={styles.clientName}>Cliente: {client.name}</Text>}
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.productCard}>
                            <Text style={styles.productName} className="mb-3">{item.name}</Text>
                            <View>
                                <Text className="mb-2">Precio: </Text>
                                <TextInput
                                    style={styles.productPrice}
                                    keyboardType="numeric"
                                    placeholder="Precio"
                                    value={prices[item.id]?.toString() || ''}
                                    onChangeText={(text) => handlePriceChange(item.id, text)}
                                />
                            </View>

                            <TextInput
                                style={styles.quantityInput}
                                keyboardType="numeric"
                                placeholder="Cantidad"
                                value={quantities[item.id]?.toString() || ''}
                                onChangeText={(text) => handleQuantityChange(item.id, text)}
                            />
                        </View>
                    )}
                />
                <StyledPressable onPress={() => setModalVisible(true)} className="mt-2 px-4 py-2 bg-blue-500 rounded-md">
                    <Text style={styles.buttonText}>Confirmar Pedido</Text>
                </StyledPressable>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>¿Confirmar el pedido?</Text>
                            <View style={styles.modalButtons}>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.textStyle}>No</Text>
                                </Pressable>
                                <Pressable
                                    style={[styles.button, styles.buttonConfirm]}
                                    onPress={handleConfirmOrder}
                                >
                                    <Text style={styles.textStyle}>Sí</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
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
    clientName: {
        fontSize: 18,
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
    productPrice: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        width: '100%',
        fontSize: 16,
    },
    quantityInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        width: '100%',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        width: 70,
    },
    buttonClose: {
        backgroundColor: '#f44336',
    },
    buttonConfirm: {
        backgroundColor: '#4CAF50',
    },
    textStyle: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});
