import { supabase } from '@/core/supabase';

interface RealtimeOrder {
  id: string;
  customer_name: string;
  table_or_delivery: string;
  total_amount: number;
  status: string;
  created_at: string;
}

/**
 * Sottoscrive lo schermo della cucina ai nuovi ordini in tempo reale
 * per un determinato ristorante.
 */
export function subscribeToKitchenOrders(
  restaurantId: string,
  onNewOrder: (order: RealtimeOrder) => void,
  onUpdateOrder: (order: RealtimeOrder) => void
) {
  const channel = supabase
    .channel(`kitchen-orders-${restaurantId}`)
    .on(
      'postgres_changes',
      {
        event: '*', // Ascolta INSERT, UPDATE e DELETE
        schema: 'public',
        table: 'orders',
        filter: `restaurant_id=eq.${restaurantId}` // Multi-tenant: ascolta solo questo locale
      },
      (payload) => {
        const order = payload.new as RealtimeOrder;

        if (payload.eventType === 'INSERT' && order.status === 'pending') {
          onNewOrder(order);
        } else if (payload.eventType === 'UPDATE') {
          onUpdateOrder(order);
        }
      }
    )
    .subscribe();

  // Ritorna la funzione per disconnettersi dal canale (pulizia memoria nei componenti)
  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Aggiorna lo stato di un ordine direttamente dal pannello cucina
 * (es. da 'pending' a 'preparing', o da 'preparing' a 'ready')
 */
export async function updateOrderStatus(orderId: string, newStatus: 'preparing' | 'ready' | 'completed' | 'cancelled') {
  const { data, error } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    console.error('Errore durante l\'aggiornamento dello stato ordine:', error.message);
    return null;
  }

  return data;
}
