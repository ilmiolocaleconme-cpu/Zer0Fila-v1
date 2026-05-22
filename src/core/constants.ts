// Stati del ciclo di vita di una comanda in cucina
export const ORDER_STATUS = {
  PENDING: 'pending',     // Appena inviato dal cliente
  PREPARING: 'preparing', // Accettato e in lavorazione dal cuoco
  READY: 'ready',         // Pronto al pass per il ritiro o servizio
  COMPLETED: 'completed', // Consegnato e pagato/chiuso
  CANCELLED: 'cancelled', // Annullato dal locale
} as const;

// Tipologie di attività supportate nativamente dalla Mini App
export const BUSINESS_TYPES = {
  PIZZERIA: 'pizzeria',
  PUB: 'pub',
  PANIFICIO: 'panificio',
  MARKET: 'market',
  GASTRONOMIA: 'gastronomia',
} as const;

// Opzioni di consegna/servizio
export const SERVICE_MODES = {
  TABLE: 'Tavolo',
  TAKEAWAY: 'Asporto',
  DELIVERY: 'Domicilio',
} as const;

// Espressione regolare per validare e ripulire i numeri di telefono per il WhatsApp Engine
export const WHATSAPP_PHONE_REGEX = /^\d{11,15}$/; 
