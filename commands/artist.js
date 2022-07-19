const { SlashCommandBuilder } = require('@discordjs/builders');
var SpotifyWebApi = require('spotify-web-api-node')
require('dotenv').config()
var Discord = require('discord.js')
var fac = require('fast-average-color-node')

//Create spotify api object

const {Token,spotifyApi} = require('../index.js');


//give spotifyapiobejct client token
spotifyToken()
setInterval(spotifyToken,180000)

function spotifyToken(){
    spotifyApi.clientCredentialsGrant().then(
        function(data){
            console.log('The access token expires in ' + data.body['expires_in']);
            spotifyApi.setAccessToken(data.body['access_token'])
        },
        function(err) {
            console.log('Token did not work')
        }
        
    )
}

a = []

function cleanArtistObject(data){
    if(data == undefined) {
        return null
    }
    ret = {}
    ret.name = data.name
    ret.followers = data.followers
    ret.link = data.external_urls.spotify
    
    ret.genres = data.genres
    ret.images = data.images
    return ret

}




function createArtistEmbed(data){
    console.log(data)
    const embed = new Discord.MessageEmbed();
    if(data.images.length >= 1){
        embed.setImage(data.images[0].url)
    }
    embed.setTitle(data.name)
    embed.addField('Followers',String(data.followers.total),inline=true)
    if(data.genres.length > 0){
        genreString = data.genres[0]
        for(let i = 1; i < data.genres.length; i++) {
            genreString = genreString + ',' + data.genres[i]
        }
        embed.addField('Genres',genreString, inline = true)
    }
    embed.setFooter({text:`Link: ${data.link}`})
    

    
    return embed
}

module.exports ={
    data: new SlashCommandBuilder()
    .setName('artist')
    .setDescription('Returns searched for song from spotify!')
    .addStringOption(option => option.setName('artist').setDescription('Enter artist name')),
    async execute(interaction) {
        
        artistName = interaction.options.getString('artist')
        
        
        
        

        if(artistName == null){
            await interaction.reply('Please enter an artist')
            return
        } else {
            spotifyApi.searchArtists(`${artistName}`)
            .then(function(data){
                retData = data.body.artists.items[0]
                retObject = cleanArtistObject(retData)
                if(retObject == null){
                     interaction.reply("Song Could not be found!")
                     return
                 }
                 embed = createArtistEmbed(retObject)
                 interaction.reply({embeds:[embed]})
            }, function(err) {
                console.error(err)
            })
        }

        //await interaction.reply('Pong!')
    },
};