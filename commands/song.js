const { SlashCommandBuilder } = require('@discordjs/builders');
var SpotifyWebApi = require('spotify-web-api-node')
require('dotenv').config()
var Discord = require('discord.js')
var fac = require('fast-average-color-node')

//Create spotify api object
var spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: 'http://localhost:8080'
})

//give spotifyapiobejct client token
spotifyApi.clientCredentialsGrant().then(
    function(data){
        spotifyApi.setAccessToken(data.body['access_token'])
    },
    function(err) {
        console.log('Token did not work')
    }
    
)

a = []

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
    .setName('song')
    .setDescription('Returns searched for song from spotify!')
    .addStringOption(option => option.setName('song').setDescription('Enter song name'))
    .addStringOption(option => option.setName('artist').setDescription('Enter artist name')),
    async execute(interaction) {
        songName = interaction.options.getString('song')
        artistName = interaction.options.getString('artist')
        
        
        
        

        if(songName == null){
            await interaction.reply('Please enter a song name')
            return
        } else if (artistName == null){
            spotifyApi.searchTracks(`track:${songName}`)
            .then(function(data){
                
                retData = data.body.tracks.items[0]
                retObject = cleanSongObject(retData)
                if(retObject == null){
                    interaction.reply("Song Could not be found!")
                    return
                }
                embed = createSongEmbed(retObject)
                interaction.reply({embeds:[embed]})
            }, function(err) {
                console.error(err)
            })
        } else {
            spotifyApi.searchTracks(`track:${songName} artist:${artistName}`)
            .then(function(data){
                
                retData = data.body.tracks.items[0]
                retObject = cleanSongObject(retData)
                if(retObject == null){
                    interaction.reply("Song Could not be found!")
                    return
                }
                embed = createSongEmbed(retObject)
                interaction.reply({embeds:[embed]})
            }, function(err) {
                console.error(err)
            })
        }

        //await interaction.reply('Pong!')
    },
};