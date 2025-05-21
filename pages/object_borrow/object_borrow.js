Page({
  data: {
    currentTab: 0,
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

  /* -------- tab -------- */
  switchTab(e) {
    const idx = Number(e.currentTarget.dataset.index);
    if (idx === this.data.currentTab) return;
    this.setData({ currentTab: idx }, this.updateCurrentList);
  },

  /* -------- 排序 -------- */
  toggleSortDropdown() {
    this.setData({ isFolded: !this.data.isFolded });
  },
  selectSort(e) {
    const value = e.currentTarget.dataset.value;
    this.setData({
      currentSort: value,
      sortText: value === 'default' ? '默认' : value === 'asc' ? '正序' : '逆序',
      isFolded: true
    }, this.sortCurrentList);
  },

  /* -------- 列表更新 -------- */
  updateCurrentList() {
    const { currentTab, unreviewedList, approvedList, returnedList } = this.data;
    const list = [unreviewedList, approvedList, returnedList][currentTab] || [];
    this.setData({ currentList: list }, this.sortCurrentList);
  },
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

  /* -------- 添加新记录接口 -------- */
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

  /* -------- 跳转 -------- */
  navigateToDetail(e) {
    wx.navigateTo({ url: `/pages/detail/detail?event_id=${e.currentTarget.dataset.eventId}` });
  },

  /* -------- 页面加载时添加新记录示例 -------- */
  onLoad() {
    this.updateCurrentList();
   }
});
