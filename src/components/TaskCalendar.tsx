import type React from "react"
import type { Task } from "@/types"

interface TaskCalendarProps {
  tasks: Task[]
}

const TaskCalendar: React.FC<TaskCalendarProps> = ({ tasks }) => {
  // This is a simplified calendar view. You might want to use a library like react-big-calendar for a more robust solution.
  const today = new Date()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <div className="mb-4 p-4 bg-gray-700 shadow rounded">
      <h2 className="text-xl font-bold mb-2">Task Calendar</h2>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const date = new Date(today.getFullYear(), today.getMonth(), day)
          const dayTasks = tasks.filter((task) => new Date(task.dueDate).toDateString() === date.toDateString())
          return (
            <div key={day} className="p-2 border text-center">
              <div>{day}</div>
              {dayTasks.map((task) => (
                <div key={task.id} className="text-xs truncate">
                  {task.title}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TaskCalendar

