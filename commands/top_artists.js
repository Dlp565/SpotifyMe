const { SlashCommandBuilder } = require('@discordjs/builders');
var SpotifyWebApi = require('spotify-web-api-node')
var Discord = require('discord.js')
const {Token,spotifyApi} = require('../index.js');
const spawn = require('child_process').spawn
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const QuickChart = require('quickchart-js');
const { createDecipheriv } = require('crypto');

function createChartEmbed(url){
    const embed = new Discord.MessageEmbed();
    embed.setImage(url)
    embed.setDescription("Chart breaking down artists from your top songs")
    embed.setTitle('Top Spotify Artists Breakdown')
    embed.setFooter({text:`Link: ${url}`})
    return embed
}

module.exports ={
    data: new SlashCommandBuilder()
    .setName('topartists')
    .setDescription('Replies with your top artists!')
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
                    topArtists = await spotifyApi.getMyTopTracks(options = {
                        time_range: 'short_term',
                        limit:50
                    })
                    break;
                case 'medium':
                    topArtists = await spotifyApi.getMyTopTracks(options = {
                        time_range: 'medium_term',
                        limit:50
                    })
                    break;
                default:
                    topArtists = await spotifyApi.getMyTopTracks(options = {
                        time_range: 'long_term',
                        limit: 50
                    })

                
            }

            var artists = {}

            for(song of topArtists.body.items) {
                currArtist  = song.artists[0].name.toString()
                if(artists[currArtist] == undefined) {
                    artists[currArtist] = 1
                } else {
                    artists[currArtist] = artists[currArtist] + 1
                }
            }

            
            artistsNames = []
            counts = []

            for(var key in artists){
                artistsNames.push(key)
                counts.push(artists[key])
            }

            
            
            const chart = new QuickChart();

            const data = {
                labels: artistsNames,
                datasets: [{
                  label: 'My First Dataset',
                  data: counts,
                  hoverOffset: 4
                }]
              };

            chart
            .setConfig({
                type: 'doughnut',
                data: data,
            })
            .setWidth(800)
            .setHeight(400);

            url = chart.getUrl()

            embed = createChartEmbed(url)

            //await interaction.editReply(url)
            await interaction.editReply({embeds:[embed]})

           
            
            

            return
        }

        await interaction.editReply(`${username} hasn't authorized SpotifyMe yet`)

    },
};