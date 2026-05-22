import { useState, useEffect } from 'react';

export interface CartModification {
  ingredient_id: string;
  action: 'added' | 'removed';
  name: string;
}

export interface CartItem {
  id: string; // ID Prodotto
  name: string;
  price: number;
  quantity: number;
  modifications: CartModification[];
}

export interface CustomerSession {
  name: string;
  phone: string;
  lastTableOrDelivery: string;
}

// CHIAVI DI ARCHIVIAZIONE LOCALSTORAGE
const CART_STORAGE_KEY = 'zerofila_cart_v1';
const SESSION_STORAGE_KEY = 'zerofila_session_v1';

export function useCart(restaurantId: string) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [session, setSession] = useState<CustomerSession>({ name: '', phone: '', lastTableOrDelivery: '' });

  // 1. CARICAMENTO DATI ALL'AVVIO
  useEffect(() => {
    const savedCart = localStorage.getItem(`${CART_STORAGE_KEY}_${restaurantId}`);
    const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
    
    if (savedCart) setItems(JSON.parse(savedCart));
    if (savedSession) setSession(JSON.parse(savedSession));
  }, [restaurantId]);

  // 2. AGGIUNGI AL CARRELLO (Riconosce modifiche uniche come piatti distinti)
  const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems((currentItems) => {
      // Cerca se esiste già lo stesso prodotto CON LE STESSE IDENTICHE MODIFICHE
      const existingItemIndex = currentItems.findIndex(
        (item) =>
          item.id === newItem.id &&
          JSON.stringify(item.modifications) === JSON.stringify(newItem.modifications)
      );

      let updatedItems;
      if (existingItemIndex > -1) {
        updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += 1;
      } else {
        updatedItems = [...currentItems, { ...newItem, quantity: 1 }];
      }

      localStorage.setItem(`${CART_STORAGE_KEY}_${restaurantId}`, JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  // 3. RIMUOVI / DIMINUISCI QUANTITÀ
  const removeFromCart = (productId: string, modifications: CartModification[]) => {
    setItems((currentItems) => {
      const updatedItems = currentItems
        .map((item) => {
          if (item.id === productId && JSON.stringify(item.modifications) === JSON.stringify(modifications)) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);

      localStorage.setItem(`${CART_STORAGE_KEY}_${restaurantId}`, JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  // 4. SALVA SESSIONE UTENTE (Ricorda i suoi dati per i riordini futuri)
  const saveCustomerSession = (newSession: CustomerSession) => {
    setSession(newSession);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSession));
  };

  // 5. SVUOTA CARRELLO DOPO L'ORDINE
  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(`${CART_STORAGE_KEY}_${restaurantId}`);
  };

  // CALCOLO TOTALI
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    items,
    session,
    totalAmount,
    addToCart,
    removeFromCart,
    saveCustomerSession,
    clearCart,
  };
}
