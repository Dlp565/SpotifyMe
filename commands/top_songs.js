const { SlashCommandBuilder } = require('@discordjs/builders');
var SpotifyWebApi = require('spotify-web-api-node')
var Discord = require('discord.js')

var spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: 'http://localhost:8080'
})

const { PaginatorEvents, ReactionPaginator, ButtonPaginator  } = require('@psibean/discord.js-pagination');


const Token = require('../index.js');
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
    .setName('topsongs')
    .setDescription('Replies with your top songs!')
    .setDescription("Choose what time frame to return top songs from")
    .addStringOption(option => option.setName('timeframes')
        .setDescription('timeframe options')
        .setRequired(true)
        .addChoices(
            {name: 'Short Term(Last Month)', value: 'short'},
            {name: 'Medium Term(Last Six Months)', value: 'medium'},
            {name: 'Long Term(All Time)', value: 'long'}
        )),
    async execute(interaction) {
        await interaction.deferReply();
        timeframe = interaction.options.get('timeframes')
        console.log(timeframe)
        id = interaction.member.user.id
        username = interaction.member.user.username
        
        const token = await Token.findOne({where: {user: id}})
        if(token) {
            refresh_token = token.get('token')
            
            spotifyApi.setRefreshToken(refresh_token)

            worked = await spotifyApi.refreshAccessToken()
            spotifyApi.setAccessToken(worked.body.access_token)

            // interface GetTopOptions extends PaginationOptions {
            //     time_range?: 'long_term' | 'medium_term' | 'short_term' | undefined;
            // }

            switch(timeframe.value) {
                case 'short':
                    topTracks = await spotifyApi.getMyTopTracks(options = {
                        time_range: 'short_term'
                    })
                    break;
                case 'medium':
                    topTracks = await spotifyApi.getMyTopTracks(options = {
                        time_range: 'medium_term'
                    })
                    break;
                default:
                    topTracks = await spotifyApi.getMyTopTracks(options = {
                        time_range: 'long_term'
                    })

                
            }

            topSongs = []
            pages = []
            for(i = 0; i < 10; i++) {
                topSongs.push(topTracks.body.items[i])
            }

            
            for(i = 0; i < 10; i++) {
                songObject = cleanSongObject(topSongs[i])
                if(songObject == null) {
                    topSongs.splice(i,1)
                } else {
                    try {
                    pages.push(createSongEmbed(songObject))
                    } catch (err) {
                        console.log(err)
                    }
                }
            }

            const buttonPaginator = new ButtonPaginator(interaction, { pages });
            await buttonPaginator.send();   
            return    
            //return reactionPaginator.message;
                    


            

            

            //console.log(topTracks.body.items)

        }

        await interaction.editReply(`${username} hasn't authorized SpotifyMe yet`)
    },
};