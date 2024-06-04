function calculateAge(date: Date) {
  var ageDifMs = Date.now() - date.getTime()
  var ageDate = new Date(ageDifMs)
  return Math.abs(ageDate.getUTCFullYear() - 1970)
}

function monthDiff(d1: Date) {
  var months
  months = (new Date(Date.now()).getFullYear() - d1.getFullYear()) * 12
  months -= d1.getMonth()
  months += new Date(Date.now()).getMonth()
  return months <= 0 ? 0 : months
}

const isSameDay = (date: string) => {
  const updatedAt = new Date(date)
  
  const diffTime =  Math.abs(Date.now() - updatedAt.getTime())
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

  return diffDays === 0
}

const timeLeft = (date: string) => {
  const updatedAt = new Date(date)
  const diffYears = calculateAge(updatedAt)
  
  if (diffYears === 1) {
    return "last year"
  } else if (diffYears > 1) {
    return `${diffYears} years ago`
  }

  const diffMonths = monthDiff(updatedAt) 
  if (diffMonths === 1) {
    return `last month`
  } else if (diffMonths > 1) {
    return `${diffMonths} months ago`
  }

  const diffTime =  Math.abs(Date.now() - updatedAt.getTime())
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return "today"
  } else if (diffDays === 1) {
    return "yesterday"
  } else if (diffDays > 1 && diffDays < 7) {
    return `${diffDays} days ago`
  } else if (diffDays >= 7) {
    const weekDiff = Math.floor(diffDays / 7)
    if (weekDiff === 1) {
      return `last week`
    } else if (weekDiff < 5) {
      return `${weekDiff} weeks ago`
    }
  }

  console.log("unintended dunreachable code")
  return "server error"
}

const showFormattedDate = (date: any) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }

  return new Date(date).toLocaleDateString("en-EN", options)
}

export { isSameDay, timeLeft, showFormattedDate }
