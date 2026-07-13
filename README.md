# bald-bot <a href='https://github.com/MShawon/github-clone-count-badge'><img alt='GitHub Clones' src='https://img.shields.io/badge/dynamic/json?color=success&label=Clone&query=count&url=https://gist.githubusercontent.com/kipBO/05952bb3ca6ed7df0cafbbfbc3544155/raw/clone.json&logo=github'></a>

Advanced bot project template for Bot-Hosting.net

## Getting started

First of all rename `empty-config.json` to `config.json` and fill in the details:

- `botStatus` if set to `dev` the bot will display a DnD status with a development status text (can be changed in events/ready.js).
- `botClientId` go to the [Discords developers portal](https://discord.com/developers/applications/) create a new application and find your Application ID.
- `botToken` go to the [Discords developers portal](https://discord.com/developers/applications/) and find the Token for your new application.
- `masterId` your own user ID from discord to give you master powers.
- `masterGuildId` the guild ID of your own discord.
- `deployCommands` set to `true` if you want to deploy your commands on startup. And `false` to skip this part during development.
- `coolDownCommands` is explained in more details below under [settings](#cooldown).
- `honeypotId` is channel ID that you want to use as a honeypot for spam bots.
- `logging` is explained in more details below under [settings](#logging).

Commands:
All commands in the global folder will become as said global commands. Same goes for the userinstall commands folder, these will become user installed commands. For guild commands you need to create a folder for each guild with the guild ID as the folders name. Change the name of folder `1041383897373626458` to your `masterGuildId`. All commands will be automatically deployed if `deployCommands` is set to true.

Intents:

- honeypot feature uses Message Content Intent.

Permissions:

- default needed Read message history, Send messages, Bypass slowmode Permissions
- honeypot feature needs Ban members, Manage messages Permissions

## Settings

### Cooldown

Can be set per command by adding `cooldown: 5,` below the command `module.exports = {` if it isn't set the default will be `coolDownCommands defaultAmount` set in the config. To further down the strictness on commands spam you can decrease the allowed overal commands `coolDownCommands commandsPerMinute` in the config. To make a role immune for cooldowns add the role ID to the `coolDownCommands immuneCoolDownRoles` array.

### Logging

Set the level of your `paranoia` from 1 to 5 where 1 is the highest and most strict. You can also disable `logError` and `logSucces` entirely by setting them to false. Have them enabled and your paranoia set to 1 will log EVERYTHING to your discord master log channel. We kept all errors in level 5 so they always show up. You can, of course, tweak everything to your liking.

- 5 shows: All errors, bot added to guild.
- 4 shows all from 5 plus: Bot is ready, deploy commands.
- 3 shows all from 4 plus: Bot status.
- 2 shows all from 3 plus: -
- 1 shows all from 2 plus: Everything.

## Features

- Global, guild and user installed commands.
- Commands cooldown and spam prevention.
- Global logging to your discord.
- Honeypot to catch and ban spam bots.
- Ban from service. (planned)
- Dashboard website. (planned)
- Login website add to discord server. (planned)
- Alt account checker. (planned)

## Troubleshooting

- If a command isn't showing, refresh discord with Ctrl + R.
