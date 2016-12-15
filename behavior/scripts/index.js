'use strict'

const sendRequestToSupportStaff = require('./lib/sendRequestToSupportStaff')

exports.handle = (client) => {
  // Create steps
  const sayHello = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().helloSent)
    },

    prompt() {
      client.addResponse('welcome')
      client.updateConversationState({
        helloSent: true
      })
      client.done()
    }
  })

  const handleTowelRequest = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addTextResponse("Received request for towel.")
      client.done()
    }
  })

  const untrained = client.createStep({
    satisfied() {
      return false
    },

    prompt(callback) {
      // send the request to support staff
      var data = {
        'message': client.getMessagePart(),
        'conversationState': client.getConversationState(),
      }

      sendRequestToSupportStaff(data, resultBody => {
        console.log("Response from SupportStaff", resultBody)
        if (!resultBody) {
          console.log('Error sending data to support staff.')
          callback()
          return
        }
        client.addTextResponse(resultBody)
        client.addTextResponse("I've sent your message to https://requestb.in/rzywqrrz?inspect")
        client.done()
        callback()
      })
    }
  })

  console.log('Received message:', client.getMessagePart())

  client.runFlow({
    classifications: {
      'request/towels': 'towel_request'
      // map inbound message classifications to names of streams
    },
    autoResponses: {
      // configure responses to be automatically sent as predicted by the machine learning model
    },
    streams: {
      main: 'onboarding',
      onboarding: [sayHello],
      towel_request: handleTowelRequest,
      end: [untrained],
    },
  })
}
