import React from 'react';
import ReactDOM from 'react-dom/client';
import { MenuScreen } from './modules/menu/MenuScreen';
import './styles/globals.css';

// Simuliamo l'ingresso da un QR Code del locale "bella-napoli"
const CURRENT_RESTAURANT_SLUG = 'bella-napoli';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MenuScreen restaurantSlug={CURRENT_RESTAURANT_SLUG} />
  </React.StrictMode>
);
