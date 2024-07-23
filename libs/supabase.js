import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from '@env';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function getAllProducts() {
    let { data: products, error } = await supabase
        .from('products')
        .select('*');
    if (error) {
        throw error;
    }
    return products;
}

export async function getAllPedidos() {
    let { data: pedidos, error } = await supabase
        .from('pedidos')
        .select(`
            id,
            cliente_id,
            created_at,
            total,
            status,
            clients (name)
        `)
        .order('created_at', { ascending: false });
    if (error) {
        throw error;
    }

    return pedidos;
}

export async function getPedidoById(id) {
    let { data: pedido, error } = await supabase
        .from('pedidos')
        .select('*, clients (name)')
        .eq('id', id)
        .single();
    if (error) {
        throw error;
    }
    return pedido;
}

export async function getProductsPedido(id) {
    let { data: products, error } = await supabase
        .from('pedido_productos')
        .select('*, products (name)')
        .eq('pedido_id', id);
    if (error) {
        throw error;
    }
    return products;
}

export async function crearCliente({ name, email, telefono }) {
    const { data, error } = await supabase
        .from('clients')
        .insert([
            {
                name,
                email,
                telefono
            },
        ])
        .select();

    if (error) {
        throw error;
    }
    return data;
}

export async function crearProducto({ name, price }) {
    const { data, error } = await supabase
        .from('products')
        .insert([
            {
                name,
                price
            },
        ])
        .select();

    if (error) {
        throw error;
    }
    return data;
}

export async function getProductById(id) {
    let { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
    if (error) {
        throw error;
    }
    
    return product;
}

export async function updateProduct(id, { name, price }) {
    const { data, error } = await supabase
        .from('products')
        .update({ name, price })
        .eq('id', id);
    if (error) {
        throw error;
    }
    return data;
}

export const getAllClients = async () => {
    const { data, error } = await supabase
        .from('clients')
        .select('*');
    if (error) throw error;
    return data;
};

export const getClientById = async (id) => {
    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();
    if (error) throw error;
    return data;
};

export const createOrder = async (orderData) => {
    const { clientId, products } = orderData;

    const { data: order, error: orderError } = await supabase
        .from('pedidos')
        .insert([{ cliente_id: clientId, total: calculateTotal(products) }])
        .select(); // Cambiado para seleccionar el registro insertado

    if (orderError) throw orderError;

    if (!order || order.length === 0) {
        throw new Error('La orden no se creó correctamente.');
    }

    const orderId = order[0].id; // Obtenemos el ID del primer elemento de la respuesta

    const orderProducts = products.map(product => ({
        pedido_id: orderId,
        product_id: product.productId,
        quantity: product.quantity,
        price_unit: product.price,
        status: 0
    }));

    const { error: orderProductsError } = await supabase
        .from('pedido_productos')
        .insert(orderProducts);

    if (orderProductsError) throw orderProductsError;

    return order[0];
};



const calculateTotal = (products, quantity) => {
    return products.reduce((total, product) => total + product.price * product.quantity, 0);
};
