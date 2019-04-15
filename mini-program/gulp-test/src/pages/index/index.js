//index.js
//获取应用实例
const app = getApp()
const moment = require('../../npm/index.js').moment
Page({
  data: {
  },
  onLoad: function () {
    setInterval(() => {
      this.setData({
        date: moment().format()
      })
    })
  }
})
