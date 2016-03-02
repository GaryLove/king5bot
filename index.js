var Botkit = require('botkit')
var Witbot = require('witbot')
var request = require('request')

// Expect a SLACK_TOKEN environment variable
var slackToken = process.env.SLACK_TOKEN
if (!slackToken) {
  console.error('SLACK_TOKEN is required!')
  process.exit(1)
}
// Spin up the Slack connection
var controller = Botkit.slackbot({ debug: false })

controller.spawn({ token: slackToken }).startRTM(function (err, bot, payload) {
  if (err) throw new Error('Error connecting to Slack: ', err)
  console.log('Connected to Slack')
})



// Expect a WIT_TOKEN environment variable
var witbot = Witbot(process.env.WIT_TOKEN)
if (!process.env.WIT_TOKEN) {
  console.error('WIT_TOKEN is required!')
  process.exit(1)
}

// when the bot first joins a channel
controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, "I'm here!")
})


// wire up DMs and direct mentions to wit.ai
controller.hears('.*', 'direct_message,direct_mention', function (bot, message) {
  var wit = witbot.process(message.text, bot, message)

  wit.hears('hello', 0.53, function (bot, message, outcome) {
  	bot.reply(message, 'Well, hello to you too!')
  })
  wit.hears('help', 0.53, function (bot, message, outcome) {
	bot.reply(message, 'Lets see how I can be of help.')
  })
  wit.hears('who', 0.53, function (bot, message, outcome) {
	bot.reply(message, 'Just call me Mr KING 5 bot the third.')
  })
  wit.hears('news', 0.53, function (bot, message, outcome) {
  	console.log(outcome)
	bot.reply(message, 'Read all about it.')
  })
  wit.hears('weather', 0.53, function (bot, message, outcome) {
  	var url = 'http://slack.socialaspect.com/witbot/weather.php?location=' + outcome.entities.location + '&weather_condition=' + outcome.entities.weather_condition
	request({url: url, json: true}, function (error, response, data) {
	  if (error) {
	    bot.reply(message, 'Sticking my head out the window now.  Oops, window will not open.')
	    console.error(error)
	  }
	  if (response.statusCode !== 200) {
	    bot.reply(message, 'Sticking my head out the window now.  Darn, I do not have a window.')
	  	console.error('unexpected status ' + response.statusCode)
	  }
	  var messagetext = data.message
	  bot.reply(message, 'Sticking my head out the window now. ' + messagetext)
	})
  })
  
  wit.otherwise(function (bot, message) {
    bot.reply(message, 'You are so intelligent, and I am so simple. I don\'t understand')
  })
})