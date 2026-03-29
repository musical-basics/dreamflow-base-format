'use client'

import { useEffect, useState } from 'react'
import { parseWithOsmd } from '@/lib/score/OsmdParser'
import type { IntermediateScore } from '@/lib/score/IntermediateScore'
import { VexFlowRenderer } from '@/components/score/VexFlowRenderer'

export default function Home() {
    const [score, setScore] = useState<IntermediateScore | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadScore() {
            try {
                // Parse the XML from the public folder
                const result = await parseWithOsmd('/sample_xml.musicxml')
                setScore(result.intermediateScore)
            } catch (err) {
                console.error("Failed to load score:", err)
            } finally {
                setLoading(false)
            }
        }
        
        loadScore()
    }, [])

    return (
        <main className="min-h-screen p-8 bg-zinc-50 relative overflow-x-auto text-black">
            <h1 className="text-3xl font-bold mb-8">Dreamflow Base Format Viewer</h1>
            
            {loading ? (
                <div className="text-xl">Loading MusicXML...</div>
            ) : score ? (
                <div className="bg-white rounded shadow p-4 shadow-lg min-w-max border border-gray-200">
                    <VexFlowRenderer 
                        score={score} 
                        darkMode={false}
                    />
                </div>
            ) : (
                <div className="text-xl text-red-500">Failed to load or parse MusicXML.</div>
            )}
        </main>
    )
}
