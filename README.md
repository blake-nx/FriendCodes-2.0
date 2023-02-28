# FriendCodes Bot 2.0 
With this revamped friend codes bot, you can easily store and share your Pokemon Go and Nintendo Switch friend codes with all your friends on Discord! This bot utilizes slash commands, which are designed to only be visible to the person who executes them (with the exception of the commands meant for sharing your code) thereby minimizing clutter in the chat.

You can invite the bot to your server by [clicking here](https://discord.com/api/oauth2/authorize?client_id=749100429597736970&permissions=543850622016&scope=bot) or build your own using the installation instructions below.


![2023-02-25_21h01_26](https://user-images.githubusercontent.com/13428576/221390067-cf77b541-f413-476a-907a-a577f35219f8.png)

## Features :star2:
* Easily add your Pokemon Go and Nintendo Switch friend codes to the bot once, and share them with friends on-demand. Never have to copy/paste or type it out again!
* Get other player's friend codes so you can quickly add them in-game!
* Simple to update/delete your friend codes from the bot.

## Commands :mage_man:

### Pokemon Go :iphone:

* `/add-pogocode` - Add your Pokemon Go friend code to the bot. ex: `1234 5678 9012`

* `/update-pogocode` - Update your Pokemon Go friend code.

* `/delete-pogocode` - Delete your Pokemon Go friend code from the bot.

* `/my-pogocode` - Get your Pokemon Go friend code.

* `/get-pogocode` - Tag a friend to get their Pokemon Go friend code.
***
### Nintendo Switch :video_game:
* `/add-switchcode` - Add your Nintendo Switch friend code to the bot. ex: `SW-1234-5678-9012`

* `/update-switchcode` - Update your Nintendo Switch friend code.

* `/delete-switchcode` - Delete your Nintendo Switch friend code from the bot.

* `/my-switchcode` - Get your Nintendo Switch friend code.

* `/get-switchcode` - Tag a friend to get their Nintendo Switch friend code.

## Installation:

### Setting up Your Bot :robot:
1.  [Follow the guide here for creating your bot](https://discordjs.guide/preparations/setting-up-a-bot-application.html)
2.  Clone this repository locally
3.  Navigate to the bot directory and run `npm install`
4.  Rename `.env.example` to `.env` and add your own tokens and database credentials.
5.  run `node app.js`

### Setting up Your DB :minidisc:
This bot uses Sequelize and PostgreSQL. So you'll need to either set up a Postgres DB or update the Sequelize config in `/db/db-connect.js` to match the dialect you're using.

Note: you can/need to run `dbSync.js` to quickly create the table and model in your DB using Sequelize.
 
### Registering Slash Commands :memo:
In order for your bot to use slash commands in a server, you will need to run `node deploy-commands.js` once at initial setup and then again every time you add new commands.
