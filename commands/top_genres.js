const { SlashCommandBuilder } = require('@discordjs/builders');
var SpotifyWebApi = require('spotify-web-api-node')
var Discord = require('discord.js')
const {Token,spotifyApi} = require('../index.js');
// var spotifyApi = new SpotifyWebApi({
//     clientId: process.env.SPOTIFY_CLIENT_ID,
//     clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
//     redirectUri: 'http://localhost:8080'
// })

const QuickChart = require('quickchart-js');

function createChartEmbed(url){
    const embed = new Discord.MessageEmbed();
    embed.setImage(url)
    embed.setDescription("Chart breaking down genres of your top artists")
    embed.setTitle('Top Spotify Genre Breakdown')
    embed.setFooter({text:`Link: ${url}`})
    return embed
}


module.exports ={
    data: new SlashCommandBuilder()
    .setName('topgenres')
    .setDescription('Replies with Genres of your top artists!')
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
        
        id = interaction.member.user.id
        username = interaction.member.user.username
        

        const token = await Token.findOne({where: {user: id}})
        if(token) {
            refresh_token = token.get('token')
            
            spotifyApi.setRefreshToken(refresh_token)

            worked = await spotifyApi.refreshAccessToken()
            spotifyApi.setAccessToken(worked.body.access_token)

            switch(timeframe.value) {
                case 'short':
                    topArtists = await spotifyApi.getMyTopArtists(options = {
                        time_range: 'short_term',
                        limit:50
                    })
                    break;
                case 'medium':
                    topArtists = await spotifyApi.getMyTopArtists(options = {
                        time_range: 'medium_term',
                        limit:50
                    })
                    break;
                default:
                    topArtists = await spotifyApi.getMyTopArtists(options = {
                        time_range: 'long_term',
                        limit: 50
                    })

                
            }

            genreNum = {}

            artists = topArtists.body.items
            for(artist of artists){
                for(genre of artist.genres) {
                   if(genreNum[genre] == undefined) {
                        genreNum[genre] = 1     
                   } else {
                    genreNum[genre] = genreNum[genre] + 1
                   }
                }
            }

            items = Object.keys(genreNum).map(
                (key) => {return [key,genreNum[key]]}
            )

            items.sort(
                (first, second) => { return second[1] - first[1] }
              )
            
            var keys = items.map(
                (e) => { return e[0] });

            var vals = items.map(
                (e) => { return e[1] });    
                
            
            const chart = new QuickChart();

            const data = {
                labels: keys.slice(0,15),
                datasets: [{
                  label: 'My First Dataset',
                  data: vals.slice(0,15),
                  hoverOffset: 4
                }]
              };

            chart
            .setConfig({
                type: 'pie',
                data: data,
            })
            .setWidth(1000)
            .setHeight(500);

            url = chart.getUrl()
            
            embed = createChartEmbed(url)

            await interaction.editReply({embeds:[embed]})
            return
        }
        await interaction.editReply("You need to login using /login")
    },
};