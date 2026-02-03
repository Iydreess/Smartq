'use client'

import { cn } from '@/lib/utils'
import { Clock, CheckCircle2 } from 'lucide-react'

/**
 * TimeSlotPicker Component - Interactive time slot selection
 * 
 * @param {object} props - Component props
 * @param {Array<object>} props.timeSlots - Array of time slot objects
 * @param {string} props.selectedTime - Currently selected time
 * @param {Function} props.onTimeSelect - Callback when time is selected
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} TimeSlotPicker component
 */
export function TimeSlotPicker({ 
  timeSlots = [], 
  selectedTime, 
  onTimeSelect,
  className 
}) {
  if (timeSlots.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <Clock className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
        <p className="text-secondary-500 text-sm">
          Please select a date to view available time slots
        </p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Morning slots */}
      {timeSlots.some(slot => slot.period === 'morning') && (
        <div>
          <h4 className="text-sm font-medium text-secondary-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
            Morning (8 AM - 12 PM)
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {timeSlots
              .filter(slot => slot.period === 'morning')
              .map((slot) => (
                <TimeSlotButton
                  key={slot.time}
                  slot={slot}
                  isSelected={selectedTime === slot.time}
                  onSelect={onTimeSelect}
                />
              ))}
          </div>
        </div>
      )}

      {/* Afternoon slots */}
      {timeSlots.some(slot => slot.period === 'afternoon') && (
        <div>
          <h4 className="text-sm font-medium text-secondary-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
            Afternoon (12 PM - 5 PM)
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {timeSlots
              .filter(slot => slot.period === 'afternoon')
              .map((slot) => (
                <TimeSlotButton
                  key={slot.time}
                  slot={slot}
                  isSelected={selectedTime === slot.time}
                  onSelect={onTimeSelect}
                />
              ))}
          </div>
        </div>
      )}

      {/* Evening slots */}
      {timeSlots.some(slot => slot.period === 'evening') && (
        <div>
          <h4 className="text-sm font-medium text-secondary-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
            Evening (5 PM - 8 PM)
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {timeSlots
              .filter(slot => slot.period === 'evening')
              .map((slot) => (
                <TimeSlotButton
                  key={slot.time}
                  slot={slot}
                  isSelected={selectedTime === slot.time}
                  onSelect={onTimeSelect}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * TimeSlotButton - Individual time slot button
 */
function TimeSlotButton({ slot, isSelected, onSelect }) {
  const { time, available, bookedSlots, totalSlots } = slot
  
  const availabilityPercent = totalSlots > 0 ? ((totalSlots - bookedSlots) / totalSlots) * 100 : 100
  
  return (
    <button
      onClick={() => available && onSelect(time)}
      disabled={!available}
      className={cn(
        "relative p-3 rounded-lg text-sm font-medium transition-all duration-200",
        "border-2 flex flex-col items-center justify-center min-h-[60px]",
        // Selected state
        isSelected
          ? "bg-primary-600 text-white border-primary-600 shadow-md scale-105"
          : "",
        // Available state
        available && !isSelected
          ? "bg-white border-secondary-200 text-secondary-900 hover:border-primary-300 hover:bg-primary-50 hover:scale-105"
          : "",
        // Unavailable state
        !available
          ? "bg-secondary-50 border-secondary-200 text-secondary-400 cursor-not-allowed opacity-60"
          : "cursor-pointer"
      )}
      aria-label={`${time} - ${available ? 'Available' : 'Fully booked'}`}
      aria-pressed={isSelected}
    >
      <span className="relative z-10 font-semibold">{time}</span>
      
      {available && !isSelected && (
        <span className="text-xs mt-1 text-secondary-500">
          {availabilityPercent >= 75 && "Many spots"}
          {availabilityPercent < 75 && availabilityPercent >= 25 && "Few spots"}
          {availabilityPercent < 25 && availabilityPercent > 0 && "Last spots"}
        </span>
      )}
      
      {!available && (
        <span className="text-xs mt-1">Full</span>
      )}
      
      {isSelected && (
        <CheckCircle2 className="w-4 h-4 mt-1" />
      )}
    </button>
  )
}
