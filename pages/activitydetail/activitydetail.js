Page({
  data: {
    apiData: {
      event_id: 11,
      event_name: "活动名称",
      poster: "/images/activitydetail/api.jpg",
      description: "社团成员",
      location: "location",
      link: "link",
      start_time: "start_time",
      end_time: "end_time",
      registration_deadline: "2025-1-24"
    }
  },

  onLoad() {
    this.getDataFromAPI();
  },

  getDataFromAPI() {
    wx.request({
      url: "/api/events/view",  // 后端给的地址
      method: "GET",
      header: {
        "content-type": "application/json"
      },
      success: (res) => {
        if (res.data.code === 200) {
          console.log("获取数据成功：", res.data.data);
          const data = res.data.data;
          // 拼接正确路径
          data.poster = `/images/activitydetail/${data.poster}`;
          this.setData({
            apiData: res.data.data
          });
        } else {
          wx.showToast({
            title: res.data.message || "获取活动详情失败",
            icon: "none"
          });
        }
      },
      fail: (err) => {
        console.error("请求失败：", err);
        wx.showToast({
          title: "请求失败",
          icon: "none"
        });
      }
    });
  },


  copyLink() {
    wx.setClipboardData({
      data: this.data.apiData.link,
      success() {
        wx.showToast({
          title: "复制成功",
          icon: "success"
        });
      }
    });
  }
});
