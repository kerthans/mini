// test.js
Page({
  data: {
    healthData: null,
    basicData: null
  },

  // 健康检查
  healthCheck() {
    this.requestTest('http://47.109.201.165/health', 'healthData')
  },

  // 基础检查
  basicCheck() {
    this.requestTest('http://47.109.201.165/', 'basicData')
  },

  // test.js - 修改 requestTest 方法
requestTest(url, dataKey) {
  wx.showLoading({ title: '测试中...' })
  console.log('[调试] 请求URL:', url) // 关键日志

  wx.request({
    url: url,
    method: 'GET',
    success: (res) => {
      console.log('[成功响应] 状态码:', res.statusCode)
      this.setData({ [dataKey]: this.formatResponse(res) })
    },
    fail: (err) => {
      console.error('[完整错误信息]', err)
      this.setData({
        [dataKey]: `错误详情:
        - 错误码: ${err.errno || 'N/A'}
        - 错误信息: ${err.errMsg || '未知错误'}
        - 触发URL: ${url}`
      })
    },
    complete: () => wx.hideLoading()
  })
},

  // 格式化响应数据
  formatResponse(res) {
    const template = `
HTTP状态码: ${res.statusCode}
响应头: ${JSON.stringify(res.header, null, 2)}
响应数据: ${JSON.stringify(res.data, null, 2)}
    `
    return template.trim()
  }
})
