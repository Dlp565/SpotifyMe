const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config()

const token = process.env.DISCORD_TOKEN
const clientId = process.env.DISCORD_CLIENT_ID
const guildId = process.env.DISCORD_SERVER_ID

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
}



const rest = new REST({version:'10'}).setToken(token)

rest.put(Routes.applicationGuildCommands(clientId,guildId),{body:commands})
.then(() => console.log('Success'))
.catch(console.error)