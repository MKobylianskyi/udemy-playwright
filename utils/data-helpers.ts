export function removeSpaces(string) {
  return string.replace(/\s+/g, '')
}
export function getCurrentTimeFormated(hoursInFuture) {
  let time = new Date()
  let hour = time.getHours() + hoursInFuture
  if (hour > 23) {
    hour = hour / 24
  }
  let minute = time.getMinutes()
  if (minute % 15 != 0) {
    if (Math.floor(minute / 15) == 0) {
      minute = 0
    }
    if (Math.floor(minute / 15) == 1) {
      minute = 15
    }
    if (Math.floor(minute / 15) == 2) {
      minute = 30
    }
    if (Math.floor(minute / 15) == 3) {
      minute = 45
    }
  }

  let devider
  if (minute < 10) {
    devider = ':0'
  } else {
    devider = ':'
  }
  return hour.toString() + devider + minute.toString()
}

export function mapCurrencyWithIndex(currency) {
  switch (currency) {
    case '$ (AUD)': {
      return 1
    }
    case 'Fr. (CHF)': {
      return 2
    }
    case '€ (EUR)': {
      return 3
    }
    case '£ (GBP)': {
      return 4
    }
    case '¥ (JPY)': {
      return 5
    }
    default: {
      return 6
    }
  }
}

export function formatDate(option: string, { dd, mm, yyyy }) {
  let apendix = 'th'
  if (dd[1] == '1') {
    apendix = 'st'
  }
  if (dd[1] == '2') {
    apendix = 'nd'
  }
  if (dd[1] == '3') {
    apendix = 'rd'
  }
  let month
  switch (mm) {
    case '01': {
      month = 'January'
      break
    }
    case '02': {
      month = 'February'
      break
    }
    case '03': {
      month = 'March'
      break
    }
    case '04': {
      month = 'April'
      break
    }
    case '05': {
      month = 'May'
      break
    }
    case '06': {
      month = 'June'
      break
    }
    case '07': {
      month = 'July'
      break
    }
    case '08': {
      month = 'August'
      break
    }
    case '09': {
      month = 'September'
      break
    }
    case '10': {
      month = 'October'
      break
    }
    case '11': {
      month = 'November'
      break
    }
    case '12': {
      month = 'December'
      break
    }
    default: {
      month = 'not found'
      break
    }
  }
  if (option == 'datepicker') {
    return dd + apendix + ' ' + month + ' ' + yyyy
  } else {
    if (dd[0] == '0') {
      dd = dd.substring(1)
    }
    return dd + ' ' + month + ' ' + yyyy
  }
}

export function getCurrentDay() {
  let today = new Date()
  let dd = String(today.getDate()).padStart(2, '0')
  let mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
  let yyyy = today.getFullYear()
  let date: string
  date = formatDate('default', { dd, mm, yyyy })
  return date
}
export function getCurrentDayForDatepicker() {
  let today = new Date()
  let dd = String(today.getDate()).padStart(2, '0')
  let mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
  let yyyy = today.getFullYear()
  let date: string
  date = formatDate('datepicker', { dd, mm, yyyy })
  return date
}
