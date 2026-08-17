/**
 * Browser Push Notification & Reminders Engine for TaskFlow.
 */

export class NotificationService {
  static isSupported() {
    return typeof window !== 'undefined' && 'Notification' in window
  }

  static get permission() {
    if (!this.isSupported()) return 'denied'
    return Notification.permission
  }

  static async requestPermission() {
    if (!this.isSupported()) return 'denied'
    if (Notification.permission === 'granted') return 'granted'
    
    try {
      const status = await Notification.requestPermission()
      return status
    } catch (err) {
      console.warn('Could not request notification permission:', err)
      return 'denied'
    }
  }

  static sendNotification(title, options = {}) {
    if (typeof window !== 'undefined' && localStorage.getItem('notifications_enabled') === 'false') {
      return false
    }
    if (!this.isSupported() || Notification.permission !== 'granted') {
      return false
    }

    try {
      const notification = new Notification(title, {
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: options.tag || 'taskflow-notification',
        body: options.body || '',
        ...options
      })

      notification.onclick = () => {
        window.focus()
        if (options.onClick) options.onClick()
        notification.close()
      }

      return notification
    } catch (err) {
      console.warn('Error displaying push notification:', err)
      return false
    }
  }

  /**
   * Check task list for triggered reminders
   */
  static checkReminders(tasksStore) {
    if (typeof window !== 'undefined' && localStorage.getItem('notifications_enabled') === 'false') {
      return
    }
    if (!this.isSupported() || Notification.permission !== 'granted') return

    const nowStr = new Date().toISOString().slice(0, 16) // YYYY-MM-DDTHH:mm

    tasksStore.tasks.forEach(task => {
      if (task.completed || task.reminderTriggered) return

      if (task.reminderAt) {
        // Formats: 'YYYY-MM-DDTHH:mm'
        const taskReminder = task.reminderAt.slice(0, 16)
        if (taskReminder <= nowStr) {
          this.sendNotification(`Task Reminder: ${task.title}`, {
            body: task.description || (task.dueDate ? `Due on ${task.dueDate}` : 'Reminder from TaskFlow'),
            tag: `reminder-${task.id}`
          })

          tasksStore.updateTask(task.id, { reminderTriggered: true })
        }
      }
    })
  }
}
