'use client'

import { useState, useEffect } from 'react'
import { predictSystemIssues } from '@/lib/ai/systemMonitoring'

export default function DebugPage() {
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function test() {
      try {
        console.log('Starting test...')
        const data = await predictSystemIssues()
        console.log('Data received:', typeof data, Object.keys(data || {}))
        console.log('Full data:', JSON.stringify(data, null, 2))
        setResult(data)
      } catch (err) {
        console.error('Test error:', err)
        setError(err.message)
      }
    }
    test()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Test Page</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {result && (
        <div className="space-y-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <strong>Success!</strong> Data loaded
          </div>
          
          <div className="bg-white border border-gray-300 rounded p-4">
            <h2 className="font-bold mb-2">Raw JSON:</h2>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
          
          <div className="bg-white border border-gray-300 rounded p-4">
            <h2 className="font-bold mb-2">Testing Individual Renders:</h2>
            <div className="space-y-2">
              <p>Success: {String(result.success)}</p>
              <p>Health Score: {String(result.healthScore)}</p>
              <p>Timestamp: {String(result.timestamp)}</p>
              <p>Issues Count: {String(result.issues?.length || 0)}</p>
              <p>Insights Summary: {String(result.insights?.summary || 'N/A')}</p>
            </div>
          </div>
          
          {result.issues && result.issues.length > 0 && (
            <div className="bg-white border border-gray-300 rounded p-4">
              <h2 className="font-bold mb-2">First Issue:</h2>
              <div className="space-y-1 text-sm">
                <p>Type: {String(result.issues[0].type)}</p>
                <p>Severity: {String(result.issues[0].severity)}</p>
                <p>Current Value: {String(result.issues[0].currentValue)}</p>
                <p>Threshold: {String(result.issues[0].threshold)}</p>
                <p>Probability: {String(result.issues[0].probability)}</p>
                <p>ETA: {String(result.issues[0].estimatedTime)}</p>
                <p>Impact: {String(result.issues[0].impact)}</p>
                <p>Recommendation: {String(result.issues[0].recommendation)}</p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {!result && !error && (
        <div className="animate-pulse">Loading...</div>
      )}
    </div>
  )
}
