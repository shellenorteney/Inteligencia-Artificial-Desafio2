
import React, { useState, useCallback } from 'react';
import { generatePitchAndLogo } from './services/geminiService';
import { SparklesIcon, LightBulbIcon } from './components/icons';

// Helper component for rendering parsed pitch content
interface ParsedPitchProps {
  pitch: string;
}

const ParsedPitch: React.FC<ParsedPitchProps> = ({ pitch }) => {
    const lines = pitch.split('\n').filter(line => line.trim() !== '');
    
    return (
        <div className="space-y-4 text-gray-300">
            {lines.map((line, index) => {
                const match = line.match(/^\*\*(.*?):\*\*(.*)$/);
                if (match) {
                    const heading = match[1];
                    const content = match[2];
                    return (
                        <div key={index}>
                            <h3 className="font-bold text-indigo-400 text-lg">{heading}</h3>
                            <p className="mt-1">{content.trim()}</p>
                        </div>
                    );
                }
                return <p key={index}>{line}</p>;
            })}
        </div>
    );
};


// Main App Component
const App: React.FC = () => {
  const [idea, setIdea] = useState<string>('');
  const [pitch, setPitch] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!idea.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setPitch(null);
    setLogoUrl(null);

    try {
      const { pitch, logoUrl } = await generatePitchAndLogo(idea);
      setPitch(pitch);
      setLogoUrl(logoUrl);
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao gerar o conteúdo. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [idea, isLoading]);

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <LightBulbIcon className="w-10 h-10 text-yellow-400"/>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
              Gerador de Pitch com IA
            </h1>
          </div>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Transforme sua ideia de startup em um roteiro de pitch e um logotipo profissional em segundos.
          </p>
        </header>

        {/* Input Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700 mb-8 md:mb-12">
          <label htmlFor="business-idea" className="block text-xl font-semibold mb-3 text-indigo-300">
            Conte-nos sua ideia de negócio
          </label>
          <textarea
            id="business-idea"
            rows={6}
            className="w-full bg-gray-900 border-2 border-gray-700 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 placeholder-gray-500 text-lg"
            placeholder="Ex: Uma plataforma que conecta tutores de animais de estimação com cuidadores verificados usando geolocalização e avaliações..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            disabled={isLoading}
          />
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={isLoading || !idea.trim()}
              className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                  Gerando...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-6 h-6" />
                  Gerar Pitch & Logo
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center mb-8">
            <p>{error}</p>
          </div>
        )}

        {/* Results Section */}
        {(pitch || logoUrl || isLoading) && (
           <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
             
             {/* Pitch Result */}
             <div className="lg:col-span-3">
                <h2 className="text-2xl font-bold mb-4 text-indigo-300">Roteiro do seu Pitch</h2>
                <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 min-h-[300px] animate-fade-in">
                    {isLoading && !pitch && (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center text-gray-400">
                                <div className="w-8 h-8 mx-auto border-4 border-t-transparent border-indigo-400 rounded-full animate-spin mb-4"></div>
                                <p>Criando um roteiro impactante...</p>
                            </div>
                        </div>
                    )}
                    {pitch && <ParsedPitch pitch={pitch} />}
                </div>
             </div>

             {/* Logo Result */}
             <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-4 text-indigo-300">Sugestão de Logo</h2>
                <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 aspect-square flex items-center justify-center animate-fade-in">
                  {isLoading && !logoUrl && (
                        <div className="text-center text-gray-400">
                            <div className="w-8 h-8 mx-auto border-4 border-t-transparent border-indigo-400 rounded-full animate-spin mb-4"></div>
                            <p>Desenhando sua identidade visual...</p>
                        </div>
                  )}
                  {logoUrl && (
                    <img 
                      src={logoUrl} 
                      alt="Logo gerado por IA" 
                      className="rounded-lg w-full h-full object-contain"
                    />
                  )}
                </div>
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default App;
