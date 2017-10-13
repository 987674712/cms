export default{
  install (Vue, options) {
    Vue.prototype.BaseUrl = 'http://' + location.host + '/v1/'
    Vue.prototype.fetch = function (method, url, event, data, header) {
      var that = this
      header = header || {}
      data = data || {}
      header.token = JSON.parse(sessionStorage.getItem('token'))
      if (method === 'POST') {
        data = JSON.stringify(data)
        header['Content-Type'] = 'application/json'
      }
      console.log(url)
      return fetch(url, {
        method: method,
        headers: header,
        body: data
      }).then(function (response) {
        return response.json()
      }).then(function (data) {
        event(data)
      }).catch(function (e) {
        that.$message({
          showClose: true,
          message: '请求失败，请稍后再试',
          type: 'error'
        })
      })
    }
  }
}
