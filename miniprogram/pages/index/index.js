Page({
  data: {
    meetingList: []
  },

  onLoad() {
    this.loadMeetings();
  },

  onShow() {
    this.loadMeetings();
  },

  loadMeetings() {
    try {
      const meetings = wx.getStorageSync('meetings') || [];
      // 只取前三次创建的会面
      const recentMeetings = meetings.slice(0, 3);
      this.setData({
        meetingList: recentMeetings
      });
    } catch (e) {
      console.error('加载会面列表失败', e);
    }
  },

  onMeetingTap(e) {
    const meetingId = e.currentTarget.dataset.id;
    try {
      const meetings = wx.getStorageSync('meetings') || [];
      const meeting = meetings.find(m => m.id === meetingId);
      
      if (meeting) {
        // 检查是否已完成时间选择
        if (meeting.timeSlots && meeting.timeSlots.length > 0) {
          // 直接跳转到结果页
          wx.navigateTo({
            url: `/pages/result/result?meetingId=${meetingId}&fromHistory=true`
          });
        } else {
          // 跳转到确认时间页
          wx.navigateTo({
            url: `/pages/confirm-time/confirm-time?meetingId=${meetingId}`
          });
        }
      }
    } catch (e) {
      console.error('打开会面失败', e);
      wx.showToast({
        title: '打开失败',
        icon: 'none'
      });
    }
  },

  onCreateNew() {
    wx.navigateTo({
      url: '/pages/create/create'
    });
  }
});
