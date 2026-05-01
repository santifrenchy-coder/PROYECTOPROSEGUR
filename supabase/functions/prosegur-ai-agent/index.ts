import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")
const OPENAI_MODEL = Deno.env.get("OPENAI_MODEL") || "gpt-4o"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Manejo de CORS (Preflight)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY no configurada en los secretos de Supabase.")
    }

    const { mode, message, lead } = await req.json()

    // Validaciones de seguridad
    if (!mode) throw new Error("Modo no especificado.")
    if (message && message.length > 2000) throw new Error("Mensaje demasiado largo.")
    
    // 1. Construir el Prompt de Sistema
    const systemPrompt = `Eres "Asistente Comercial IA", un copiloto comercial experto en seguridad, alarmas y venta consultiva para Prosegur.
Ayudas a comerciales de calle a resolver dudas, preparar argumentos, responder objeciones y analizar leads.

REGLAS CRÍTICAS:
- Responde siempre en español.
- Sé claro, práctico, profesional y orientado a la acción comercial.
- No inventes precios, promociones ni condiciones comerciales.
- No inventes normativa legal ni des asesoramiento jurídico definitivo.
- No ataques a competidores; mantén una ética profesional impecable.
- Si faltan datos para un análisis, indícalo claramente.
- La probabilidad del lead es una estimación orientativa, nunca una garantía.`;

    // 2. Preparar el mensaje según el modo
    let userMessage = "";
    let responseFormat = "text";

    if (mode === "lead_analysis") {
      if (!lead) throw new Error("Datos del lead necesarios para el análisis.");
      userMessage = `Analiza este lead comercial y devuelve un JSON detallado:
Nombre: ${lead.name}
Sector: ${lead.sector}
Dirección: ${lead.address}
Compañía actual: ${lead.alarm}
Notas/Servicios: ${lead.services || 'Sin notas'}

Sigue estrictamente este formato JSON:
{
  "summary": "Resumen ejecutivo del lead",
  "opportunityType": "Alta | Media-Alta | Media | Media-Baja | Baja",
  "confidence": "Baja | Media | Alta",
  "positivePoints": ["punto 1", "punto 2"],
  "risks": ["riesgo 1", "riesgo 2"],
  "likelyObjection": "La objeción más probable del cliente",
  "recommendedOpening": "Frase para romper el hielo",
  "usefulQuestions": ["pregunta 1", "pregunta 2"],
  "nextAction": "Acción inmediata recomendada"
}`;
      responseFormat = "json_object";
    } else if (mode === "lead_probability") {
      if (!lead) throw new Error("Datos del lead necesarios para la probabilidad.");
      userMessage = `Calcula la probabilidad comercial para este lead y devuelve un JSON:
Nombre: ${lead.name} | Sector: ${lead.sector} | Compañía: ${lead.alarm} | Notas: ${lead.services || 'N/A'}

Sigue estrictamente este formato JSON:
{
  "probability": 0-100,
  "level": "Bajo | Medio | Medio-Alto | Alto",
  "confidence": "Baja | Media | Alta",
  "summary": "Por qué esta probabilidad",
  "positiveReasons": ["motivo 1", "motivo 2"],
  "risks": ["riesgo 1", "riesgo 2"],
  "likelyObjection": "Objeción probable",
  "recommendedArgument": "Argumento clave de venta",
  "nextAction": "Siguiente paso"
}`;
      responseFormat = "json_object";
    } else {
      // Chat general o botones rápidos
      let context = lead ? `Contexto del lead actual: ${lead.name} (${lead.sector}). ` : "";
      userMessage = `${context}Usuario pregunta: ${message}`;
    }

    // 3. Llamada a OpenAI
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        response_format: responseFormat === "json_object" ? { type: "json_object" } : undefined,
        temperature: 0.7,
      }),
    })

    const aiData = await openaiResponse.json()
    if (aiData.error) throw new Error(aiData.error.message)

    const content = aiData.choices[0].message.content

    // 4. Devolver respuesta formateada
    if (responseFormat === "json_object") {
      const parsed = JSON.parse(content)
      return new Response(JSON.stringify({ ok: true, mode, analysis: parsed }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } else {
      return new Response(JSON.stringify({ ok: true, mode, answer: content }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
