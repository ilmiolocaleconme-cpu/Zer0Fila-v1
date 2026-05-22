import React, { useEffect, useState } from 'react';
import { getRestaurantMenuBySlug } from '../../services/restaurant';
import { formatCurrency } from '../../utils/format';

interface MenuScreenProps {
  restaurantSlug: string;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({ restaurantSlug }) => {
  const [restaurantData, setRestaurantData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMenu() {
      setLoading(true);
      // Esegue la query reale su Supabase creata nei passaggi precedenti
      const data = await getRestaurantMenuBySlug(restaurantSlug);
      setRestaurantData(data);
      setLoading(false);
    }
    loadMenu();
  }, [restaurantSlug]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif', color: '#64748b' }}>
        <p>Caricamento menu in corso...</p>
      </div>
    );
  }

  if (!restaurantData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif', color: '#ef4444', padding: '20px', textAlign: 'center' }}>
        <p>Attività non trovata o menu non disponibile.</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto', padding: '16px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Intestazione Locale */}
      <div style={{ textAlign: 'center', marginBottom: '24px', padding: '16px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        {restaurantData.logo_url && (
          <img src={restaurantData.logo_url} alt="Logo" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '8px' }} />
        )}
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#1e293b' }}>{restaurantData.name}</h1>
        <span style={{ fontSize: '12px', textTransform: 'uppercase', tracking: 'wider', padding: '4px 8px', backgroundColor: '#e2e8f0', borderRadius: '9999px', color: '#475569' }}>
          {restaurantData.business_type}
        </span>
      </div>

      {/* Lista Categorie e Prodotti */}
      {restaurantData.categories?.map((category: any) => (
        <div key={category.id} style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#334155', borderBottom: '2px solid #e2e8f0', paddingBottom: '6px', marginBottom: '12px' }}>
            {category.name}
          </h2>
          
          <div style={{ display: 'grid', gap: '12px' }}>
            {category.products?.map((product: any) => (
              <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                <div style={{ flex: 1, paddingRight: '12px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '500', margin: '0 0 4px 0', color: '#0f172a' }}>{product.name}</h3>
                  {product.description && <p style={{ fontSize: '13px', color: '#64748b', margin: '0' }}>{product.description}</p>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '15px', fontWeight: '600', color: '#10b981', display: 'block', marginBottom: '6px' }}>
                    {formatCurrency(product.price)}
                  </span>
                  <button style={{ backgroundColor: '#10b981', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
                    Aggiungi
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
