const { SlashCommandBuilder } = require('@discordjs/builders');
var SpotifyWebApi = require('spotify-web-api-node')

var spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: 'http://localhost:8080'
})

const Token = require('../index.js')



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
        if(code == null){
            interaction.reply("Invalid url!")
            return
        }
        
        //Save refreshtoken to database 
        
        //within endpoints that use user oauth do these 2 lines and save new refreshtoken
        //spotifyApi.setRefreshToken('AQB-GzrrhobM2SpHFDfdeBpofFVsLBbyRnvkqQ6Bj0hI28E-bUDX77EOksxc1WPFItWmeP1PG7R1ZNV6yEILEtZZuxHHeLXkn4-O1G77_opze4Ie58RE6AV-sgG-Oz4tvO4')
        //spotifyApi.refreshAccessToken()
        

        spotifyApi.authorizationCodeGrant(code).then(
            function(data) {
                
                //save access token,refresh token, and user to database for use in other commands 

                console.log(interaction.member.user.id)
                Token.create({
                    user: interaction.member.user.id,
                    token: data.body['refresh_token']
                }).then(
                    function(data) {
                    interaction.reply("Successfully logged in! You can now use all the commands")
                },function(err){
                    if(err.errors[0].type == 'unique violation'){
                        interaction.reply("Successfully logged in! You can now use all the commands")
                        return
                    }
                    interaction.reply("Error occurred while trying to login")
                })


              },function(err) {
                interaction.reply("Authorization failed please try /login again")
              }
        )


    },
};