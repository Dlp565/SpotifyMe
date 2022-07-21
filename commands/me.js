const { SlashCommandBuilder } = require('@discordjs/builders');
var SpotifyWebApi = require('spotify-web-api-node')
const {Token,spotifyApi} = require('../index.js');
// var spotifyApi = new SpotifyWebApi({
//     clientId: process.env.SPOTIFY_CLIENT_ID,
//     clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
//     redirectUri: 'http://localhost:8080'
// })


var Discord = require('discord.js')


function cleanUserObject(data){
    if(data == undefined) {
        return null
    }
    ret = {}
    ret.name = data.display_name
    ret.link = data.external_urls.spotify
    ret.id = data.id
    ret.images = data.images
    ret.followers = data.followers.total    
    return ret

}

function createUserEmbed(data){
    const embed = new Discord.MessageEmbed();
    embed.setImage(data.images[0].url)
    embed.setTitle(data.name)
    embed.addField('ID',data.id,inline=true)
    embed.addField('Followers',String(data.followers),inline=true)
    embed.setFooter({text:`Link: ${data.link}`})
    embed.setColor('FF7F50')
    

    
    return embed
}

module.exports ={
    data: new SlashCommandBuilder()
    .setName('me')
    .setDescription('Replies with Your profile!'),
    async execute(interaction) {

        id = interaction.member.user.id
        
        const token = await Token.findOne({where: {user: id}})
        if(token) {
            refresh_token = token.get('token')
            
            spotifyApi.setRefreshToken(refresh_token)

            worked = await spotifyApi.refreshAccessToken()
            spotifyApi.setAccessToken(worked.body.access_token)

            profile = await spotifyApi.getMe()
            userObject = cleanUserObject(profile.body)
            embed = createUserEmbed(userObject)

            
            await interaction.reply({embeds:[embed]})
            return

        }



        await interaction.reply('You must authorize spotifyMe using /login before using this command!')
    },
};