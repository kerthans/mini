// pages/MyPoints/MyPoints.js
  //注意：
  //1.所有的积分兑换选项除了图片会根据id到数据库中拉取base64（没有拉取成功时，会默认从本地资源路径拉取图片png，例：item.image: /assets/points/3d_printer.png，调用见getResourceImage等函数），其他信息都于本地写好（因为选项相对固定，且长期稳定不变）   
  //2.各个选项以及跳转的申请页面的路径（exchangeUrl）的信息，请在onload函数中的this.setdata中指定，此处由1所述不做api调取。     
  //3.申请界面.zip文件数量限定为1，如有改动，可见uploadFile中count取值    
  //4.申请表中showHelp内容待补充   
  //5.兑换历史界面展示的兑换时间为：2024.02.13格式，由formatDate从create_at:2024-02-13 14:30:00转换而来，具体可调整。（虽然这个函数具体有没有用还没测试过~）详情处还可加上打印机具体信息，详见getExchangeHistory内注释。
  //6.本地图片资源/assets/points/3d_printer.png也可以换成base64绘图。详见：/assets/points/3d_printer内代码。
  //7.目前只设计了3D打印的申请表单，提供的api也是3d_print专属的；如果未来要增加申请表单以及兑换项，将涉及到兑换历史处兑换内容名的匹配，因此设计了getNameFromApplyId函数，根据apply_id的前2字母（暂定），来匹配对应的项目名称（只提供3D打印服务时也可以选择去除该函数，name直接显示“3D打印”），相应的详情部分也要调整（o(╯□╰)o）；可能还会涉及申请表单路径的改变，但此为本地预制（大概吧，摆烂了），详见第2点。
  //8.下列代码未与后端交互调试，待查漏


// pages/MyPoints/MyPoints.js
Page({
  data: {
    score: 0, // 初始化积分数值
    tab: 0, // 默认选中的标签索引
    item: 0, // 当前显示的swiper项
    items: [], // 积分兑换选项列表
    history: [], // 兑换历史记录列表
    loading: true, // 数据加载状态
    error: null, // 错误信息
    userid: '' // 用户ID（邮箱）
  },

  onLoad: function(options) {
    const userid = options.userid; // 从页面参数中获取 userid
    this.setData({ userid });

    // 设置默认的初始信息
    this.setData({
      items: [
        {
          id: 11, //id用于从资源库拉取图片，调用见loadItemImages()等等
          name: '3D打印',
          description: 'xx 积分 / xx g用料',
          exchangeUrl: '/pages/3D/3D',
          image: '/images/my_points/3d_print.png'
        },
        {
          id: 2,
          name: '清洁服务',
          description: '清洁服务，消耗 xx 积分',
          exchangeUrl: '/pages/cleaning/cleaning',
          image: '/images/my_points/3d_print.png'
        },
        {
          id: 33,
          name: '文创兑换',
          description: '这是一段文字。',
          exchangeUrl: '/pages/3D/3D',
          image: '/images/my_points/3d_print.png'
        },
        {
          id: 323,
          name: '神秘盲盒',
          description: '据我所知，我一无所知。',
          exchangeUrl: '/pages/3D/3D',
          image: '/images/my_points/3d_print.png'
        },
        {
          id: 46,
          name: '其他服务',
          description: '床前明月光，疑似明月光。',
          exchangeUrl: '/pages/3D/3D',
          image: '/images/my_points/3d_print.png'
        }
      ],
      history: [
        {
          id: 37,
          name: '3D打印',
          time: '2024.02.13',
          details: '用料量50克',
          pointsUsed: -12,
          image: '/images/my_points/3d_print.png'
        }
      ]
    });

    // 动态加载图片资源
    this.loadItemImages();
    this.loadHistoryImages();

    // 获取用户信息（积分）
    this.getUserProfile(userid);
    // 获取兑换历史记录
    this.getExchangeHistory(userid);
  },

  handlerGobackClick() {
    wx.showModal({
      title: '你点击了返回',
      content: '是否确认放回',
      success: e => {
        if (e.confirm) {
          const pages = getCurrentPages();
          if (pages.length >= 2) {
            wx.navigateBack({
              delta: 1
            });
          } else {
            wx.reLaunch({
              url: '/pages/index/index'
            });
          }
        }
      }
    });
  },
  handlerGohomeClick() {
    wx.reLaunch({
      url: '/pages/index/index'
    });
  },


  // 获取用户信息并提取积分（score），默认0
  getUserProfile: function(userid) {
    this.setData({ loading: true }); // 设置加载状态
    wx.request({
      url: `https://yourserver.com/api/users/profile/${userid}`, // 后端接口地址
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
            title: res.data.message || "获取积分失败，请稍后重试",
            icon: "none"
          });
        }
      },
      fail: (err) => {
        console.error("获取用户信息失败", err);
        this.setData({ loading: false });
        wx.showToast({
          title: "网络请求失败，请检查网络连接",
          icon: "none"
        });
      }
    });
  },

// 将日期字符串从 "2024-02-13 14:30:00" 转换为 "2023.11.13"
formatDate: function(dateString) {
  const date = new Date(dateString); // 解析日期字符串
  const year = date.getFullYear(); // 获取年份
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 获取月份，+1 是因为月份从0开始
  const day = date.getDate().toString().padStart(2, '0'); // 获取日期
  return `${year}.${month}.${day}`; // 按照 "年.月.日" 的格式返回
},

// 根据 apply_id 的前两个字母返回对应的 name （兑换项目名称）
getNameFromApplyId: function(apply_id) {
  const prefix = apply_id.substring(0, 2).toUpperCase(); // 提取前两个字母并转为大写
  let name = ''; // 默认值为空字符串

  switch (prefix) {
    case '3D':
      name = '3D打印';
      break;
    case 'CL':
      name = '清洁服务';
      break;
    // 根据需要继续添加其他前缀的匹配规则
    default:
      name = '未知服务'; // 如果没有匹配到，设置为默认值
  }

  return name;
},

// 获取兑换历史记录
getExchangeHistory: function(userid) {
  this.setData({ loading: true }); // 设置加载状态为 true，表示正在加载数据

  // 调用后端接口获取兑换历史
  wx.request({
    url: `https://yourserver.com/api/3d_print/history/${userid}`, // 后端接口地址，需要替换为实际的接口
    method: "GET", // 使用 GET 方法请求数据
    success: (res) => {
      // 检查响应状态码和返回的数据是否符合预期
      if (res.statusCode === 200 && res.data.code === 200) {
        // 过滤并处理返回的记录
        const records = res.data.data.records
          .filter(record => record.state === 1) // 只保留状态为 1 的记录，即审核通过的兑换成功的记录
          .map(record => {
            // 调用 getNameFromApplyId 函数动态设置 serviceName
            const serviceName = this.getNameFromApplyId(record.apply_id);

            // 返回处理后的记录对象
            return {
              apply_id: record.apply_id, // 申请 ID
              name: serviceName, // 使用函数返回值设置 name
              time: this.formatDate(record.created_at), // 调用 formatDate 方法格式化时间
              details: `用量: ${record.quantity}g`,// 打印机: ${record.printer === 1 ? '二基楼B101' : 'i创街'}`, //可添加
              pointsUsed: record.score_change, // 使用的积分
              image: '/assets/points/3d_printer.png' // 默认图片路径
            };
          });

        // 将处理后的记录存储到页面的 data 中
        this.setData({
          history: records, // 更新 history 数据
          loading: false // 设置加载状态为 false，表示加载完成
        });
        
        // 动态加载历史记录的图片
        this.loadHistoryImages();

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
},


  // 动态加载积分兑换选项的图片资源
  loadItemImages: function() {
    const items = this.data.items;
    items.forEach((item,index) => {
      this.getResourceImage(item.id).then((imageUrl) => {
        this.setData({
          [`items[${index}].image`]: imageUrl // 更新图片路径
        });
      }).catch(() => {
        console.warn(`图片加载失败，使用默认图片: ${item.image}`);
      });
      this.setData({
        [`items[${index}].image`]: item.image // 使用默认图片路径
      });
    });
  },

  // 动态加载兑换历史的图片资源,根据index/get数据顺序排列（？）
  loadHistoryImages: function() {
    const history = this.data.history;
    history.forEach((item,index) => {
      this.getResourceImage(item.id).then((imageUrl) => {
        this.setData({
          [`history[${index}].image`]: imageUrl // 更新图片路径
        });
      }).catch(() => {
        console.warn(`图片加载失败，使用默认图片: ${item.image}`);
      });
    });
  },

  // 获取单个资源图片 （用于动态获取）
  getResourceImage: function(id) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `https://yourserver.com/api/resources/get/${id}`, // 图片资源接口
        method: "GET",
        success: (res) => {
          if (res.statusCode === 200 && res.data.code === 200) {
        
            /*如果后端传来的data64不完整:
            const base64Data = res.data.data.data; // 获取 Base64 编码的图片数据
            const mimeType = res.data.data.filetype; // 获取图片的 MIME 类型
            resolve(`data:${mimeType};base64,${base64Data}`); // 构造 Base64 图片路径*/  
            const imageUrl = res.data.data.data; // 直接使用后端返回的 Base64 数据
          resolve(imageUrl);
          } else {
            reject(res.data.message || "获取图片失败");
          }
        },
        fail: (err) => {
          console.error("获取图片资源失败", err);
          reject("网络请求失败");
        }
      });
    });
  },

   // 切换标签页
   changeItem:function(e){
    const index = parseInt(e.currentTarget.dataset.item);
    this.setData({ tab: index });
  },

 // 切换swiper项
onSwiperChange:function(e){
this.setData({
tab:e.detail.current
})
console.log(this.data.tab)
},

  // 兑换按钮的点击事件
  exchangeItem: function(e) {
    const { userid } = this.data; // 获取当前用户的 userid
    const url = e.currentTarget.dataset.url; // 获取传递的 exchangeUrl

    console.log("Exchange URL:", url); // 调试信息

    if (!url) {
      wx.showToast({
        title: '兑换页面路径错误',
        icon: 'none'
      });
      return;
    }

    // 跳转到兑换页面，并传递 userid
    wx.navigateTo({
      url: `${url}?userid=${userid}`,
      success: () => {
        console.log("页面跳转成功");
      },
      fail: () => {
        console.error("页面跳转失败");
      }
    });
  }
});