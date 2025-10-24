
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

interface GenerationResult {
  pitch: string;
  logoUrl: string;
}

const generatePitchScript = async (idea: string): Promise<string> => {
  const model = 'gemini-2.5-flash';
  const prompt = `Você é um especialista em startups e capital de risco. Com base na seguinte ideia de negócio, crie um roteiro de pitch conciso e impactante. O roteiro deve ser estruturado em seções claras, usando markdown com cabeçalhos (ex: '**Problema:**'). As seções devem incluir: Problema, Solução, Público-Alvo, Modelo de Negócio, Diferencial Competitivo e Chamada para Ação.

**Instruções Específicas para a Seção 'Público-Alvo':**
Ao descrever o público-alvo, seja extremamente detalhado. Inclua dados demográficos, necessidades específicas, comportamentos e motivações. O público principal consiste em dois segmentos:
1.  **Investidores Individuais:** Pessoas que buscam ativamente as melhores opções de investimento bancário para otimizar seus rendimentos.
2.  **Empreendedores e Acionistas:** Empresários e detentores de ações que estão à procura de novos negócios promissores para investir.

Analise como a ideia de negócio atende às necessidades desses dois grupos.

**Ideia de Negócio Fornecida pelo Usuário:** '${idea}'`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating pitch script:", error);
    throw new Error("Failed to generate pitch script.");
  }
};

const generateLogo = async (idea: string): Promise<string> => {
    const model = 'imagen-4.0-generate-001';
    const prompt = `Crie um logotipo para uma startup de tecnologia com base nesta ideia: '${idea}'. O logotipo deve ser moderno, minimalista, vetorial e icônico. Use uma paleta de cores fortes, mas simples. O design deve ser adequado para um ícone de aplicativo. Não inclua texto no logotipo.`;

    try {
        const response = await ai.models.generateImages({
            model: model,
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }
    } catch (error) {
        console.error("Error generating logo:", error);
        throw new Error("Failed to generate logo.");
    }
};

export const generatePitchAndLogo = async (idea: string): Promise<GenerationResult> => {
    try {
        const [pitch, logoUrl] = await Promise.all([
            generatePitchScript(idea),
            generateLogo(idea)
        ]);
        return { pitch, logoUrl };
    } catch (error) {
        console.error("Error in generation process:", error);
        throw new Error("Failed to generate content. One of the API calls may have failed.");
    }
};
