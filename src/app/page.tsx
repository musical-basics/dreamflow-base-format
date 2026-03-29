'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { parseMusicXml } from '@/lib/score/MusicXmlParser'
import type { IntermediateScore } from '@/lib/score/IntermediateScore'
import { VexFlowRenderer } from '@/components/score/VexFlowRenderer'
import { Moon, Sun } from 'lucide-react'

/**
 * Dreamflow Base Format Viewer
 * 
 * A minimal renderer that uses MusicXmlParser (direct XML processing)
 * and VexFlowRenderer to display sheet music. 
 */
export default function DreamflowBaseViewer() {
    const [score, setScore] = useState<IntermediateScore | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [musicFont, setMusicFont] = useState('Bravura')
    const [darkMode, setDarkMode] = useState(true)

    useEffect(() => {
        async function loadScore() {
            try {
                console.log('[Viewer] Loading sample MusicXML...')
                const intermediateScore = await parseMusicXml('/sample_xml.musicxml')
                setScore(intermediateScore)
                console.log('[Viewer] Score loaded successfully')
            } catch (err) {
                console.error('[Viewer] Failed to load score:', err)
                setError(err instanceof Error ? err.message : 'Unknown error')
            } finally {
                setIsLoading(false)
            }
        }

        loadScore()
    }, [])

    return (
        <main className={`flex min-h-screen flex-col transition-colors duration-500 ${darkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`}>
            <header className="p-8 pb-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className={`text-3xl font-bold tracking-tight ${darkMode ? 'text-white/90' : 'text-zinc-900'}`}>
                            Dreamflow Base Format Viewer
                        </h1>
                        <p className={`mt-2 ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                            Standalone rendering of MusicXML using the direct parser pipeline.
                        </p>
                    </div>
                    
                    <button 
                        onClick={() => setDarkMode(!darkMode)}
                        className={`p-2.5 rounded-xl border transition-all duration-300 shadow-sm ${
                            darkMode 
                            ? 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800' 
                            : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300'
                        }`}
                        title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
                
                <div className="mt-6 flex items-center gap-4">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
                        darkMode 
                        ? 'bg-zinc-900/50 border-white/5' 
                        : 'bg-white border-zinc-200'
                    }`}>
                        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Font:</span>
                        <select 
                            value={musicFont} 
                            onChange={(e) => setMusicFont(e.target.value)}
                            className="bg-transparent text-sm font-semibold outline-none cursor-pointer"
                        >
                            <option value="Bravura">Bravura (Premium)</option>
                            <option value="Gonville">Gonville</option>
                            <option value="Petaluma">Petaluma</option>
                            <option value="Academico">Academico</option>
                            <option value="">Default (VexFlow)</option>
                        </select>
                    </div>
                    {score && (
                        <div className="text-xs text-zinc-500">
                            {score.measures.length} Measures • {score.title || 'Untitled'}
                        </div>
                    )}
                </div>
            </header>

            <div className="flex-1 p-8 pt-0 flex flex-col">
                <div className={`flex-1 overflow-hidden rounded-2xl border transition-all duration-500 shadow-2xl relative ${
                    darkMode 
                    ? 'border-white/5 bg-white/5 backdrop-blur-sm' 
                    : 'border-zinc-200 bg-white'
                }`}>
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                <p className="text-zinc-400 animate-pulse">Parsing MusicXML...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="absolute inset-0 flex items-center justify-center text-red-400 p-4 text-center">
                            <div>
                                <p className="font-bold mb-1">Parse Error</p>
                                <p className="text-sm opacity-80">{error}</p>
                            </div>
                        </div>
                    ) : (
                        <div className={`w-full h-full overflow-auto overscroll-none scrollbar-hide transition-colors duration-500 ${
                            darkMode ? 'bg-zinc-950' : 'bg-white'
                        }`}>
                            <VexFlowRenderer 
                                score={score} 
                                musicFont={musicFont}
                                darkMode={darkMode} 
                            />
                        </div>
                    )}
                </div>
            </div>

            <footer className={`p-8 pt-4 text-center text-xs ${darkMode ? 'text-zinc-600' : 'text-zinc-400'}`}>
                Built with Dreamflow Library • Headless Renderer Isolation
            </footer>
        </main>
    )
}
