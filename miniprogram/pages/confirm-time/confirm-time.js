Page({
  data: {
    meetingId: '',
    meeting: null,
    timeSlots: [],
    name: '',
    showNameInput: true,
    showSubmitBtn: false,
    currentParticipantIndex: 0,
    totalParticipants: 0,
    progressText: '',
    isCreator: false
  },

  onLoad(options) {
    const { meetingId } = options;
    this.setData({ meetingId });
    this.loadMeeting(meetingId);
  },

  loadMeeting(meetingId) {
    try {
      const meetings = wx.getStorageSync('meetings') || [];
      const meeting = meetings.find(m => m.id === meetingId);
      
      if (meeting) {
        // 如果已有参与者数据，说明不是第一次进入
        const isCreator = !meeting.participants || meeting.participants.length === 0;
        
        const timeSlots = meeting.timeSlots.map(slot => ({
          ...slot,
          checked: isCreator // 创建者默认选中所有时间段
        }));

        this.setData({
          meeting,
          timeSlots,
          totalParticipants: meeting.participantCount,
          isCreator
        });

        // 如果是创建者，自动检查提交按钮状态
        if (isCreator) {
          this.checkCanSubmit();
        }
      }
    } catch (e) {
      console.error('加载会面失败', e);
    }
  },

  onSlotTap(e) {
    const slotId = e.currentTarget.dataset.id;
    const timeSlots = this.data.timeSlots.map(slot => {
      if (slot.id === slotId) {
        return { ...slot, checked: !slot.checked };
      }
      return slot;
    });

    this.setData({ timeSlots });
    this.checkCanSubmit();
  },

  onNameInput(e) {
    this.setData({ name: e.detail.value });
    this.checkCanSubmit();
  },

  checkCanSubmit() {
    const { name, timeSlots, isCreator } = this.data;
    
    // 创建者需要输入名字才能提交（因为所有时间段已默认选中）
    // 其他参与者需要输入名字且至少选中一个时间段
    const hasCheckedSlot = timeSlots.some(slot => slot.checked);
    
    this.setData({
      showSubmitBtn: name && (isCreator || hasCheckedSlot)
    });
  },

  onSubmit() {
    const { meetingId, name, timeSlots, currentParticipantIndex } = this.data;

    // 获取选中的时间段
    const selectedSlots = timeSlots
      .filter(slot => slot.checked)
      .map(slot => slot.id);

    console.log('选中的时间段:', selectedSlots);

    try {
      const meetings = wx.getStorageSync('meetings') || [];
      const meetingIndex = meetings.findIndex(m => m.id === meetingId);

      if (meetingIndex !== -1) {
        // 添加参与者数据
        if (!meetings[meetingIndex].participants) {
          meetings[meetingIndex].participants = [];
        }

        meetings[meetingIndex].participants.push({
          name,
          selectedSlots,
          time: new Date().getTime()
        });

        console.log('保存后的参与者列表:', meetings[meetingIndex].participants);

        wx.setStorageSync('meetings', meetings);

        // 检查是否所有参与者都已填写
        const nextIndex = currentParticipantIndex + 1;
        const totalCount = meetings[meetingIndex].participantCount;

        if (nextIndex < totalCount) {
          // 还有参与者需要填写，重置表单
          this.setData({
            currentParticipantIndex: nextIndex,
            name: '',
            isCreator: false,
            timeSlots: timeSlots.map(slot => ({ ...slot, checked: false })),
            showSubmitBtn: false,
            progressText: `正在填写第 ${nextIndex + 1}/${totalCount} 人的时间选择`
          });

          wx.showToast({
            title: `已保存，请填写第 ${nextIndex + 1} 人的选择`,
            icon: 'none',
            duration: 2000
          });
        } else {
          // 所有参与者都填写完成，跳转到结果页
          wx.redirectTo({
            url: `/pages/result/result?meetingId=${meetingId}`
          });
        }
      }
    } catch (e) {
      console.error('保存参与者数据失败', e);
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      });
    }
  }
});
