import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { MOCK_TENANTS } from './mockTenants.js';

const TenantContext = createContext(null);

export const TenantProvider = ({ children, initialSlug = null, initialTemplate = null }) => {
  const [tenants] = useState(MOCK_TENANTS);
  const [activeSlug, setActiveSlug] = useState(() => {
    if (initialSlug) return initialSlug;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlTenant = params.get('tenant') || params.get('t') || params.get('client');
      if (urlTenant) return urlTenant;
    }
    return 'noir-atelier';
  });

  const [activeTemplateOverride, setActiveTemplateOverride] = useState(() => {
    if (initialTemplate) return initialTemplate;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlTemplate = params.get('template') || params.get('tpl');
      if (urlTemplate) return urlTemplate;
    }
    return null;
  });

  // Escuchar parámetros de navegación
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const urlTenant = params.get('tenant') || params.get('t') || params.get('client');
      const urlTemplate = params.get('template') || params.get('tpl');
      if (urlTenant) setActiveSlug(urlTenant);
      if (urlTemplate) setActiveTemplateOverride(urlTemplate);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const tenant = useMemo(() => {
    const found = tenants.find((t) => t.slug === activeSlug || t.id === activeSlug);
    return found || tenants[0];
  }, [tenants, activeSlug]);

  const activeTemplate = useMemo(() => {
    return activeTemplateOverride || tenant?.template || 'the-awwwards-cinematic';
  }, [activeTemplateOverride, tenant]);

  const switchTenant = (slug) => {
    setActiveSlug(slug);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tenant', slug);
      window.history.pushState({}, '', url.toString());
    }
  };

  const switchTemplate = (templateKey) => {
    setActiveTemplateOverride(templateKey);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('template', templateKey);
      window.history.pushState({}, '', url.toString());
    }
  };

  const contextValue = useMemo(
    () => ({
      tenant,
      platform: tenant?.platform || 'hosteleria',
      template: activeTemplate,
      tenantsList: tenants,
      switchTenant,
      switchTemplate
    }),
    [tenant, activeTemplate, tenants]
  );

  return (
    <TenantContext.Provider value={contextValue}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

export default TenantProvider;
