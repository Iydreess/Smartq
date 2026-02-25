/**
 * Predictive System Monitoring Module
 * Uses AI to predict system issues before they occur
 */

import { aiClient } from './index'

/**
 * Simulate system metrics collection
 * In production, this would integrate with actual monitoring tools
 */
function collectSystemMetrics() {
  const now = new Date()
  
  return {
    timestamp: now.toISOString(),
    database: {
      responseTime: 45 + Math.random() * 50, // ms
      connections: 23 + Math.floor(Math.random() * 20),
      queryRate: 150 + Math.floor(Math.random() * 100), // queries/min
      cpuUsage: 35 + Math.random() * 30, // percentage
      memoryUsage: 55 + Math.random() * 25, // percentage
      diskIO: 120 + Math.random() * 80, // MB/s
      slowQueries: Math.floor(Math.random() * 5) // count
    },
    api: {
      responseTime: 120 + Math.random() * 180, // ms
      requestRate: 250 + Math.floor(Math.random() * 150), // req/min
      errorRate: Math.random() * 2, // percentage
      timeoutRate: Math.random() * 0.5, // percentage
      activeConnections: 45 + Math.floor(Math.random() * 30)
    },
    storage: {
      used: 45.5 + Math.random() * 20, // GB
      available: 200 - (45.5 + Math.random() * 20), // GB
      growthRate: 0.5 + Math.random() * 1.5, // GB/day
      fileCount: 15000 + Math.floor(Math.random() * 5000)
    },
    queues: {
      active: 23 + Math.floor(Math.random() * 15),
      processing: 156 + Math.floor(Math.random() * 50),
      backlog: Math.floor(Math.random() * 10),
      averageWaitTime: 5 + Math.random() * 10 // minutes
    },
    users: {
      activeNow: 89 + Math.floor(Math.random() * 40),
      peakToday: 145,
      sessionsToday: 420 + Math.floor(Math.random() * 100),
      bounceRate: 15 + Math.random() * 10 // percentage
    }
  }
}

/**
 * Ensure value is renderable (string or number)
 * @param {any} value - Value to convert
 * @returns {string|number} Renderable value
 */
function ensureRenderable(value) {
  if (value === null || value === undefined) {
    return 'N/A'
  }
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return value
}

/**
 * Analyze metrics to detect anomalies and trends
 * @param {Object} metrics - Current system metrics
 * @param {Array} historicalData - Historical metrics for trend analysis
 * @returns {Array} Detected issues and predictions
 */
function analyzeMetrics(metrics, historicalData = []) {
  const issues = []
  
  // Database performance analysis
  if (metrics.database.responseTime > 80) {
    issues.push({
      type: 'database_slowdown',
      severity: metrics.database.responseTime > 120 ? 'high' : 'medium',
      metric: 'database.responseTime',
      currentValue: ensureRenderable(Math.round(metrics.database.responseTime)),
      threshold: ensureRenderable(80),
      probability: 0.75,
      estimatedTime: metrics.database.responseTime > 120 ? '1-2 days' : '3-5 days',
      impact: 'Queries taking longer, user experience degradation',
      recommendation: 'Consider database optimization or scaling'
    })
  }
  
  if (metrics.database.cpuUsage > 70) {
    issues.push({
      type: 'high_cpu_usage',
      severity: 'medium',
      metric: 'database.cpuUsage',
      currentValue: ensureRenderable(Math.round(metrics.database.cpuUsage)),
      threshold: ensureRenderable(70),
      probability: 0.68,
      estimatedTime: '2-4 days',
      impact: 'Database performance degradation possible',
      recommendation: 'Monitor query efficiency, consider scaling database resources'
    })
  }
  
  if (metrics.database.slowQueries > 3) {
    issues.push({
      type: 'slow_queries_detected',
      severity: 'medium',
      metric: 'database.slowQueries',
      currentValue: ensureRenderable(metrics.database.slowQueries),
      threshold: ensureRenderable(3),
      probability: 0.82,
      estimatedTime: 'immediate',
      impact: 'Specific queries causing performance bottlenecks',
      recommendation: 'Review and optimize slow queries, add indexes if needed'
    })
  }
  
  // API performance analysis
  if (metrics.api.errorRate > 1.5) {
    issues.push({
      type: 'elevated_error_rate',
      severity: 'high',
      metric: 'api.errorRate',
      currentValue: ensureRenderable(metrics.api.errorRate.toFixed(2)),
      threshold: ensureRenderable(1.5),
      probability: 0.85,
      estimatedTime: 'immediate',
      impact: 'Users experiencing errors, potential data issues',
      recommendation: 'Check error logs, investigate failing endpoints'
    })
  }
  
  if (metrics.api.responseTime > 250) {
    issues.push({
      type: 'api_latency',
      severity: 'medium',
      metric: 'api.responseTime',
      currentValue: ensureRenderable(Math.round(metrics.api.responseTime)),
      threshold: ensureRenderable(250),
      probability: 0.72,
      estimatedTime: '1-3 days',
      impact: 'Slower page loads, poor user experience',
      recommendation: 'Profile API endpoints, optimize slow routes, consider caching'
    })
  }
  
  // Storage analysis
  const storageUsagePercent = (metrics.storage.used / (metrics.storage.used + metrics.storage.available)) * 100
  
  if (storageUsagePercent > 75) {
    const daysUntilFull = (metrics.storage.available / metrics.storage.growthRate).toFixed(0)
    issues.push({
      type: 'storage_capacity',
      severity: storageUsagePercent > 85 ? 'high' : 'medium',
      metric: 'storage.used',
      currentValue: ensureRenderable(`${metrics.storage.used.toFixed(1)}GB (${storageUsagePercent.toFixed(1)}%)`),
      threshold: ensureRenderable('75%'),
      probability: 0.90,
      estimatedTime: `${daysUntilFull} days until full`,
      impact: 'Storage will run out, affecting uploads and data storage',
      recommendation: 'Increase storage capacity or implement data archival'
    })
  }
  
  // Queue backlog analysis
  if (metrics.queues.backlog > 5) {
    issues.push({
      type: 'queue_backlog',
      severity: metrics.queues.backlog > 8 ? 'high' : 'medium',
      metric: 'queues.backlog',
      currentValue: ensureRenderable(metrics.queues.backlog),
      threshold: ensureRenderable(5),
      probability: 0.65,
      estimatedTime: '6-12 hours',
      impact: 'Customers experiencing longer wait times',
      recommendation: 'Increase queue processing capacity or optimize queue handling'
    })
  }
  
  // User engagement analysis
  if (metrics.users.bounceRate > 20) {
    issues.push({
      type: 'high_bounce_rate',
      severity: 'low',
      metric: 'users.bounceRate',
      currentValue: ensureRenderable(`${metrics.users.bounceRate.toFixed(1)}%`),
      threshold: ensureRenderable('20%'),
      probability: 0.55,
      estimatedTime: 'ongoing trend',
      impact: 'Users leaving without engagement',
      recommendation: 'Review user experience, check page load times, analyze user flows'
    })
  }
  
  return issues
}

/**
 * Generate AI-powered insights from metrics
 * @param {Object} metrics - Current metrics
 * @param {Array} issues - Detected issues
 * @returns {Promise<Object>} AI insights
 */
async function generateAIInsights(metrics, issues) {
  if (issues.length === 0) {
    return {
      summary: 'All systems operating normally',
      recommendations: ['Continue monitoring system health', 'Review logs periodically'],
      aiGenerated: false
    }
  }
  
  try {
    if (aiClient.isEnabled) {
      const prompt = `System metrics summary:
- Database Response Time: ${metrics.database.responseTime.toFixed(0)}ms
- API Error Rate: ${metrics.api.errorRate.toFixed(2)}%
- Storage Used: ${((metrics.storage.used / (metrics.storage.used + metrics.storage.available)) * 100).toFixed(1)}%
- Active Users: ${metrics.users.activeNow}

Detected issues: ${JSON.stringify(issues.map(i => ({ type: i.type, severity: i.severity })))}

Provide a brief executive summary and top 3 actionable recommendations (max 150 words).`

      const aiResponse = await aiClient.generateResponse(prompt, {
        systemContext: 'You are a system reliability engineer providing insights on infrastructure health.',
        maxTokens: 200
      })
      
      return {
        summary: aiResponse,
        recommendations: issues.slice(0, 3).map(i => i.recommendation),
        aiGenerated: true
      }
    }
  } catch (error) {
    console.error('[System Monitoring] Error generating AI insights:', error)
  }
  
  // Fallback insights
  const highSeverityCount = issues.filter(i => i.severity === 'high').length
  const mediumSeverityCount = issues.filter(i => i.severity === 'medium').length
  
  let summary = `System health check: ${issues.length} potential issue${issues.length > 1 ? 's' : ''} detected. `
  
  if (highSeverityCount > 0) {
    summary += `${highSeverityCount} high-priority issue${highSeverityCount > 1 ? 's' : ''} require immediate attention. `
  }
  if (mediumSeverityCount > 0) {
    summary += `${mediumSeverityCount} medium-priority issue${mediumSeverityCount > 1 ? 's' : ''} should be addressed soon.`
  }
  
  return {
    summary,
    recommendations: issues.slice(0, 3).map(i => i.recommendation),
    aiGenerated: false
  }
}

/**
 * Main function: Predict system issues before they occur
 * @returns {Promise<Object>} Predictions and recommendations
 */
export async function predictSystemIssues() {
  try {
    console.log('[System Monitoring] Analyzing system health...')
    
    // Collect current metrics
    const metrics = collectSystemMetrics()
    console.log('[System Monitoring] Metrics collected')
    
    // Analyze for issues and predictions
    const issues = analyzeMetrics(metrics)
    console.log('[System Monitoring] Issues analyzed:', issues.length, 'issues found')
    
    // Generate AI insights
    const insights = await generateAIInsights(metrics, issues)
    console.log('[System Monitoring] Insights generated')
    
    // Calculate overall health score
    const healthScore = calculateHealthScore(metrics, issues)
    console.log('[System Monitoring] Health score calculated:', healthScore)
    
    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      healthScore,
      // Note: metrics object removed to prevent serialization issues
      // metrics can be added back if needed for debugging
      issues: issues.sort((a, b) => {
        const severityOrder = { high: 3, medium: 2, low: 1 }
        return severityOrder[b.severity] - severityOrder[a.severity]
      }),
      insights,
      metadata: {
        totalIssues: issues.length,
        highSeverity: issues.filter(i => i.severity === 'high').length,
        mediumSeverity: issues.filter(i => i.severity === 'medium').length,
        lowSeverity: issues.filter(i => i.severity === 'low').length,
        aiEnabled: aiClient.isEnabled
      }
    }
    
    console.log('[System Monitoring] Result prepared, returning')
    return result
  } catch (error) {
    console.error('[System Monitoring] Error predicting issues:', error)
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }
  }
}

/**
 * Calculate overall system health score (0-100)
 * @param {Object} metrics - System metrics
 * @param {Array} issues - Detected issues
 * @returns {number} Health score
 */
function calculateHealthScore(metrics, issues) {
  let score = 100
  
  // Deduct points for issues
  issues.forEach(issue => {
    if (issue.severity === 'high') score -= 15
    else if (issue.severity === 'medium') score -= 8
    else if (issue.severity === 'low') score -= 3
  })
  
  // Deduct points for high resource usage
  if (metrics.database.cpuUsage > 80) score -= 5
  if (metrics.database.memoryUsage > 80) score -= 5
  if (metrics.api.errorRate > 2) score -= 10
  
  return Math.max(0, Math.min(100, score))
}

/**
 * Get system health status with recommendations
 * @returns {Promise<Object>} Health status
 */
export async function getSystemHealthStatus() {
  const prediction = await predictSystemIssues()
  
  if (!prediction.success) {
    return {
      status: 'unknown',
      message: 'Unable to determine system health',
      score: 0
    }
  }
  
  const { healthScore } = prediction
  
  let status, message, color
  
  if (healthScore >= 90) {
    status = 'excellent'
    message = 'All systems operating optimally'
    color = 'green'
  } else if (healthScore >= 75) {
    status = 'good'
    message = 'System healthy with minor issues'
    color = 'blue'
  } else if (healthScore >= 60) {
    status = 'fair'
    message = 'Some issues detected, monitoring recommended'
    color = 'yellow'
  } else if (healthScore >= 40) {
    status = 'poor'
    message = 'Multiple issues requiring attention'
    color = 'orange'
  } else {
    status = 'critical'
    message = 'Immediate action required'
    color = 'red'
  }
  
  return {
    status,
    message,
    score: healthScore,
    color,
    details: prediction
  }
}

const systemMonitoring = {
  predictSystemIssues,
  getSystemHealthStatus,
  collectSystemMetrics
}

export default systemMonitoring
