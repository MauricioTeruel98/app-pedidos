import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, ScrollView, View, Text } from 'react-native';
import { BreadSlice, CartShoppingPlus, List, UserPlusIcon } from './Icons';
import { Screen } from './Screen';
import { styled } from "nativewind";
import { getAllProducts, supabase } from '../libs/supabase';

const StyledPressable = styled(Pressable)

export default function Main() {

    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAllProducts();
                setProducts(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchProducts();
    }, []);

    console.log(products);

    return (
        <Screen>
            <ScrollView>
                <Link href={"/newCliente"} asChild>
                    <StyledPressable className="w-full flex-row justify-center items-center bg-yellow-500 rounded-xl py-10 active:bg-yellow-600">
                        <UserPlusIcon size={20} />
                        <Text className="text-center text-xl text-white ml-3">
                            Crear Cliente
                        </Text>
                    </StyledPressable>
                </Link>

                <Link href={"/newPedido"} asChild className="mt-4">
                    <StyledPressable className="w-full flex-row justify-center items-center bg-yellow-500 rounded-xl py-10 active:bg-yellow-600">
                        <CartShoppingPlus size={20} />
                        <Text className="text-center text-xl text-white ml-3">
                            Cargar Pedido
                        </Text>
                    </StyledPressable>
                </Link>

                <Link href={"/newProducto"} asChild className="mt-4">
                    <StyledPressable className="w-full flex-row justify-center items-center bg-yellow-500 rounded-xl py-10 active:bg-yellow-600">
                        <BreadSlice size={20} />
                        <Text className="text-center text-xl text-white ml-3">
                            Agregar Producto
                        </Text>
                    </StyledPressable>
                </Link>

                <Link href={"/productos"} asChild className="mt-4">
                    <StyledPressable className="w-full flex-row justify-center items-center bg-yellow-500 rounded-xl py-10 active:bg-yellow-600">
                        <List size={20} />
                        <Text className="text-center text-xl text-white ml-3">
                            Lista de productos
                        </Text>
                    </StyledPressable>
                </Link>
            </ScrollView>
        </Screen>
    );
}


