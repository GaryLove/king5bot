//Webfaction start/stop $HOME/webapps/beepboop/bin/stop & $HOME/webapps/beepboop/bin/start
//Webfaction testing 
//Export tokens
//PATH=$PWD/bin/:$PATH 
//npm start

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
	var url = 'http://bot.socialaspect.com/king5/hello.php'

	request({url: url, json: true}, function (error, response, data) {
	  if (error) {
	    bot.reply(message, 'Howdy partner!')
	    console.error(error)
	  }
	  if (response.statusCode !== 200) {
	    bot.reply(message, 'Well, hello to you too!')
	  	console.error('unexpected status ' + response.statusCode)
	  }
	  var messagetext = data.message
	  bot.reply(message, messagetext)
	})
  })
  wit.hears('help', 0.53, function (bot, message, outcome) {
	var url = 'http://bot.socialaspect.com/king5/help.php'

	request({url: url, json: true}, function (error, response, data) {
	  if (error) {
	    bot.reply(message, 'I would like to be of more help. But I am experiencing some problems right now.')
	    console.error(error)
	  }
	  if (response.statusCode !== 200) {
	    bot.reply(message, 'Right now I am the one who needs help.')
	  	console.error('unexpected status ' + response.statusCode)
	  }
	  var messagetext = data.message
	  bot.reply(message, messagetext)
	})
  })
  wit.hears('who', 0.53, function (bot, message, outcome) {
	var url = 'http://bot.socialaspect.com/king5/who.php'

	request({url: url, json: true}, function (error, response, data) {
	  if (error) {
	    bot.reply(message, 'Who am I?  That is a harder question than I thought.  Just call me KING 5 bot.  Or botty.  Yeah, I like botty.')
	    console.error(error)
	  }
	  if (response.statusCode !== 200) {
	    bot.reply(message, 'Just call me Mr KING 5 bot the third.')
	  	console.error('unexpected status ' + response.statusCode)
	  }
	  var messagetext = data.message
	  bot.reply(message, messagetext)
	})
  })
  wit.hears('news', 0.53, function (bot, message, outcome) {
  	search_query = datetime = more = ''
  	if (outcome.entities.search_query) search_query = outcome.entities.search_query[0].value 
  	if (outcome.entities.datetime) datetime = outcome.entities.datetime[0].value
	if (outcome.entities.more) more = outcome.entities.more[0].value 

  	var url = 'http://bot.socialaspect.com/king5/news.php?search_query=' + search_query + '&datetime=' + datetime + '&more=' + more

	request({url: url, json: true}, function (error, response, data) {
	  if (error) {
	    bot.reply(message, 'Hmmmm...I should know this.  But my robo-brain is failing me.')
	    console.error(error)
	  }
	  if (response.statusCode !== 200) {
	    bot.reply(message, 'Hmmmm...I should know this.  Maybe next time.')
	  	console.error('unexpected status ' + response.statusCode)
	  }
	  var messagetext = data.message
	  bot.reply(message, messagetext)
	})
  })
  wit.hears('weather', 0.53, function (bot, message, outcome) {
  	location = weather_condition = datetime = ''
  	if (outcome.entities.location) location = outcome.entities.location[0].value
  	if (outcome.entities.weather_condition) weather_condition = outcome.entities.weather_condition[0].value 
  	if (outcome.entities.datetime) datetime = outcome.entities.datetime[0].value 
  
  	var url = 'http://bot.socialaspect.com/king5/weather.php?location=' + location + '&weather_condition=' + weather_condition + '&datetime=' + datetime

	request({url: url, json: true}, function (error, response, data) {
	  if (error) {
	    bot.reply(message, 'Sticking my head out the window now.  Oops, window will not open.')
	    console.error(error)
	  }
	  if (response.statusCode !== 200) {
	    bot.reply(message, 'Sticking my head out the window now. Ouch, turns out I do not have a window.  Trying again.')
	  	console.error('unexpected status ' + response.statusCode)
	  }
	  var messagetext = data.message
	  bot.reply(message, messagetext)
	})
  })
  
  wit.otherwise(function (bot, message) {
	var url = 'http://bot.socialaspect.com/king5/failure.php'

	request({url: url, json: true}, function (error, response, data) {
	  if (error) {
	    bot.reply(message, 'Huh?')
	    console.error(error)
	  }
	  if (response.statusCode !== 200) {
	    bot.reply(message, 'What is this nonsense you speak?!.')
	  	console.error('unexpected status ' + response.statusCode)
	  }
	  var messagetext = data.message
	  bot.reply(message, messagetext)
	})
  })
})