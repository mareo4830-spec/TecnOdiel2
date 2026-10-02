import React from 'react';
import NocturneTemplate from './NocturneTemplate';
import MinimalistTemplate from './MinimalistTemplate';
import BrutalistTemplate from './BrutalistTemplate';
import ArtisanTemplate from './ArtisanTemplate';
import VelvetTemplate from './VelvetTemplate';
import TecnodielTemplate from './TecnodielTemplate';
import DynamicThemedTemplate from './DynamicThemedTemplate';
import { normalizeTemplateId } from './templateNormalizer';

export { normalizeTemplateId };

export default function TemplateRenderer({ 
  restaurant, 
  isPreview = false, 
  previewDevice = 'desktop',
  onSelectElement = null,
  selectedElement = null
}) {
  if (!restaurant) return null;

  const templateId = normalizeTemplateId(restaurant?.template_id);
  const normalizedRestaurant = { 
    ...restaurant, 
    template_id: templateId,
    menu_categories: Array.isArray(restaurant?.menu_categories) ? restaurant.menu_categories : [],
    selected_modules: Array.isArray(restaurant?.selected_modules) ? restaurant.selected_modules : [],
    hero_layout: restaurant?.hero_layout || 'split',
    hero_image_side: restaurant?.hero_image_side || 'right',
    hero_image_size: restaurant?.hero_image_size || 'medium'
  };

  const commonProps = {
    restaurant: normalizedRestaurant,
    isPreview,
    previewDevice,
    onSelectElement,
    selectedElement
  };

  // DynamicThemedTemplate provides full responsive device simulation,
  // click-to-edit on every element, side-swapping, and all 20+ bespoke culinary archetypes
  return <DynamicThemedTemplate {...commonProps} />;
}
