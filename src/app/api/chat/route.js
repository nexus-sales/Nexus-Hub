import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `Eres Nexus Assistant, el asistente de IA integrado en Nexus Sales, una plataforma para comerciales que venden energía, telefonía/fibra y sistemas de alarmas.

Tu rol es ayudar a los comerciales con:
- Estrategias de venta y argumentarios
- Información sobre productos y tarifas
- Resolver dudas sobre comisiones y bonus
- Consejos para cerrar ventas
- Comparativas entre productos
- Manejo de objeciones de clientes

Características de tu personalidad:
- Eres conciso y directo, los comerciales tienen poco tiempo
- Usas un tono profesional pero cercano
- Cuando no sepas algo específico (como datos exactos de comisiones del usuario), indícalo claramente
- Puedes usar emojis ocasionalmente para dar énfasis
- Respondes siempre en español

Contexto del negocio:
- Energía: Tarifas de luz y gas para particulares y empresas
- Telefonía: Fibra, móvil, convergentes (O2, Vodafone, etc.)
- Alarmas: Sistemas de seguridad para hogares y negocios

Mantén las respuestas cortas (2-4 frases) a menos que te pidan más detalle.`;

export async function POST(request) {
    try {
        const { messages, userContext } = await request.json();

        // Construir contexto adicional si hay datos del usuario
        let contextMessage = '';
        if (userContext) {
            contextMessage = `\n\nContexto del usuario actual:\n${JSON.stringify(userContext, null, 2)}`;
        }

        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 500,
            system: SYSTEM_PROMPT + contextMessage,
            messages: messages.map(msg => ({
                role: msg.role === 'assistant' ? 'assistant' : 'user',
                content: msg.content
            }))
        });

        return Response.json({
            content: response.content[0].text,
            usage: response.usage
        });

    } catch (error) {
        console.error('Error calling Claude API:', error);

        if (error.status === 401) {
            return Response.json(
                { error: 'API key no configurada o inválida' },
                { status: 401 }
            );
        }

        return Response.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        );
    }
}
