const { SlashCommandBuilder } = require('@discordjs/builders');
var SpotifyWebApi = require('spotify-web-api-node')

var spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: 'http://localhost:8080'
})


module.exports ={
    data: new SlashCommandBuilder()
    .setName('auth')
    .setDescription('Replies with Pong!')
    .addStringOption(option => option.setName('url').setDescription('Enter Url from spotify authorization')),
    async execute(interaction) {
        url = interaction.options.getString("url")
        
        if(url == null){
            interaction.reply("No url provided please try again")
            return
        }

        const urlParams = new URLSearchParams(url);
        code = urlParams.get('http://localhost:8080/?code')
        console.log(urlParams)
        if(code == null){
            interaction.reply("Invalid url!")
            return
        }

       
        spotifyApi.authorizationCodeGrant(code).then(
            function(data) {
                console.log('The token expires in ' + data.body['expires_in']);
                console.log('The access token is ' + data.body['access_token']);
                console.log('The refresh token is ' + data.body['refresh_token']);
            
                //save access token,refresh token, and user to database for use in other commands 
              },function(err) {
                interaction.reply("Authorization failed please try /login again")
              }
        )


    },
};