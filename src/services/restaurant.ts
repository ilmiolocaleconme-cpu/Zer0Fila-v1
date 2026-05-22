import { supabase } from '@/core/supabase';

/**
 * Recupera tutti i dati di un ristorante, comprese le categorie, 
 * i prodotti e gli ingredienti associati partendo dallo slug.
 */
export async function getRestaurantMenuBySlug(slug: string) {
  const { data, error } = await supabase
    .from('restaurants')
    .select(`
      id,
      name,
      slug,
      whatsapp_phone,
      logo_url,
      settings,
      business_type,
      categories (
        id,
        name,
        sort_order,
        is_active,
        products (
          id,
          name,
          description,
          price,
          image_url,
          is_available,
          product_ingredients (
            is_default,
            ingredients (
              id,
              name,
              extra_price,
              is_removable
            )
          )
        )
      )
    `)
    .eq('slug', slug)
    .eq('categories.is_active', true)
    .eq('categories.products.is_available', true)
    .single();

  if (error) {
    console.error('Errore nel recupero del menu del locale:', error.message);
    return null;
  }

  return data;
}

/**
 * Recupera l'elenco completo degli ingredienti disponibili in un ristorante
 * (utile per la schermata di personalizzazione/aggiunta extra nel carrello).
 */
export async function getRestaurantIngredients(restaurantId: string) {
  const { data, error } = await supabase
    .from('ingredients')
    .select('id, name, extra_price, is_removable')
    .eq('restaurant_id', restaurantId);

  if (error) {
    console.error('Errore nel recupero degli ingredienti:', error.message);
    return [];
  }

  return data;
}
