// test.js
Page({
  data: {
    result: '',
    url: 'https://mini.makershub.top/health',
    testUrl: 'https://httpbin.org/get', // 公共测试API
    logs: []
  },

  // 记录日志
  log(message) {
    const logs = this.data.logs;
    logs.unshift(message);
    if (logs.length > 5) logs.pop();
    this.setData({ logs });
    console.log(message);
  },

  // 测试您的API
  testYourAPI() {
    this.log(`测试API: ${this.data.url}`);
    this.request(this.data.url);
  },

  // 测试公共API (用于对比)
  testPublicAPI() {
    this.log(`测试公共API: ${this.data.testUrl}`);
    this.request(this.data.testUrl);
  },

  // 测试HTTP版本
  testHTTP() {
    const httpUrl = this.data.url.replace('https://', 'http://');
    this.log(`测试HTTP: ${httpUrl}`);
    this.request(httpUrl);
  },

  // 通用请求方法
  request(url) {
    this.setData({ result: '请求中...' });
    
    wx.request({
      url: url,
      timeout: 10000,
      success: (res) => {
        this.log(`✓ 请求成功: ${res.statusCode}`);
        this.setData({
          result: `成功! 状态码: ${res.statusCode}\n\n${JSON.stringify(res.data, null, 2)}`
        });
      },
      fail: (err) => {
        this.log(`✗ 请求失败: ${err.errMsg}`);
        this.setData({
          result: `错误: ${err.errMsg}\n\n${this.getErrorSolution(err.errMsg)}`
        });
      }
    });
  },

  // 获取错误解决方案
  getErrorSolution(errMsg) {
    if (errMsg.includes('reset')) {
      return `CONNECTION_RESET错误原因:\n
1. 服务器防火墙拦截了请求
2. Nginx配置问题导致连接重置
3. 后端服务不支持当前请求方式
4. SSL证书配置问题\n
如果公共API能正常访问但您的API失败，
问题几乎肯定在服务器端。`;
    }
    
    return '未知错误';
  }
});