//API/MyPoints.js
const UtilJS = require("../../utils/util.js");

// 获取用户信息并提取积分（score）
function getUserProfile(){
  this.setData({ loading: true }); // 设置加载状态
  const authToken = wx.getStorageSync('auth_token')

  wx.request({
    url: `https://mini.makershub.top/api/users/profile`, // 后端接口地址
    header: {
      "Authorization": `Bearer ${authToken}`,
      "Content-Type": "application/json"
    },
    method: "GET",
    success: (res) => {
      if (res.statusCode === 200 && res.data.code === 200) {
        const userScore = res.data.data.score; // 从返回数据中提取积分（score）
        this.setData({
          score: userScore, // 更新积分（score）
          loading: false
        });
      } else {
        this.setData({ loading: false });
        wx.showToast({
          title: "获取积分失败，请稍后重试",
          icon: "none"
        });
      }
    },
    fail: (err) => {
      console.error("获取用户积分失败", err);
      this.setData({ loading: false });
      wx.showToast({
        title: "网络请求失败，请检查网络连接",
        icon: "none"
      });
    }
  });
}

// 获取该用户的兑换历史
function getExchangeHistory(){
  this.setData({ loading: true }); // 设置加载状态为 true，表示正在加载数据
  const authToken = wx.getStorageSync('auth_token')
  // 调用后端接口获取兑换历史
  wx.request({
    url: `https://mini.makershub.top/api/print/history`,
    header: {
      "Authorization": `Bearer ${authToken}`,
      "Content-Type": "application/json"
    },
    method: 'GET', // 使用 GET 方法请求数据
    success: (res) => {
      // 检查响应状态码和返回的数据是否符合预期
      if (res.statusCode === 200 && res.data.code === 200) {
        // 过滤并处理返回的记录
        const records = res.data.data.records
          .filter(record => record.state === 1) // 只保留状态为 1 的记录，即审核通过的兑换成功的记录
          .map(record => {
            // 返回处理后的记录对象
            return {
              apply_id: record.apply_id,
              name: (() => {
                const prefix = record.apply_id.slice(0, 2);
                switch(prefix) {
                  case '3D':
                    return `3D打印`;
                  case 'BG':
                    return '会徽';
                  default:
                    return `其他类型 (${prefix})`; // 可选默认值
                }
              })(),
              time: UtilJS.formatDate(record.created_at),
              details: (() => {
                const prefix = record.apply_id.slice(0, 2); 
                switch(prefix) {
                  case '3D':
                    return `用量: ${record.quantity}g`;
                  case 'BG':
                    return '兑换会徽';
                  default:
                    return `其他类型 (${prefix})`; // 可选默认值
                }
              })(),
              pointsUsed: record.score_change,
              image: '/assets/points/3d_printer.png'
            };
          });

        // 将处理后的记录存储到页面的 data 中
        this.setData({
          history: records, // 更新 history 数据
          loading: false // 设置加载状态为 false，表示加载完成
        });
        
        // 动态加载历史记录的图片
        /*调utils/util.js里面的从minIO获取图片url的函数 */

      } else {
        // 如果接口返回的状态码或数据不符合预期，提示用户
        this.setData({ loading: false }); // 设置加载状态为 false
        wx.showToast({
          title: res.data.message || "获取兑换历史失败，请稍后重试",
          icon: "none"
        });
      }
    },
    fail: (err) => {
      // 如果请求失败，提示用户并记录错误
      console.error("获取兑换历史失败", err);
      this.setData({ loading: false }); // 设置加载状态为 false
      wx.showToast({
        title: "网络请求失败，请检查网络连接",
        icon: "none"
      });
    }
  });
}