import { corsHeaders, json } from '../_shared/http.ts';
import { denoEnv, MissingSecretError, requireSecret } from '../_shared/env.ts';

const SYSTEM_PROMPT = `Actúas como un SISTEMA MULTIAGENTE DE 5 ROLES EXPERTOS que colaboran secuencialmente para una agencia SaaS de desarrollo web, SEO local y automatizaciones en España llamada "TecnOdiel".

Dado un SECTOR y una LOCALIDAD (y opcionalmente si el negocio tiene web o no), debes ejecutar la cadena de razonamiento secuencial entre 5 agentes especializados:

1. AGENTE 1 (INVESTIGADOR):
   - Recopila y estructura los datos básicos del negocio (sector, localidad, perfil de clientes y cómo operan habitualmente en España).
   - Genera los términos de búsqueda optimizada para Google Search y Google Maps para localizar negocios reales de este sector en la localidad.

2. AGENTE 2 (AUDITOR TÉCNICO):
   - Analiza los fallos críticos de UX, diseño obsoleto o la ausencia de web (dependencia exclusiva de redes sociales/directorios, sin adaptación a móviles, sin reservas online ni llamadas a la acción claras).
   - Determina exactamente 3 puntos débiles técnicos y de conversión.

3. AGENTE 3 (ESTRATEGA SEO):
   - Evalúa las oportunidades de palabras clave geolocalizadas transaccionales ("{sector} en {localidad}", "mejor {sector} {localidad}", etc.) que los negocios locales están perdiendo.
   - Diseña la estrategia de posicionamiento local (Google Maps Pack 3, ficha Google Business Profile, schema LocalBusiness) y 3 quick wins inmediatos.

4. AGENTE 4 (COPYWRITER OUTBOUND):
   - Redacta una propuesta comercial ultra-personalizada y persuasiva (ideal para WhatsApp o email frío).
   - Tono cercano, respetuoso, directo al grano y enfocado en el dolor detectado por el auditor y estratega SEO.
   - Plantea una solución de alto impacto y ofrece mostrar una demo interactiva creada a medida sin compromiso.
   - Firma: "TecnOdiel (Agencia Tecnológica & SaaS)".

5. AGENTE 5 (DIRECTOR / QA):
   - Revisa de forma exhaustiva las aportaciones de los 4 agentes anteriores.
   - Valida que no haya clichés genéricos, garantiza que los 3 puntos débiles y las keywords sean realistas para la localidad especificada, y compila el dossier comercial final perfecto.

Devuelve SIEMPRE y ÚNICAMENTE un JSON válido con esta estructura exacta (sin markdown, sin bloques \`\`\`json, solo el objeto JSON):
{
  "negocio_tipo": "descripción concisa del sector y perfil local en esa localidad",
  "sector": "Sector analizado",
  "localidad": "Localidad analizada",
  "busqueda_optimizada": {
    "query_google": "búsqueda optimizada para Google",
    "query_maps": "búsqueda optimizada para Google Maps",
    "dork_investigacion": "consulta dork o avanzada para encontrar negocios locales sin web"
  },
  "cadena_agentes": [
    {
      "agente": "Agente 1 (Investigador)",
      "rol": "Recopilación de mercado y datos del negocio",
      "aporte": "Resumen conciso de los hallazgos de mercado para este sector en la localidad"
    },
    {
      "agente": "Agente 2 (Auditor Técnico)",
      "rol": "Auditoría de UX, rendimiento y ausencia/deficiencia web",
      "puntos_debiles": ["Punto débil 1", "Punto débil 2", "Punto débil 3"],
      "aporte": "Conclusión técnica del auditor"
    },
    {
      "agente": "Agente 3 (Estratega SEO)",
      "rol": "Evaluación de palabras clave y visibilidad local",
      "keywords_objetivo": ["keyword 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5"],
      "estrategia": "Estrategia resumida",
      "quick_wins": ["Acción 1", "Acción 2", "Acción 3"],
      "aporte": "Conclusión del estratega SEO"
    },
    {
      "agente": "Agente 4 (Copywriter Outbound)",
      "rol": "Redacción de propuesta comercial persuasiva",
      "aporte": "Enfoque del gancho y estructura persuasiva aplicada al mensaje"
    },
    {
      "agente": "Agente 5 (Director / QA)",
      "rol": "Validación de coherencia, control de calidad y cierre de dossier",
      "veredicto_qa": "Aprobado con alta probabilidad de respuesta",
      "score_calidad": 95,
      "aporte": "Revisión final de coherencia y aprobación para envío comercial"
    }
  ],
  "diagnostico": {
    "resumen": "Párrafo de 2-3 frases con el diagnóstico integral de la presencia digital en la localidad",
    "puntos_debiles": [
      "Punto débil 1 claro y concreto",
      "Punto débil 2 claro y concreto",
      "Punto débil 3 claro y concreto"
    ]
  },
  "oportunidades_seo": {
    "keywords_objetivo": [
      "keyword 1 con localidad",
      "keyword 2 con localidad",
      "keyword 3 con localidad",
      "keyword 4 con localidad",
      "keyword 5 con localidad"
    ],
    "estrategia": "Párrafo detallado con la estrategia para ganar las primeras posiciones locales",
    "quick_wins": [
      "Quick win 1",
      "Quick win 2",
      "Quick win 3"
    ]
  },
  "mensaje_comercial": "Texto completo y formateado del mensaje comercial persuasivo listo para copiar y enviar."
}`;

const GEMINI_MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash'];

interface GeminiResponse {
  candidates?: {
    content?: { parts?: { text?: string }[] };
  }[];
}

async function askGemini(apiKey: string, sector: string, city: string, hasWeb?: boolean) {
  const userPrompt = `SECTOR: ${sector}
LOCALIDAD: ${city}
ESTADO WEB ESTIMADO: ${hasWeb === true ? 'Tiene página web actualmente (posiblemente desactualizada/lenta)' : hasWeb === false ? 'No dispone de página web propia (solo redes sociales o ficha básica)' : 'Desconocido / Auditoría abierta'}

Ejecuta secuencialmente la deliberación de los 5 agentes y compila el dossier comercial final en formato JSON según las instrucciones del sistema.`;

  let lastError: Error | null = null;

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          generationConfig: {
            temperature: 0.65,
            response_mime_type: 'application/json',
          },
        }),
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`Gemini API error (${model}) ${response.status}: ${body}`);
      }

      const result: GeminiResponse = await response.json();
      const raw = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!raw) throw new Error(`La respuesta de Gemini (${model}) no contiene texto`);

      const cleanJson = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      const parsed = JSON.parse(cleanJson);

      // Inyectar URLs directas de búsqueda para facilidad de 1 clic en la interfaz
      const qGoogle = parsed.busqueda_optimizada?.query_google || `${sector} en ${city}`;
      const qMaps = parsed.busqueda_optimizada?.query_maps || `${sector} ${city}`;
      parsed.busqueda_optimizada = {
        ...parsed.busqueda_optimizada,
        query_google: qGoogle,
        query_maps: qMaps,
        url_google: `https://www.google.com/search?q=${encodeURIComponent(qGoogle)}`,
        url_maps: `https://www.google.com/maps/search/${encodeURIComponent(qMaps)}`,
      };

      return parsed;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[prospect-analyze] Falló con ${model}, intentando fallback si existe:`, err);
    }
  }

  throw lastError || new Error('No se pudo generar el análisis con los modelos disponibles');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { sector, city, hasWeb } = await req.json();
    if (!sector?.trim() || !city?.trim()) {
      return json({ error: 'Sector y localidad son obligatorios' }, 400);
    }

    const apiKey = requireSecret(denoEnv, 'GEMINI_API_KEY');
    const analysis = await askGemini(apiKey, sector.trim(), city.trim(), hasWeb);
    return json({ ok: true, analysis });
  } catch (error) {
    if (error instanceof MissingSecretError) {
      return json({ error: `${error.message}. Puedes usar el modo de prospección local sin coste.` }, 503);
    }
    const message = error instanceof Error ? error.message : 'Error interno del servidor';
    console.error('[prospect-analyze]', error);
    return json({ error: message }, 500);
  }
});
