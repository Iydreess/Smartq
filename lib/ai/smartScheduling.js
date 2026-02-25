/**
 * Smart Appointment Scheduling Module
 * Uses AI to suggest optimal appointment times based on multiple factors
 */

import { aiClient } from './index'

/**
 * Analyze historical booking patterns
 * @param {string} serviceId - Service ID
 * @returns {Object} Pattern analysis
 */
function analyzeBookingPatterns(serviceId) {
  // In production, this would query actual database
  // For now, we'll use simulated patterns
  
  const patterns = {
    peakHours: [9, 10, 14, 15, 16], // Most popular hours
    slowHours: [8, 11, 12, 17], // Less popular hours
    peakDays: [1, 2, 3, 4], // Monday-Thursday
    slowDays: [5, 6], // Friday-Saturday
    averageDuration: 30, // minutes
    noShowRate: 0.12, // 12% no-show rate
    preferredTimeBlocks: {
      morning: 0.45, // 45% prefer morning
      afternoon: 0.35, // 35% prefer afternoon
      evening: 0.20 // 20% prefer evening
    }
  }

  return patterns
}

/**
 * Calculate optimal time slots based on AI analysis
 * @param {Object} params - Parameters for scheduling
 * @returns {Array} Scored time slots
 */
function calculateSlotScores(params) {
  const { timeSlots, selectedDate, serviceId, customerId } = params
  const patterns = analyzeBookingPatterns(serviceId)
  
  const dayOfWeek = selectedDate.getDay()
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5
  
  return timeSlots.map(slot => {
    let score = 50 // Base score
    const hour = parseInt(slot.split(':')[0])
    
    // Factor 1: Historical demand (inverse - less demand = better for customer)
    if (patterns.slowHours.includes(hour)) {
      score += 15 // Bonus for low-demand times
    } else if (patterns.peakHours.includes(hour)) {
      score -= 10 // Penalty for high-demand times
    }
    
    // Factor 2: Day of week
    if (isWeekday && patterns.peakDays.includes(dayOfWeek)) {
      score += 5 // Weekdays are generally good
    }
    
    // Factor 3: Time of day preference
    if (hour >= 8 && hour < 12) {
      score += patterns.preferredTimeBlocks.morning * 20
    } else if (hour >= 12 && hour < 16) {
      score += patterns.preferredTimeBlocks.afternoon * 20
    } else {
      score += patterns.preferredTimeBlocks.evening * 20
    }
    
    // Factor 4: Optimal spacing (avoid back-to-back)
    const minutePart = parseInt(slot.split(':')[1] || '0')
    if (minutePart === 0 || minutePart === 30) {
      score += 5 // Prefer on-the-hour or half-hour
    }
    
    // Factor 5: Not too early, not too late
    if (hour === 8 || hour >= 17) {
      score -= 5 // Slight penalty for very early or late
    }
    
    // Factor 6: Lunch time avoidance
    if (hour === 12 || hour === 13) {
      score -= 8 // People prefer not to book during lunch
    }
    
    // Normalize score to 0-100
    score = Math.max(0, Math.min(100, score))
    
    return {
      time: slot,
      score: Math.round(score),
      reasons: getScoreReasons(slot, score, patterns)
    }
  })
}

/**
 * Get human-readable reasons for slot score
 * @param {string} slot - Time slot
 * @param {number} score - Score value
 * @param {Object} patterns - Booking patterns
 * @returns {Array} Array of reasons
 */
function getScoreReasons(slot, score, patterns) {
  const reasons = []
  const hour = parseInt(slot.split(':')[0])
  
  if (score >= 80) {
    reasons.push('Highly recommended')
  }
  
  if (patterns.slowHours.includes(hour)) {
    reasons.push('Lower demand - shorter wait times')
  }
  
  if (hour >= 9 && hour <= 11) {
    reasons.push('Popular morning time slot')
  }
  
  if (hour >= 14 && hour <= 16) {
    reasons.push('Convenient afternoon slot')
  }
  
  if (patterns.peakHours.includes(hour)) {
    reasons.push('High demand - book early')
  }
  
  return reasons
}

/**
 * Main function: Suggest optimal appointment times
 * @param {Object} params - Scheduling parameters
 * @returns {Promise<Object>} Recommendations with scored slots
 */
export async function suggestAppointmentTimes(params) {
  const {
    serviceId,
    customerId,
    selectedDate,
    availableSlots,
    customerPreferences = {}
  } = params

  try {
    console.log('[AI Scheduling] Analyzing optimal times for service:', serviceId)
    
    // Calculate scores for all available slots
    const scoredSlots = calculateSlotScores({
      timeSlots: availableSlots,
      selectedDate,
      serviceId,
      customerId
    })
    
    // Sort by score (highest first)
    scoredSlots.sort((a, b) => b.score - a.score)
    
    // Get top 5 recommendations
    const topSlots = scoredSlots.slice(0, 5)
    
    // Use AI to generate personalized insight (if enabled)
    let aiInsight = 'Based on booking patterns, we recommend these time slots.'
    
    if (aiClient.isEnabled) {
      try {
        const prompt = `Given these top appointment slots ${JSON.stringify(topSlots.map(s => ({ time: s.time, score: s.score })))}, 
                        provide a brief, friendly recommendation message for a customer (max 100 words).`
        
        aiInsight = await aiClient.generateResponse(prompt, {
          systemContext: 'You are a helpful scheduling assistant. Be concise and friendly.',
          maxTokens: 100,
          mockResponse: `We recommend booking between ${topSlots[0].time} and ${topSlots[2].time} for the best experience. These times typically have shorter wait times and better availability.`
        })
      } catch (error) {
        console.error('[AI Scheduling] Error getting AI insight:', error)
      }
    }
    
    return {
      success: true,
      recommendations: topSlots,
      allSlots: scoredSlots,
      insight: aiInsight,
      metadata: {
        totalSlots: availableSlots.length,
        analyzedAt: new Date().toISOString(),
        aiEnabled: aiClient.isEnabled
      }
    }
  } catch (error) {
    console.error('[AI Scheduling] Error suggesting times:', error)
    
    // Fallback: return slots without scoring
    return {
      success: false,
      recommendations: availableSlots.slice(0, 5).map(slot => ({
        time: slot,
        score: 50,
        reasons: ['Standard availability']
      })),
      allSlots: availableSlots.map(slot => ({
        time: slot,
        score: 50,
        reasons: ['Standard availability']
      })),
      insight: 'Please select your preferred time slot.',
      metadata: {
        totalSlots: availableSlots.length,
        analyzedAt: new Date().toISOString(),
        aiEnabled: false,
        error: error.message
      }
    }
  }
}

/**
 * Get personalized scheduling recommendations for a customer
 * @param {string} customerId - Customer ID
 * @param {string} serviceId - Service ID
 * @returns {Promise<Object>} Personalized recommendations
 */
export async function getPersonalizedRecommendations(customerId, serviceId) {
  try {
    // In production, this would analyze customer's booking history
    const customerHistory = {
      totalBookings: 5,
      preferredTime: 'morning',
      averageNoShow: 0.05,
      lastBookingDate: new Date('2026-02-10')
    }
    
    const recommendations = {
      bestDayOfWeek: 'Tuesday or Wednesday',
      bestTimeOfDay: customerHistory.preferredTime,
      suggestedBuffer: '15 minutes before preferred time',
      reliability: customerHistory.averageNoShow < 0.1 ? 'high' : 'moderate'
    }
    
    return {
      success: true,
      recommendations,
      customerInsights: customerHistory
    }
  } catch (error) {
    console.error('[AI Scheduling] Error getting personalized recommendations:', error)
    return {
      success: false,
      recommendations: null,
      error: error.message
    }
  }
}

/**
 * Predict optimal appointment duration based on service and history
 * @param {string} serviceId - Service ID
 * @param {Object} context - Additional context
 * @returns {number} Recommended duration in minutes
 */
export function predictOptimalDuration(serviceId, context = {}) {
  const patterns = analyzeBookingPatterns(serviceId)
  const baseDuration = patterns.averageDuration
  
  // Adjust based on time of day
  const { timeOfDay } = context
  let adjustment = 0
  
  if (timeOfDay === 'morning') {
    adjustment = -5 // Morning appointments tend to be faster
  } else if (timeOfDay === 'evening') {
    adjustment = 5 // Evening appointments may take longer
  }
  
  return baseDuration + adjustment
}

const smartScheduling = {
  suggestAppointmentTimes,
  getPersonalizedRecommendations,
  predictOptimalDuration
}

export default smartScheduling
