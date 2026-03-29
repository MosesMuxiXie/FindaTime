Page({
  data: {
    meetingId: '',
    meeting: null,
    timeSlots: [],
    participants: []
  },

  onLoad(options) {
    const { meetingId, fromHistory } = options;
    this.setData({ meetingId });
    this.loadMeeting(meetingId);

    // 如果是从历史记录进入，显示提示
    if (fromHistory) {
      wx.showToast({
        title: '查看历史会面结果',
        icon: 'none',
        duration: 1500
      });
    }
  },

  loadMeeting(meetingId) {
    try {
      const meetings = wx.getStorageSync('meetings') || [];
      const meeting = meetings.find(m => m.id === meetingId);
      
      if (meeting) {
        console.log('加载的会面数据:', meeting);
        console.log('时间段:', meeting.timeSlots);
        console.log('参与者:', meeting.participants);

        // 处理参与者数据，确保 selectedSlots 是数组
        const processedParticipants = (meeting.participants || []).map(p => {
          let slots = p.selectedSlots || [];
          // 如果是字符串，转换为数组
          if (typeof slots === 'string') {
            slots = slots.split(',').filter(s => s.trim());
          }
          return {
            ...p,
            selectedSlots: slots
          };
        });

        console.log('处理后的参与者:', processedParticipants);

        this.setData({
          meeting,
          timeSlots: meeting.timeSlots || [],
          participants: processedParticipants
        });
      } else {
        wx.showToast({
          title: '会面不存在',
          icon: 'none'
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    } catch (e) {
      console.error('加载会面失败', e);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  onConfirm() {
    // 标记会面为已完成
    try {
      const { meetingId } = this.data;
      const meetings = wx.getStorageSync('meetings') || [];
      const meetingIndex = meetings.findIndex(m => m.id === meetingId);
      
      if (meetingIndex !== -1) {
        meetings[meetingIndex].completed = true;
        wx.setStorageSync('meetings', meetings);
      }

      // 返回首页
      wx.reLaunch({
        url: '/pages/index/index'
      });
    } catch (e) {
      console.error('更新会面状态失败', e);
      wx.showToast({
        title: '操作失败',
        icon: 'none'
      });
    }
  }
});
