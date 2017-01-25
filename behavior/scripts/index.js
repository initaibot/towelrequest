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
        client.addTextResponse("I've sent your message to http://requestb.in/vpa8hqvp?inspect")
        client.done()
        callback()
      })
    }
  })

  const handleWelcome = client.createStep({
    satisfied() {
      return false
    },

    prompt(callback) {
      client.addResponse('response/welcome')
      client.done()
      callback()
    }
  })

  const handleThanks = client.createStep({
    satisfied() {
      return false
    },

    prompt(callback) {
      client.addResponse('response/thanks')
      client.done()
      callback()
    }
  })

  const handleGreetingEmphatic = client.createStep({
    satisfied() {
      return false
    },

    prompt(callback) {
      client.addResponse('response/greeting/emphatic')
      client.done()
      callback()
    }
  })

  const handleGreetingAsking = client.createStep({
    satisfied() {
      return false
    },

    prompt(callback) {
      client.addResponse('response/greeting/asking')
      client.done()
      callback()
    }
  })

  const handleGreeting = client.createStep({
    satisfied() {
      return false
    },

    prompt(callback) {
      client.addResponse('response/greeting')
      client.done()
      callback()
    }
  })

  const handleGoodbye = client.createStep({
    satisfied() {
      return false
    },

    prompt(callback) {
      client.addResponse('response/goodbye')
      client.done()
      callback()
    }
  })

  console.log('Received message:', client.getMessagePart())

  client.runFlow({
    classifications: {
      // Add a greeting handler with a reference to the greeting stream
      'request/towels': 'towel_request',
      'greeting': 'greeting',
      'greeting/asking': 'greeting/asking',
      'greeting/emphatic': 'greeting/emphatic',
      'thanks': 'thanks',
      'welcome': 'welcome',
      'goodbye': 'goodbye',
    },
    streams: {
      // Add a Stream for greetings and assign it a Step
      greeting: handleGreeting,
      goodbye: handleGoodbye,
      'greeting/asking': handleGreetingAsking,
      'greeting/emphatic': handleGreetingEmphatic,
      thanks: handleThanks,
      welcome: handleWelcome,
      towel_request: handleTowelRequest,
      main: 'onboarding',
      onboarding: [sayHello],
      end: [untrained]
    },
  })
}
