import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, Pressable, ActivityIndicator, Modal, Button } from 'react-native';
import { getAllPedidos, updateStatus, updateStatusPedido } from '../libs/supabase'; // Ajusta la ruta según la ubicación de tu archivo supabase.js
import { Screen } from '../components/Screen';
import { Stack, useRouter } from 'expo-router';
import { styled } from "nativewind";
import { formatPrice } from '../helpers/formatPrice';
import { formatDate } from '../helpers/formatDate';
import { CheckIcon, WarningIcon } from './Icons';

const StyledPressable = styled(Pressable);

export default function PedidosList() {
    const [pedidos, setPedidos] = useState([]);
    const [filteredPedidos, setFilteredPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPedido, setSelectedPedido] = useState(null);

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
    }, [pedidos]);

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

    const handleChangeState = (pedido) => {
        setSelectedPedido(pedido);
        setModalVisible(true);
    };

    const confirmChangeState = async (status, pedido) => {
        try {
            await updateStatusPedido(pedido.id, { status });
        } catch (error) {
            console.error('Error updating client:', error);
        }
        setModalVisible(false);
        setSelectedPedido(null);
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
            <View className="mb-28">
                <View>
                    <Text style={styles.title}>Listado de pedidos</Text>
                    <TextInput
                        style={styles.searchInput}
                        value={search}
                        onChangeText={handleSearch}
                        placeholder="Buscar pedidos..."
                    />
                </View>
                <FlatList
                    data={filteredPedidos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.productCard}>
                            {
                                item.status === 0 && (
                                    <StyledPressable onPress={() => handleChangeState(item)} className='flex-row items-center gap-1 justify-end'>
                                        <WarningIcon size={20} color={'orange'} />
                                        <Text className="text-amber-500 text-xl">
                                            Pendiente
                                        </Text>
                                    </StyledPressable>
                                )
                            }

                            {
                                item.status === 1 && (
                                    <StyledPressable onPress={() => handleChangeState(item)} className='flex-row items-center gap-1 justify-end'>
                                        <CheckIcon size={20} color={'green'} />
                                        <Text className="text-green-500 text-xl">
                                            Entregado
                                        </Text>
                                    </StyledPressable>
                                )
                            }
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
            {selectedPedido && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Cambiar estado del pedido</Text>
                            {selectedPedido.status === 0 ? (
                                <StyledPressable className='bg-green-500 px-4 py-2 rounded active:bg-green-600' onPress={() => confirmChangeState(1, selectedPedido)}>
                                    <Text className="text-white">
                                        Marcar como Entregado
                                    </Text>
                                </StyledPressable>
                            ) : (
                                <StyledPressable className='bg-amber-500 px-4 py-2 rounded active:bg-amber-600' onPress={() => confirmChangeState(0, selectedPedido)}>
                                    <Text>
                                        Marcar como Pendiente
                                    </Text>
                                </StyledPressable>
                            )}
                            <StyledPressable className='bg-red-500 px-4 py-2 rounded active:bg-red-600 mt-3' onPress={() => setModalVisible(false)}>
                                <Text className="text-white">
                                    Cancelar
                                </Text>
                            </StyledPressable>
                        </View>
                    </View>
                </Modal>
            )}
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
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold"
    }
});
