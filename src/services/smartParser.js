/**
 * Smart Natural Language Parser for Quick Task Entry.
 * Parses input strings to extract due dates, priorities, tags, and subtasks.
 *
 * Example:
 * "Submit final project report tomorrow @urgent #school !Outline slides !Review code"
 */
export function parseTaskInput(rawText = '') {
  if (!rawText || !rawText.trim()) {
    return {
      title: '',
      dueDate: '',
      priority: 'medium',
      tags: [],
      subtasks: []
    }
  }

  let text = rawText
  let priority = 'medium'
  const tags = []
  const subtasks = []
  let dueDate = ''

  // 1. Extract Priority (@urgent, @high, @medium, @low)
  const priorityMatch = text.match(/@(urgent|high|medium|low)\b/i)
  if (priorityMatch) {
    priority = priorityMatch[1].toLowerCase()
    text = text.replace(priorityMatch[0], '')
  }

  // 2. Extract Tags (#work, #personal, etc.)
  const tagMatches = text.matchAll(/#([a-zA-Z0-9_-]+)/g)
  for (const match of tagMatches) {
    tags.push(match[1].toLowerCase())
  }
  text = text.replace(/#([a-zA-Z0-9_-]+)/g, '')

  // 3. Extract Subtasks (!Subtask 1)
  const subtaskMatches = text.matchAll(/!([^!@#]+)/g)
  for (const match of subtaskMatches) {
    const subTitle = match[1].trim()
    if (subTitle) {
      subtasks.push({
        id: `sub-${Math.random().toString(36).substr(2, 6)}`,
        title: subTitle,
        completed: false
      })
    }
  }
  text = text.replace(/!([^!@#]+)/g, '')

  // 4. Extract Smart Dates (today, tomorrow, next week, monday-sunday)
  const lowerText = text.toLowerCase()
  const todayDate = new Date()

  const formatDate = (d) => d.toLocaleDateString('en-CA')

  if (/\b(today)\b/i.test(lowerText)) {
    dueDate = formatDate(todayDate)
    text = text.replace(/\b(today)\b/gi, '')
  } else if (/\b(tomorrow)\b/i.test(lowerText)) {
    const tom = new Date(todayDate)
    tom.setDate(tom.getDate() + 1)
    dueDate = formatDate(tom)
    text = text.replace(/\b(tomorrow)\b/gi, '')
  } else if (/\b(next week)\b/i.test(lowerText)) {
    const nextWk = new Date(todayDate)
    nextWk.setDate(nextWk.getDate() + 7)
    dueDate = formatDate(nextWk)
    text = text.replace(/\b(next week)\b/gi, '')
  } else {
    // Check weekday names (e.g. on monday)
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    for (let i = 0; i < days.length; i++) {
      const reg = new RegExp(`\\b(on |this |next )?(${days[i]})\b`, 'i')
      if (reg.test(text)) {
        const targetDay = i
        const currentDay = todayDate.getDay()
        let distance = targetDay - currentDay
        if (distance <= 0) distance += 7
        const dayDate = new Date(todayDate)
        dayDate.setDate(dayDate.getDate() + distance)
        dueDate = formatDate(dayDate)
        text = text.replace(reg, '')
        break
      }
    }
  }

  // Clean up extra spaces in remaining title
  const title = text.replace(/\s+/g, ' ').trim()

  return {
    title: title || rawText.trim(),
    dueDate,
    priority,
    tags: Array.from(new Set(tags)),
    subtasks
  }
}
