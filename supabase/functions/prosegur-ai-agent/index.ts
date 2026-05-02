import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Manejo de pre-flight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    const message = payload.message || payload.query
    const mode = payload.mode || payload.action
    const lead = payload.lead || payload.lead_data
    
    // Obtener secretos de las variables de entorno de Supabase
    const apiKey = Deno.env.get("OPENAI_API_KEY")
    const model = Deno.env.get("OPENAI_MODEL") || "gpt-4o"

    if (!apiKey) {
      throw new Error("Configuración incompleta: OPENAI_API_KEY no encontrada en los secretos de Supabase.")
    }

    // Identidad y Reglas del Súper Agente
    const systemPrompt = `
      Eres "Asistente Comercial IA", un copiloto comercial experto en seguridad y alarmas de Prosegur.
      Tu objetivo es ayudar a comerciales de calle a vender mejor, preparar visitas y responder objeciones.
      Responde siempre de forma concisa y profesional.
    `;

    let userContent = message;

    // Lógica específica según el modo
    if (mode === 'analysis' || mode === 'analyze_lead' || mode === 'probability') {
      userContent = `
        Realiza un análisis inteligente para este lead de Prosegur:
        DATOS DEL LEAD: ${JSON.stringify(lead)}
        
        Debes responder EXCLUSIVAMENTE en formato JSON plano:
        {
          "probability": 0-100,
          "level": "Alto" | "Medio" | "Bajo",
          "reasons": ["razón 1", "razón 2"],
          "advice": "un consejo rápido"
        }
      `;
    }

    // Llamada a OpenAI
    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent }
        ],
        temperature: 0.7
      })
    })

    const data = await aiRes.json()
    if (data.error) throw new Error(data.error.message)

    const aiContent = data.choices[0].message.content;

    // Si es modo análisis, intentamos parsear el JSON de la IA
    if (mode === 'analysis' || mode === 'analyze_lead' || mode === 'probability') {
      try {
        const jsonResponse = JSON.parse(aiContent.replace(/```json|```/g, ""));
        return new Response(JSON.stringify(jsonResponse), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      } catch (e) {
        // Fallback si la IA no devuelve JSON perfecto
        return new Response(JSON.stringify({ response: aiContent }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      }
    }

    // Respuesta normal de chat
    return new Response(JSON.stringify({ response: aiContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
