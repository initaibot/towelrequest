'use strict'

const request = require('request')

module.exports = function sendRequestToSupportStaff(postData, next) {
  const requestUrl = `http://requestb.in/vpa8hqvp`

  console.log('Making HTTP POST request to:', requestUrl)

  var options = {
    method: 'post',
    body: postData,
    json: true,
    url: requestUrl
  }

  request(options, (err, res, body) => {
    if (err) {
      throw new Error(err)
    }

    if (body) {
      // const parsedResult = JSON.parse(body)
      // next(parsedResult)
      next(body)
    } else {
      next()
    }
  })
}
