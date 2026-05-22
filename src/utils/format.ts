/**
 * Formatta un numero in stringa valuta Euro italiana (es. 6.5 -> 6,50 €)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}

/**
 * Pulisce e formatta una stringa numerica di telefono per essere compatibile con le API di WhatsApp
 * Rimuove spazi, caratteri speciali e aggiunge il prefisso internazionale se mancante
 */
export function formatWhatsAppLinkPhone(phone: string): string {
  // Rimuove tutto ciò che non è un numero
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Se l'utente ha inserito il numero senza il prefisso italiano "39", lo aggiungiamo automaticamente
  if (cleanPhone.length === 10 && (cleanPhone.startsWith('3') || cleanPhone.startsWith('0'))) {
    return `39${cleanPhone}`;
  }
  
  return cleanPhone;
}
