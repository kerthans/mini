const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}



// 将日期字符串从 "2024-02-13 14:30:00" 转换为 "2023.11.13"
function formatDate(dateString) {
  const date = new Date(dateString); // 解析日期字符串
  const year = date.getFullYear(); // 获取年份
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 获取月份，+1 是因为月份从0开始
  const day = date.getDate().toString().padStart(2, '0'); // 获取日期
  return `${year}.${month}.${day}`; // 按照 "年.月.日" 的格式返回
}

module.exports = {
  formatTime: formatTime,
  getNameFromApplyId: getNameFromApplyId,
  formatDate: formatDate
}
