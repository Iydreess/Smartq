'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Calendar Component - Interactive date picker with availability
 * 
 * @param {object} props - Component props
 * @param {Date} props.selectedDate - Currently selected date
 * @param {Function} props.onDateSelect - Callback when date is selected
 * @param {Date} props.minDate - Minimum selectable date
 * @param {Date} props.maxDate - Maximum selectable date
 * @param {Array<string>} props.disabledDates - Array of disabled date strings (YYYY-MM-DD)
 * @param {Array<string>} props.bookedDates - Array of fully booked date strings (YYYY-MM-DD)
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Calendar component
 */
export function Calendar({ 
  selectedDate, 
  onDateSelect, 
  minDate = new Date(),
  maxDate,
  disabledDates = [],
  bookedDates = [],
  className 
}) {
  const [currentMonth, setCurrentMonth] = useState(() => selectedDate || new Date())

  // Get calendar data
  const calendarData = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    
    // First day of month
    const firstDay = new Date(year, month, 1)
    // Last day of month
    const lastDay = new Date(year, month + 1, 0)
    
    // Days in month
    const daysInMonth = lastDay.getDate()
    
    // Start day of week (0 = Sunday)
    const startDay = firstDay.getDay()
    
    // Previous month's last days to fill the grid
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    const prevMonthDays = []
    for (let i = startDay - 1; i >= 0; i--) {
      prevMonthDays.push({
        date: prevMonthLastDay - i,
        isCurrentMonth: false,
        isPrevMonth: true,
        fullDate: new Date(year, month - 1, prevMonthLastDay - i)
      })
    }
    
    // Current month days
    const currentMonthDays = []
    for (let i = 1; i <= daysInMonth; i++) {
      currentMonthDays.push({
        date: i,
        isCurrentMonth: true,
        fullDate: new Date(year, month, i)
      })
    }
    
    // Next month days to fill the grid
    const totalCells = prevMonthDays.length + currentMonthDays.length
    const nextMonthDays = []
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7)
    for (let i = 1; i <= remainingCells; i++) {
      nextMonthDays.push({
        date: i,
        isCurrentMonth: false,
        isNextMonth: true,
        fullDate: new Date(year, month + 1, i)
      })
    }
    
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays]
  }, [currentMonth])

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const isDateDisabled = (date) => {
    const dateString = date.toISOString().split('T')[0]
    
    // Check if before min date
    if (minDate && date < minDate) return true
    
    // Check if after max date
    if (maxDate && date > maxDate) return true
    
    // Check if in disabled dates
    if (disabledDates.includes(dateString)) return true
    
    // Check if weekend (optional - can be configured)
    // const dayOfWeek = date.getDay()
    // if (dayOfWeek === 0 || dayOfWeek === 6) return true
    
    return false
  }

  const isDateBooked = (date) => {
    const dateString = date.toISOString().split('T')[0]
    return bookedDates.includes(dateString)
  }

  const isDateSelected = (date) => {
    if (!selectedDate) return false
    return date.toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0]
  }

  const isToday = (date) => {
    const today = new Date()
    return date.toISOString().split('T')[0] === today.toISOString().split('T')[0]
  }

  const handleDateClick = (day) => {
    if (!day.isCurrentMonth || isDateDisabled(day.fullDate)) return
    onDateSelect(day.fullDate)
  }

  return (
    <div className={cn("bg-white rounded-xl border border-secondary-200 p-6 w-full max-w-md mx-auto", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-6 h-6 text-secondary-600" />
        </button>
        
        <h3 className="text-xl font-bold text-secondary-900 min-w-[200px] text-center">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        
        <button
          type="button"
          onClick={goToNextMonth}
          className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-6 h-6 text-secondary-600" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-secondary-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarData.map((day, index) => {
          const disabled = isDateDisabled(day.fullDate)
          const booked = isDateBooked(day.fullDate)
          const selected = isDateSelected(day.fullDate)
          const today = isToday(day.fullDate)

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleDateClick(day)}
              disabled={disabled || !day.isCurrentMonth}
              className={cn(
                "relative aspect-square p-2 text-base font-medium rounded-lg transition-all duration-200",
                // Base styles
                day.isCurrentMonth
                  ? "text-secondary-900"
                  : "text-secondary-400",
                // Disabled state
                disabled && day.isCurrentMonth
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-pointer",
                // Today indicator
                today && day.isCurrentMonth && !selected
                  ? "bg-primary-50 font-semibold text-primary-700"
                  : "",
                // Selected state
                selected && day.isCurrentMonth
                  ? "bg-primary-600 text-white font-semibold shadow-md hover:bg-primary-700"
                  : "",
                // Hover state
                !disabled && !selected && day.isCurrentMonth
                  ? "hover:bg-secondary-100 hover:scale-105"
                  : "",
                // Booked indicator
                booked && !selected && day.isCurrentMonth
                  ? "bg-warning-50 text-warning-700"
                  : ""
              )}
              aria-label={`Select ${day.fullDate.toDateString()}`}
              aria-pressed={selected}
            >
              <span className="relative z-10">{day.date}</span>
              
              {/* Availability indicator dots */}
              {day.isCurrentMonth && !disabled && !selected && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                  {booked ? (
                    <div className="w-1 h-1 rounded-full bg-warning-500" />
                  ) : (
                    <div className="w-1 h-1 rounded-full bg-primary-400" />
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-secondary-200 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-primary-600" />
          <span className="text-secondary-600">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-primary-50 border border-primary-200" />
          <span className="text-secondary-600">Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-warning-50 border border-warning-200" />
          <span className="text-secondary-600">Limited slots</span>
        </div>
      </div>
    </div>
  )
}
