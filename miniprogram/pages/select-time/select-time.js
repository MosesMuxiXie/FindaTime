Page({
  data: {
    meetingId: '',
    meeting: null,
    dateRange: [[], [], []],
    date2Index: [0, 0, 0],
    date3Index: [0, 0, 0],
    date4Index: [0, 0, 0],
    selectedDate2: '',
    selectedDate3: '',
    selectedDate4: '',
    startTime2: '',
    startTime3: '',
    startTime4: '',
    endTime2: '',
    endTime3: '',
    endTime4: ''
  },

  onLoad(options) {
    const { meetingId } = options;
    this.setData({ meetingId });
    this.loadMeeting(meetingId);
    this.initDateRange();
  },

  loadMeeting(meetingId) {
    try {
      const meetings = wx.getStorageSync('meetings') || [];
      const meeting = meetings.find(m => m.id === meetingId);
      
      if (meeting) {
        this.setData({ meeting });
      }
    } catch (e) {
      console.error('加载会面失败', e);
    }
  },

  initDateRange() {
    const now = new Date();
    const years = [];
    const months = [];
    const days = [];

    for (let i = now.getFullYear(); i <= now.getFullYear() + 10; i++) {
      years.push({ label: i + '年', value: i });
    }

    for (let i = 1; i <= 12; i++) {
      months.push({ label: i + '月', value: i });
    }

    for (let i = 1; i <= 31; i++) {
      days.push({ label: i + '日', value: i });
    }

    this.setData({
      dateRange: [years, months, days],
      date2Index: [0, now.getMonth(), now.getDate() - 1],
      date3Index: [0, now.getMonth(), now.getDate() - 1],
      date4Index: [0, now.getMonth(), now.getDate() - 1]
    });
  },

  onDate2Change(e) {
    const index = e.detail.value;
    const dateRange = this.data.dateRange;
    const year = dateRange[0][index[0]].value;
    const month = dateRange[1][index[1]].value;
    const day = dateRange[2][index[2]].value;

    this.setData({
      date2Index: index,
      selectedDate2: `${year}年${month}月${day}日`
    });
  },

  onStartTime2Change(e) {
    this.setData({ startTime2: e.detail.value });
  },

  onEndTime2Change(e) {
    this.setData({ endTime2: e.detail.value });
  },

  onDate3Change(e) {
    const index = e.detail.value;
    const dateRange = this.data.dateRange;
    const year = dateRange[0][index[0]].value;
    const month = dateRange[1][index[1]].value;
    const day = dateRange[2][index[2]].value;

    this.setData({
      date3Index: index,
      selectedDate3: `${year}年${month}月${day}日`
    });
  },

  onStartTime3Change(e) {
    this.setData({ startTime3: e.detail.value });
  },

  onEndTime3Change(e) {
    this.setData({ endTime3: e.detail.value });
  },

  onDate4Change(e) {
    const index = e.detail.value;
    const dateRange = this.data.dateRange;
    const year = dateRange[0][index[0]].value;
    const month = dateRange[1][index[1]].value;
    const day = dateRange[2][index[2]].value;

    this.setData({
      date4Index: index,
      selectedDate4: `${year}年${month}月${day}日`
    });
  },

  onStartTime4Change(e) {
    this.setData({ startTime4: e.detail.value });
  },

  onEndTime4Change(e) {
    this.setData({ endTime4: e.detail.value });
  },

  onSubmit() {
    const { meeting, selectedDate2, startTime2, endTime2, selectedDate3, startTime3, endTime3, selectedDate4, startTime4, endTime4 } = this.data;

    // 构建时间段数组
    const timeSlots = [
      {
        id: 'time1',
        date: meeting.date,
        startTime: meeting.startTime,
        endTime: meeting.endTime,
        fullTime: `${meeting.date} ${meeting.startTime}-${meeting.endTime}`
      }
    ];

    // 添加选填的时间段
    if (selectedDate2 && startTime2 && endTime2) {
      timeSlots.push({
        id: 'time2',
        date: selectedDate2,
        startTime: startTime2,
        endTime: endTime2,
        fullTime: `${selectedDate2} ${startTime2}-${endTime2}`
      });
    }

    if (selectedDate3 && startTime3 && endTime3) {
      timeSlots.push({
        id: 'time3',
        date: selectedDate3,
        startTime: startTime3,
        endTime: endTime3,
        fullTime: `${selectedDate3} ${startTime3}-${endTime3}`
      });
    }

    if (selectedDate4 && startTime4 && endTime4) {
      timeSlots.push({
        id: 'time4',
        date: selectedDate4,
        startTime: startTime4,
        endTime: endTime4,
        fullTime: `${selectedDate4} ${startTime4}-${endTime4}`
      });
    }

    try {
      // 更新会面信息
      const meetings = wx.getStorageSync('meetings') || [];
      const meetingIndex = meetings.findIndex(m => m.id === meeting.id);
      
      if (meetingIndex !== -1) {
        meetings[meetingIndex].timeSlots = timeSlots;
        meetings[meetingIndex].participants = []; // 初始化参与者数据
        wx.setStorageSync('meetings', meetings);
      }

      // 跳转到确认时间页
      wx.redirectTo({
        url: `/pages/confirm-time/confirm-time?meetingId=${meeting.id}`
      });
    } catch (e) {
      console.error('保存时间段失败', e);
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      });
    }
  }
});
