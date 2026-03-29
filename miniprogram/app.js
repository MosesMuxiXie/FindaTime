App({
  onLaunch() {
    // 初始化本地存储
    try {
      const meetings = wx.getStorageSync('meetings');
      if (!meetings) {
        wx.setStorageSync('meetings', []);
      }
    } catch (e) {
      console.error('初始化存储失败', e);
    }
  }
});
