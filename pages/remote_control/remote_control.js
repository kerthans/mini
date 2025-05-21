Page({
  data: {
    rooms: [
      { name: '二基楼B101', online: true },
      { name: 'i创街工坊', online: false }
    ]
  },

  toggleStatus(e) {
    const index = e.currentTarget.dataset.index;
    const updated = this.data.rooms;
    updated[index].online = !updated[index].online;
    this.setData({ rooms: updated });
  }
});
