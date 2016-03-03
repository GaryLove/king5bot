# king5bot

## Overview
A simple Beep Boop hostable bot for Slack using Node.js.  Integrating Wit.AI and a custom reply from KING 5.


## Documenation
Hosting [Beep Boop](https://beepboophq.com/docs/article/overview) 
Slack API: [here](https://api.slack.com/).
Witbot: [npm module](https://www.npmjs.com/package/witbot )

## Assumptions
* You have already signed up with [Beep Boop](https://beepboophq.com) and have a local fork of this project.
* You have sufficient rights in your Slack team to configure a bot and generate/access a Slack API token.
* You have a Wit.api tocken

## Usage

### Run locally
	npm install
	SLACK_TOKEN=<YOUR_SLACK_TOKEN> 
	WIT_TOKEN=<YOUR_WIT_TOKEN>
	npm start
	

Things are looking good if the console prints something like:

    ** API CALL: https://slack.com/api/rtm.start
    ** BOT ID:  witty  ...attempting to connect to RTM!
    ** API CALL: https://slack.com/api/chat.postMessage

### Run locally in Docker
	docker build -t starter-node .`
	docker run --rm -it -e SLACK_TOKEN=<YOUR SLACK API TOKEN> WIT_TOKEN=<YOUR WIT API TOKEN> starter-node

### Run in BeepBoop
Repo is linked the Beep Boop service (check [here](https://beepboophq.com/0_o/my-projects)), changes pushed to the remote master branch will automatically deploy.

## Acknowledgements

This code uses the [botkit](https://github.com/howdyai/botkit) npm module by the fine folks at Howdy.ai.

## License

See the [LICENSE](LICENSE.md) file (MIT).
