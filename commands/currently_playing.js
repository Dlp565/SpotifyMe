const { SlashCommandBuilder } = require('@discordjs/builders');

var SpotifyWebApi = require('spotify-web-api-node')
var Discord = require('discord.js')

// var spotifyApi = new SpotifyWebApi({
//     clientId: process.env.SPOTIFY_CLIENT_ID,
//     clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
//     redirectUri: 'http://localhost:8080'
// })

const {Token,spotifyApi} = require('../index.js');
const song = require('./song.js');

function cleanSongObject(data){
    if(data == undefined) {
        return null
    }
    ret = {}
    ret.name = data.name
    ret.artists = []
    ret.link = data.external_urls.spotify
    for(artist of data.artists){
        ret.artists.push(artist.name)
    }
    ret.album = data.album.name
    ret.images = data.album.images
    return ret

}



function createSongEmbed(data){
    const embed = new Discord.MessageEmbed();
    embed.setImage(data.images[0].url)
    embed.setTitle(data.name)
    embed.addField('Artist',data.artists[0],inline=true)
    embed.addField('Album',data.album,inline=true)
    embed.setFooter({text:`Link: ${data.link}`})
    

    
    return embed
}


module.exports ={
    data: new SlashCommandBuilder()
    .setName('currently_playing')
    .setDescription('Replies with Currently Playing Song!')
    .addUserOption(option => option.setName('user').setDescription('Enter user name')),
    async execute(interaction) {
        await interaction.deferReply();
        
        userOption = interaction.options.getUser('user')
        id = interaction.member.user.id
        username = interaction.member.user.username
        if(userOption) {
            id = userOption.id
            username = userOption.username
        }

        const token = await Token.findOne({where: {user: id}})
        if(token) {
            refresh_token = token.get('token')
            
            spotifyApi.setRefreshToken(refresh_token)

            worked = await spotifyApi.refreshAccessToken()
            spotifyApi.setAccessToken(worked.body.access_token)

            currentTrack = await spotifyApi.getMyCurrentPlayingTrack()
            songObject = cleanSongObject(currentTrack.body.item)
            if(songObject == null) {
                await interaction.editReply(`${username} isn't currently listening to anything`)
                return
            }
            embed = createSongEmbed(songObject)
            interaction.editReply({embeds:[embed]})
            return
        } 

        await interaction.editReply(`${username} hasn\'t authorized spotifyme to use their data`)
    },
};