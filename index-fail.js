var Botkit = require('botkit')
var Witbot = require('witbot')

// Expect a SLACK_TOKEN environment variable
var slackToken = process.env.SLACK_TOKEN
if (!slackToken) {
  console.error('SLACK_TOKEN is required!')
  process.exit(1)
}

// Expect a WIT_TOKEN environment variable
var witToken = process.env.WIT_TOKEN
if (!witToken) {
  console.error('WIT_TOKEN is required!')
  process.exit(1)
}

// Spin up the Slack connection
var controller = Botkit.slackbot({
  debug: false
})
var bot = controller.spawn({
  token: slackToken
})

bot.startRTM(function (err, bot, payload) {
  if (err) {
    throw new Error('Could not connect to Slack')
  }
})

// Spin up the Wit connection
var witbot = Witbot(witToken)


controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, "I'm here!")
})

controller.hears(['hello', 'hi'], ['direct_mention'], function (bot, message) {
  bot.reply(message, 'Hello.')
})

controller.hears('.*', ['mention'], function (bot, message) {
  bot.reply(message, 'You really do care about me. :heart:')
})

controller.hears('help', ['direct_message', 'direct_mention'], function (bot, message) {
  var help = 'I will respond to the following messages: \n' +
      '`bot hi` for a simple message.\n' +
      '`bot attachment` to see a Slack attachment message.\n' +
      '`@<your bot\'s name>` to demonstrate detecting a mention.\n' +
      '`bot help` to see this again.'
  bot.reply(message, help)
})

controller.hears(['attachment'], ['direct_message', 'direct_mention'], function (bot, message) {
  var text = 'Beep Beep Boop is a ridiculously simple hosting platform for your Slackbots.'
  var attachments = [{
    fallback: text,
    pretext: 'We bring bots to life. :sunglasses: :thumbsup:',
    title: 'Host, deploy and share your bot in seconds.',
    image_url: 'https://storage.googleapis.com/beepboophq/_assets/bot-1.22f6fb.png',
    title_link: 'https://beepboophq.com/',
    text: text,
    color: '#7CD197'
  }]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {
    console.log(err, resp)
  })
})


controller.hears('.*', 'direct_message,direct_mention', function (bot, message) {
  var wit = witbot.process(message.text, bot, message)
})


wit.hears('hello', 0.5, function (bot, message, outcome) {
  bot.reply(message, 'Hello to you as well!')
})

wit.hears('hello', 0.53, function (bot, message, outcome) {
    bot.startConversation(message, function (_, convo) {
      convo.say('Hello!')
      convo.ask('How are you?', function (response, convo) {
        witbot.process(response.text)
          .hears('good', 0.5, function (outcome) {
            convo.say('I am so glad to hear it!')
            convo.next()
          })
          .hears('bad', 0.5, function (outcome) {
            convo.say('I\'m sorry, that is terrible')
            convo.next()
          })
          .otherwise(function (outcome) {
            convo.say('I\'m confused')
            convo.repeat()
            convo.next()
          })
      })
    })
  })

