const crypto = require('crypto')

export function getRandomNumber(max) {
  return Math.floor(Math.random() * max + 1)
}

export function getRandomString(length) {
  return crypto.randomBytes(length).toString('hex')
}

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

export function formatDateForDatePicker(dd, mm, yyyy) {
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
  return dd + apendix + ' ' + month + ' ' + yyyy
}

export function getCurrentDay() {
  let today = new Date()
  let dd = String(today.getDate()).padStart(2, '0')
  let mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
  let yyyy = today.getFullYear()
  let date: string
  date = formatDateForDatePicker(dd, mm, yyyy)
  return date
}
