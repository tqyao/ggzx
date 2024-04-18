export const getTimePeriod = () => {
  const h = new Date().getHours()
  let message = ''
  if (h <= 9) {
    message = '早上'
  } else if (h <= 14) {
    message = '上午'
  } else if (h <= 18) {
    message = '下午'
  } else {
    message = '晚上'
  }
  return message
}
