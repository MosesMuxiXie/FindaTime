Page({
  data: {
    purpose: '',
    dateRange: [[], [], []],
    dateIndex: [0, 0, 0],
    selectedDate: '',
    startTime: '',
    endTime: '',
    participantCount: '',
    showContinueBtn: false
  },

  onLoad() {
    this.initDateRange();
  },

  initDateRange() {
    const now = new Date();
    const years = [];
    const months = [];
    const days = [];

    // 年份：当前年份到未来10年
    for (let i = now.getFullYear(); i <= now.getFullYear() + 10; i++) {
      years.push({ label: i + '年', value: i });
    }

    // 月份：1-12月
    for (let i = 1; i <= 12; i++) {
      months.push({ label: i + '月', value: i });
    }

    // 日期：1-31日
    for (let i = 1; i <= 31; i++) {
      days.push({ label: i + '日', value: i });
    }

    this.setData({
      dateRange: [years, months, days],
      dateIndex: [0, now.getMonth(), now.getDate() - 1]
    });
  },

  onPurposeInput(e) {
    this.setData({ purpose: e.detail.value });
    this.checkFormComplete();
  },

  onDateChange(e) {
    const index = e.detail.value;
    const dateRange = this.data.dateRange;
    const year = dateRange[0][index[0]].value;
    const month = dateRange[1][index[1]].value;
    const day = dateRange[2][index[2]].value;

    const selectedDate = `${year}年${month}月${day}日`;

    this.setData({
      dateIndex: index,
      selectedDate
    });
    this.checkFormComplete();
  },

  onStartTimeChange(e) {
    this.setData({ startTime: e.detail.value });
    this.checkFormComplete();
  },

  onEndTimeChange(e) {
    this.setData({ endTime: e.detail.value });
    this.checkFormComplete();
  },

  onCountInput(e) {
    this.setData({ participantCount: e.detail.value });
    this.checkFormComplete();
  },

  checkFormComplete() {
    const { purpose, selectedDate, startTime, endTime, participantCount } = this.data;
    const isComplete = purpose && selectedDate && startTime && endTime && participantCount;
    
    this.setData({
      showContinueBtn: isComplete
    });
  },

  onContinue() {
    const { purpose, selectedDate, startTime, endTime, participantCount } = this.data;

    // 生成唯一ID
    const meetingId = Date.now().toString();
    
    // 创建会面对象
    const meeting = {
      id: meetingId,
      purpose,
      date: selectedDate,
      startTime,
      endTime,
      participantCount: parseInt(participantCount),
      createTime: this.formatDate(new Date()),
      completed: false,
      timeSlots: [], // 用于存储时间段的确认数据
      participants: [] // 用于存储每个参与者对时间段的选择
    };

    try {
      // 保存到本地存储
      const meetings = wx.getStorageSync('meetings') || [];
      meetings.unshift(meeting);
      wx.setStorageSync('meetings', meetings);

      // 跳转到选择时间页面
      wx.navigateTo({
        url: `/pages/select-time/select-time?meetingId=${meetingId}`
      });
    } catch (e) {
      console.error('保存会面失败', e);
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      });
    }
  },

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }
});
