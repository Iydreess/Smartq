/**
 * AI Utility Module
 * Central module for AI-powered features in Smartq
 */

/**
 * Initialize AI client (OpenAI or alternative)
 * In production, this would use the actual OpenAI API
 */
class AIClient {
  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || null
    this.model = process.env.NEXT_PUBLIC_AI_MODEL || 'gpt-4'
    this.temperature = parseFloat(process.env.NEXT_PUBLIC_AI_TEMPERATURE || '0.7')
    this.isEnabled = !!this.apiKey
  }

  /**
   * Generate AI response for a given prompt
   * @param {string} prompt - User prompt
   * @param {Object} options - Additional options
   * @returns {Promise<string>} AI response
   */
  async generateResponse(prompt, options = {}) {
    if (!this.isEnabled) {
      // Fallback to mock responses if API key not configured
      return this.getMockResponse(prompt, options)
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: options.systemContext || 'You are a helpful assistant for a queue management system.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: options.temperature || this.temperature,
          max_tokens: options.maxTokens || 500
        })
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error('[AI] Error generating response:', error)
      // Fallback to mock response on error
      return this.getMockResponse(prompt, options)
    }
  }

  /**
   * Get mock response when AI is not available
   * @param {string} prompt - User prompt
   * @param {Object} options - Additional options
   * @returns {string} Mock response
   */
  getMockResponse(prompt, options = {}) {
    console.log('[AI] Using mock response (API not configured)')
    
    if (options.mockResponse) {
      return options.mockResponse
    }

    return 'AI response simulated (configure OPENAI_API_KEY for real AI)'
  }

  /**
   * Analyze data patterns using AI
   * @param {Array} data - Data to analyze
   * @param {string} analysisType - Type of analysis
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeData(data, analysisType) {
    const prompt = `Analyze the following ${analysisType} data and provide insights: ${JSON.stringify(data, null, 2)}`
    
    const response = await this.generateResponse(prompt, {
      systemContext: `You are a data analyst specializing in queue management and appointment systems. 
                      Provide actionable insights and recommendations based on patterns in the data.`
    })

    return {
      insights: response,
      timestamp: new Date().toISOString()
    }
  }
}

// Export singleton instance
export const aiClient = new AIClient()

/**
 * Check if AI features are enabled
 * @returns {boolean} True if AI is configured
 */
export function isAIEnabled() {
  return aiClient.isEnabled
}

/**
 * Generate AI-powered recommendation
 * @param {string} context - Context for recommendation
 * @param {Object} data - Data to base recommendation on
 * @returns {Promise<Object>} Recommendation object
 */
export async function generateRecommendation(context, data) {
  try {
    const prompt = `Context: ${context}\nData: ${JSON.stringify(data, null, 2)}\n\nProvide a specific recommendation.`
    
    const response = await aiClient.generateResponse(prompt, {
      systemContext: 'You are an expert consultant for queue and appointment management systems.'
    })

    return {
      recommendation: response,
      confidence: 0.85,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('[AI] Error generating recommendation:', error)
    return {
      recommendation: 'Unable to generate recommendation at this time.',
      confidence: 0,
      timestamp: new Date().toISOString()
    }
  }
}

export default aiClient
