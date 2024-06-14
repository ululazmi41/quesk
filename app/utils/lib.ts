function getToken(cookie: string): { token: string, success: boolean } {
  if (cookie === '') {
    return { token: '', success: false }
  }
  if (!cookie.includes('token=')) {
    return { token: '', success: false }
  }

  const token = cookie
    .split('; ')
    .find((r) => r.startsWith('token='))
    ?.split('=')[1]!
  return { token, success: true }
}

function calculateAge(date: Date) {
  if (date.getTime() >= Date.now()) {
    return 0
  }

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

  const diffTime = Math.abs(Date.now() - updatedAt.getTime())
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

  return diffDays === 0
}

const timeLeft = (date: string, locale: string) => {
  const updatedAt = new Date(date)
  const diffYears = calculateAge(updatedAt)

  if (locale !== 'en' && locale !== 'id') {
      console.log(`lib: unhandled locale: ${locale}, locale set to 'en'`)
      locale = 'en'
  }

  if (diffYears === 1) {
    if (locale === 'en') {
      return 'last year'
    } else if (locale === 'id') {
      return `${diffYears} tahun lalu`
    }
  } else if (diffYears > 1) {
    if (locale === 'en') {
      return `${diffYears} years ago`
    } else if (locale === 'id') {
      return `${diffYears} tahun lalu`
    }
  }

  const diffMonths = monthDiff(updatedAt)
  if (diffMonths === 1) {
    if (locale === 'en') {
      return 'last month'
    } else if (locale === 'id') {
      return `${diffMonths} bulan lalu`
    }
  } else if (diffMonths > 1) {
    if (locale === 'en') {
      return `${diffMonths} months ago`
    } else if (locale === 'id') {
      return `${diffMonths} bulan lalu`
    }
  }

  const diffTime = Math.abs(Date.now() - updatedAt.getTime())
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    if (locale === 'en') {
      return 'today'
    } else if (locale === 'id') {
      return `hari ini`
    }
  } else if (diffDays === 1) {
    if (locale === 'en') {
      return 'yesterday'
    } else if (locale === 'id') {
      return `kemarin`
    }
  } else if (diffDays > 1 && diffDays < 7) {
    if (locale === 'en') {
      return `${diffDays} days ago`
    } else if (locale === 'id') {
      return `${diffDays} hari lalu`
    }
  } else if (diffDays >= 7) {
    const weekDiff = Math.floor(diffDays / 7)
    if (weekDiff === 1) {
      if (locale === 'en') {
        return `last week`
      } else if (locale === 'id') {
        return `${weekDiff} minggu lalu`
      }
    } else if (weekDiff < 5) {
      if (locale === 'en') {
        return `${weekDiff} weeks ago`
      } else if (locale === 'id') {
        return `${weekDiff} minggu lalu`
      }
    }
  }

  console.error('lib: Unintended unreachable code')
  return 'server error'
}

const showFormattedDate = (date: any, locale: string) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  return new Date(date).toLocaleDateString(locale === 'en' ? 'en-EN' : 'id-ID', options)
}

export { getToken, isSameDay, timeLeft, showFormattedDate }
