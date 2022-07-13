
const { SlashCommandBuilder } = require('@discordjs/builders');
var SpotifyWebApi = require('spotify-web-api-node')
require('dotenv').config()
var Discord = require('discord.js')
var fac = require('fast-average-color-node')
var shortUrl = require("node-url-shortener");
var scopes = ['user-modify-playback-state', 'user-read-recently-played','playlist-read-collaborative','user-read-playback-state',
'streaming','user-top-read','user-follow-read','user-read-currently-playing','user-library-read','playlist-read-private']


//Create spotify api object
var spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: 'http://localhost:8080'
})

module.exports ={
    data: new SlashCommandBuilder()
    .setName('login')
    .setDescription('Sends autorization link to login'),
    async execute(interaction) {
        console.log(interaction.user)
        await interaction.user.createDM()
        var authorizeURL = spotifyApi.createAuthorizeURL(scopes, 'state');
        
        
        
        username = interaction.user.username + '#' + interaction.user.discriminator
        const modal = new Discord.Modal()
        .setCustomId('auth').setTitle('Authorization');

        console.log(authorizeURL)

        const authInput = new Discord.TextInputComponent()
			.setCustomId('authInput')
		    // The label is the prompt the user sees for this input
			.setLabel(`a`)
		    // Short means only a single line of text
			.setStyle('PARAGRAPH')
            .setRequired(true);

        const firstActionRow = new Discord.MessageActionRow().addComponents(authInput);

        modal.addComponents(firstActionRow)


        await interaction.reply(`Follow the link and it should send you to an empty page. Use /auth and send url of that page in the url form 
        \n ${authorizeURL}` )
        //await interaction.showModal(modal)

    }
}