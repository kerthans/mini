// pages/FieldApply/FieldApply.js
Page({
  data: {
    tab: 0, // 用于切换显示哪一类申请
    currentTab: 0, // 三个标签页：未审核、已通过、已归还
    sortText: '默认',
    currentSort: 'default',
    isFolded: true,

    unreviewedList: [
      { event_id: 1, event_name: '三架', start_str: '申请时间', start_time: '2025-05-20', type:'个人', poster: '/images/tripod.png' },
      { event_id: 2, event_name: '音响', start_str: '申请时间', start_time: '2025-05-18', type:'个人', poster: '/images/speaker.png' }
    ],
    approvedList: [],
    returnedList: [],
    currentList: []
  },

  onLoad() {
    this.updateCurrentList();
  },

  handlerGobackClick() {
    wx.showModal({
      title: '你点击了返回',
      content: '是否确认返回',
      success: e => {
        if (e.confirm) {
          const pages = getCurrentPages();
          if (pages.length >= 2) {
            wx.navigateBack({ delta: 1 });
          } else {
            wx.reLaunch({ url: '/pages/index/index' });
          }
        }
      }
    });
  },

  handlerGohomeClick() {
    wx.reLaunch({ url: '/pages/index/index' });
  },

  // 切换顶部标签栏（积分兑换 vs 场地处理）
  changeItem(e) {
    const index = parseInt(e.currentTarget.dataset.item);
    this.setData({ tab: index });
  },

  // swiper 切换同步 tab
  onSwiperChange(e) {
    this.setData({ tab: e.detail.current });
  },

  // 切换子 tab（三个状态）
  switchTab(e) {
    const idx = Number(e.currentTarget.dataset.index);
    if (idx === this.data.currentTab) return;
    this.setData({ currentTab: idx }, this.updateCurrentList);
  },

  // 排序按钮点击
  toggleSortDropdown() {
    this.setData({ isFolded: !this.data.isFolded });
  },

  // 选择排序方式
  selectSort(e) {
    const value = e.currentTarget.dataset.value;
    this.setData({
      currentSort: value,
      sortText: value === 'default' ? '默认' : value === 'asc' ? '正序' : '逆序',
      isFolded: true
    }, this.sortCurrentList);
  },

  // 根据 tab 更新显示的记录列表
  updateCurrentList() {
    const { currentTab, unreviewedList, approvedList, returnedList } = this.data;
    const list = [unreviewedList, approvedList, returnedList][currentTab] || [];
    this.setData({ currentList: list }, this.sortCurrentList);
  },

  // 排序当前列表
  sortCurrentList() {
    const { currentSort, currentList } = this.data;
    if (currentSort === 'default') return;
    const sorted = [...currentList].sort((a, b) =>
      currentSort === 'asc'
        ? a.start_time.localeCompare(b.start_time)
        : b.start_time.localeCompare(a.start_time)
    );
    this.setData({ currentList: sorted });
  },

  // 添加新申请记录
  addRecordToList(newRecord, targetListName = 'unreviewedList') {
    const oldList = this.data[targetListName];
    const updatedList = [...oldList, newRecord];

    this.setData({ [targetListName]: updatedList }, () => {
      if (
        (targetListName === 'unreviewedList' && this.data.currentTab === 0) ||
        (targetListName === 'approvedList' && this.data.currentTab === 1) ||
        (targetListName === 'returnedList' && this.data.currentTab === 2)
      ) {
        this.updateCurrentList();
      }
    });
  },

  // 跳转到申请详情页
  navigateToDetail(e) {
    wx.navigateTo({ url: `/pages/site_borrow_permit/site_borrow_permit?event_id=${e.currentTarget.dataset.eventId}` });
  }
});