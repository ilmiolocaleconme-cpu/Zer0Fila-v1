import { supabase } from '../core/supabase';

interface CartModification {
  ingredient_id: string;
  action: 'added' | 'removed';
  name: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  modifications: CartModification[];
}

interface OrderPayload {
  restaurantId: string;
  restaurantWhatsapp: string;
  customerName: string;
  customerPhone: string;
  tableOrDelivery: string;
  notes?: string;
  items: CartItem[];
  totalAmount: number;
}

/**
 * Salva l'ordine su Supabase con relazioni corrette e modifiche JSONB
 */
export async function createOrder(payload: OrderPayload) {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      restaurant_id: payload.restaurantId,
      customer_phone: payload.customerPhone,
      customer_name: payload.customerName,
      table_or_delivery: payload.tableOrDelivery,
      total_amount: payload.totalAmount,
      notes: payload.notes || '',
      status: 'pending'
    })
    .select()
    .single();

  if (orderError) {
    console.error('Errore creazione ordine principale:', orderError.message);
    return null;
  }

  const orderItemsData = payload.items.map(item => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    unit_price: item.price,
    modifications: item.modifications
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsData);

  if (itemsError) {
    console.error('Errore inserimento dettagli ordine:', itemsError.message);
    return null;
  }

  const whatsappUrl = generateWhatsAppLink(payload);

  return { orderId: order.id, whatsappUrl };
}

/**
 * Compone la stringa di testo pulita per il ristoratore e genera il link WhatsApp
 */
function generateWhatsAppLink(payload: OrderPayload): string {
  let text = `*Nuovo Ordine da ZeroFila* 🚀\n\n`;
  text += `👤 *Cliente:* ${payload.customerName}\n`;
  text += `📍 *Modalità:* ${payload.tableOrDelivery}\n`;
  if (payload.customerPhone) text += `📞 *Tel:* ${payload.customerPhone}\n`;
  text += `\n--- 🛒 *PRODOTTI* ---\n`;

  payload.items.forEach(item => {
    text += `\n*${item.quantity}x* ${item.name} (_€${item.price.toFixed(2)}_)`;
    
    if (item.modifications && item.modifications.length > 0) {
      item.modifications.forEach(mod => {
        if (mod.action === 'added') text += `\n  ➕ Extra: ${mod.name}`;
        if (mod.action === 'removed') text += `\n  ❌ Senza: ${mod.name}`;
      });
    }
  });

  text += `\n\n--------------------\n`;
  if (payload.notes) text += `📝 *Note:* ${payload.notes}\n\n`;
  text += `💰 *TOTALE DA PAGARE:* €${payload.totalAmount.toFixed(2)}`;

  const encodedText = encodeURIComponent(text);
  const cleanPhone = payload.restaurantWhatsapp.replace(/\D/g, '');

  return `https://wa.me{cleanPhone}?text=${encodedText}`;
}
