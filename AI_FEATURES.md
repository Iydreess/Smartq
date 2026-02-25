# AI Features Guide

This document explains the AI-powered features integrated into Smartq and how to configure them.

## Overview

Smartq now includes two intelligent AI-powered features:

1. **Smart Appointment Scheduling** - AI-powered time slot recommendations
2. **Predictive Maintenance Alerts** - System health monitoring with predictive issue detection

## Features

### 1. Smart Appointment Scheduling

Located in `lib/ai/smartScheduling.js`, this feature analyzes multiple factors to recommend the best appointment times for customers.

#### How It Works

The AI analyzes:
- **Historical booking patterns** - Peak vs. slow hours/days
- **Time of day preferences** - Morning, afternoon, or evening
- **Demand patterns** - High and low-demand periods
- **Customer behavior** - No-show rates, previous bookings
- **Optimal spacing** - Buffer times between appointments

#### Where It's Used

- **Booking Page** (`app/(public)/booking/page.js`)
  - Shows AI recommendations when a customer selects a date
  - Displays top 3 recommended time slots with match scores
  - Provides friendly insights explaining why certain times are better

#### Benefits

- **Better customer experience** - Customers get personalized time recommendations
- **Reduced wait times** - Spreads demand across available slots
- **Higher conversion** - Makes booking decisions easier
- **Optimized scheduling** - Distributes appointments efficiently

### 2. Predictive Maintenance Alerts

Located in `lib/ai/systemMonitoring.js`, this feature monitors system health and predicts potential issues before they become critical.

#### What It Monitors

- **Database Performance**
  - Response times
  - CPU and memory usage
  - Slow queries
  - Connection counts

- **API Performance**
  - Response latency
  - Error rates
  - Timeout rates
  - Active connections

- **Storage**
  - Disk usage
  - Growth rate
  - Days until capacity full

- **Queue Operations**
  - Processing backlog
  - Average wait times
  - Active queues

- **User Engagement**
  - Active users
  - Bounce rates
  - Session metrics

#### Where It's Used

- **Admin Analytics Page** (`app/(admin)/admin/analytics/page.js`)
  - Displays system health score (0-100)
  - Shows predictive alerts for potential issues
  - Lists severity levels (high/medium/low)
  - Provides actionable recommendations
  - Updates automatically every 5 minutes

#### Alert Example

```javascript
{
  type: 'database_slowdown',
  severity: 'high',
  currentValue: 125, // ms
  threshold: 80,
  probability: 0.75, // 75% chance
  estimatedTime: '1-2 days',
  impact: 'Queries taking longer, user experience degradation',
  recommendation: 'Consider database optimization or scaling'
}
```

## Configuration

### Environment Variables

Create or update your `.env.local` file with these optional AI configuration variables:

```env
# OpenAI API Configuration (Optional)
# If not provided, AI features will work with simulated/mock data
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_AI_MODEL=gpt-4
NEXT_PUBLIC_AI_TEMPERATURE=0.7
```

### Getting an OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env.local` file

**Note:** The AI features work without an API key using intelligent mock data. The API key only enables enhanced natural language insights.

## Installation

Install the required dependencies:

```powershell
npm install
```

The `openai` package is already included in `package.json`.

## Usage

### Testing Smart Scheduling

1. Navigate to the booking page: `/booking`
2. Select a service
3. Select a date
4. Watch the AI recommendations appear above the time slots
5. Click on a recommended time or choose any available slot

### Testing Predictive Alerts

1. Navigate to admin analytics: `/admin/analytics`
2. View the system health card at the top
3. Check the health score and any predicted issues
4. Review recommendations for each alert

## Architecture

### File Structure

```
lib/ai/
├── index.js              # Core AI client and utilities
├── smartScheduling.js    # Appointment scheduling logic
└── systemMonitoring.js   # System health monitoring

app/
├── (public)/booking/page.js           # Booking with AI recommendations
└── (admin)/admin/analytics/page.js    # Admin dashboard with health alerts
```

### AI Client (`lib/ai/index.js`)

The central AI module that:
- Manages OpenAI API configuration
- Provides fallback mock responses when API is unavailable
- Handles error gracefully
- Exports utility functions for AI operations

### Smart Scheduling Module

**Scoring Algorithm:**
- Base score: 50 points
- Low-demand times: +15 points
- High-demand times: -10 points
- Preferred time blocks: +20 points (weighted)
- Optimal spacing: +5 points
- Lunch time penalty: -8 points

**Score Interpretation:**
- 80-100: Highly recommended
- 60-79: Good choice
- 40-59: Standard availability
- 0-39: Less optimal

### System Monitoring Module

**Health Score Calculation:**
- Starts at 100 points
- High severity issue: -15 points each
- Medium severity issue: -8 points each
- Low severity issue: -3 points each
- Additional penalties for resource usage

**Health Status:**
- 90-100: Excellent (green)
- 75-89: Good (blue)
- 60-74: Fair (yellow)
- 40-59: Poor (orange)
- 0-39: Critical (red)

## Customization

### Adjusting Scheduling Algorithm

Edit `lib/ai/smartScheduling.js`:

```javascript
// Modify scoring weights
if (patterns.slowHours.includes(hour)) {
  score += 20 // Increase from 15 to give more weight
}

// Add custom business rules
if (isHoliday(selectedDate)) {
  score += 10 // Bonus for holidays
}
```

### Adding Custom Monitoring Metrics

Edit `lib/ai/systemMonitoring.js`:

```javascript
// In collectSystemMetrics()
function collectSystemMetrics() {
  return {
    // ... existing metrics
    customMetric: {
      value: getCustomMetricValue(),
      threshold: 100
    }
  }
}

// In analyzeMetrics()
if (metrics.customMetric.value > threshold) {
  issues.push({
    type: 'custom_alert',
    severity: 'medium',
    // ... alert details
  })
}
```

## Performance Considerations

### Smart Scheduling
- **Impact**: Minimal (~50-100ms per recommendation)
- **Caching**: Results can be cached per date/service
- **Optimization**: Pre-calculate patterns on server side

### System Monitoring
- **Refresh Rate**: Every 5 minutes by default
- **Performance**: Runs asynchronously, doesn't block UI
- **Optimization**: Metrics collection is lightweight

## Future Enhancements

Potential additions to consider:

1. **Machine Learning Integration**
   - Train on historical booking data
   - Improve prediction accuracy over time
   - Personalized recommendations per customer

2. **Advanced Analytics**
   - Customer segment analysis
   - Revenue optimization suggestions
   - Staff performance predictions

3. **Natural Language Queries**
   - "Find me the best time next week"
   - "When is my salon least busy?"
   - Chat-based booking assistant

4. **Automated Actions**
   - Auto-scale resources based on predictions
   - Send preventive maintenance notifications
   - Dynamic pricing adjustments

## Troubleshooting

### AI Recommendations Not Showing

1. **Check browser console** for errors
2. **Verify date selection** - Must select a date first
3. **Check service selection** - Must select a service
4. **Network issues** - Check if API calls are completing

### System Health Not Loading

1. **Check console** for error messages
2. **Verify module imports** - Ensure paths are correct
3. **Check component mounting** - UseEffect should run on mount
4. **API connectivity** - If using OpenAI, verify API key

### Mock Data vs Real AI

If you see "AI response simulated" messages:
- This is normal without an OpenAI API key
- Features still work with intelligent mock data
- Add API key for enhanced natural language insights

## Support

For questions or issues:
- Check the code comments in `lib/ai/*.js`
- Review the console logs for debugging info
- Test with and without the OpenAI API key

## License

These AI features are part of the Smartq project and follow the same MIT license.

---

**Last Updated:** February 18, 2026
