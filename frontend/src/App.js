import React, { useState } from 'react';

const API_URL = "http://127.0.0.1:8000/api/generate-story/";

export default function AIStoryStudio() {
  const [prompt, setPrompt] = useState('');
  const [story, setStory] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateStory = async () => {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      setStatus('⚠️ Please enter a story prompt');
      return;
    }

    setIsLoading(true);
    setStatus('Crafting your story...');
    setStory('');

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: trimmedPrompt })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const generatedStory = data.story || 'No story generated.';
      setStory(generatedStory);
      setStatus('✨ Story generated successfully!');

    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
      setStory('Failed to generate story. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = () => {
    setPrompt('');
    setStory('');
    setStatus('');
  };

  const copyStory = () => {
    if (story) {
      navigator.clipboard.writeText(story).then(() => {
        setStatus('✓ Story copied to clipboard!');
        setTimeout(() => setStatus('✨ Story generated successfully!'), 2000);
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      generateStory();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-gray-200 p-8 relative overflow-hidden">
      {/* Animated particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-float"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${Math.random() * 10 + 15}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header with Avatar */}
        <header className="text-center mb-16 animate-fadeInDown">
          <div className="flex justify-center mb-6">
            <img 
              src="https://i.postimg.cc/SKBNcms1/Bharadwaj-removebg-preview.png"
              alt="Bharadwaj"
              className="w-24 h-24 rounded-full border-4 border-purple-500/50 shadow-lg shadow-purple-500/30 object-cover animate-pulse-slow"
            />
          </div>
          <h1 className="text-6xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent font-serif tracking-tight">
            AI Story Studio
          </h1>
          <p className="text-gray-400 tracking-widest text-sm uppercase">
            Transform Ideas into Captivating Stories
          </p>
        </header>

        {/* Input Section */}
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-10 mb-8 border border-white/10 shadow-2xl animate-fadeInUp">
          <label className="block text-xs font-semibold text-gray-300 mb-3 uppercase tracking-wider">
            Your Story Prompt
          </label>
          
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your story idea... (e.g., 'A detective discovers a mysterious time capsule in an abandoned mansion')"
            className="w-full min-h-[160px] p-5 rounded-2xl bg-black/30 border-2 border-white/10 focus:border-purple-500 focus:bg-black/40 focus:outline-none focus:ring-4 focus:ring-purple-500/10 text-white text-lg placeholder-gray-500 resize-y transition-all"
          />

          <div className="flex gap-4 mt-6">
            <button
              onClick={generateStory}
              disabled={isLoading}
              className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold uppercase tracking-wide shadow-lg shadow-purple-500/40 hover:shadow-purple-500/60 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Generating...' : 'Generate Story'}
            </button>
            
            <button
              onClick={clearAll}
              className="flex-1 py-4 px-6 rounded-2xl bg-white/10 border-2 border-white/20 text-gray-200 font-semibold uppercase tracking-wide hover:bg-white/15 hover:border-white/30 transition-all"
            >
              Clear
            </button>
          </div>

          {/* Status */}
          {status && (
            <div className="mt-5 text-center flex items-center justify-center gap-2">
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white/20 border-t-purple-500 rounded-full animate-spin" />
              )}
              <span className="text-gray-300">{status}</span>
            </div>
          )}
        </div>

        {/* Story Display */}
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-12 border border-white/10 shadow-2xl min-h-[200px] animate-fadeInUp">
          {story ? (
            <>
              <div className="flex justify-between items-center mb-6 pb-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📖</span>
                  <h2 className="text-xl font-semibold">Your Story</h2>
                </div>
                <button
                  onClick={copyStory}
                  className="px-5 py-2 bg-white/10 border border-white/20 rounded-xl text-sm hover:bg-white/15 hover:border-white/30 transition-all"
                >
                  📋 Copy
                </button>
              </div>
              <div className="text-gray-100 text-lg leading-relaxed whitespace-pre-wrap">
                {story}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 italic">
              Your generated story will appear here...
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500 text-sm">
          Powered by AI • Created with creativity by{' '}
          <a
            href="https://www.youtube.com/@code-with-Bharadwaj"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 font-semibold transition-colors underline decoration-purple-400/30 hover:decoration-purple-300"
          >
            Bharadwaj
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-100vh) translateX(50px);
            opacity: 0;
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.05);
          }
        }

        .animate-float {
          animation: float 20s infinite ease-in-out;
        }

        .animate-fadeInDown {
          animation: fadeInDown 1s ease;
        }

        .animate-fadeInUp {
          animation: fadeInUp 1s ease 0.2s both;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}