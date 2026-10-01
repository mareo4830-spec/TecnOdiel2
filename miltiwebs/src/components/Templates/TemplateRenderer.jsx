import React from 'react';
import NocturneTemplate from './NocturneTemplate';
import MinimalistTemplate from './MinimalistTemplate';
import BrutalistTemplate from './BrutalistTemplate';
import ArtisanTemplate from './ArtisanTemplate';
import VelvetTemplate from './VelvetTemplate';
import DynamicThemedTemplate from './DynamicThemedTemplate';

export default function TemplateRenderer({ restaurant, isPreview = false }) {
  if (!restaurant) return null;

  switch (restaurant.template_id) {
    case 'brutalist':
      return <BrutalistTemplate restaurant={restaurant} isPreview={isPreview} />;
    case 'minimalist':
      return <MinimalistTemplate restaurant={restaurant} isPreview={isPreview} />;
    case 'artisan':
      return <ArtisanTemplate restaurant={restaurant} isPreview={isPreview} />;
    case 'velvet':
      return <VelvetTemplate restaurant={restaurant} isPreview={isPreview} />;
    case 'nocturne':
      return <NocturneTemplate restaurant={restaurant} isPreview={isPreview} />;
    default:
      // Dynamically handles all 25+ specialized templates:
      // cyberpunk, tokyo_omakase, mediterranean_breeze, bistro_parisien,
      // urban_street_smash, tapas_andaluzas, steakhouse_asador, pasticceria_dolce,
      // botanical_garden, rooftop_sunset, trattoria_italiana, cerveceria_craft,
      // marisqueria_costera, taqueria_fiesta, coffee_specialty, gelato_artesanal,
      // pizzeria_napolitana, lounge_shisha, beach_club, gourmet_vanguardia,
      // wok_asian_fusion, churreria_tradicional, bodega_enoteca, pulperia_gallega, tecnodiel_elite
      return <DynamicThemedTemplate restaurant={restaurant} isPreview={isPreview} />;
  }
}

