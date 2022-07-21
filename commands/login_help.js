const { SlashCommandBuilder } = require('@discordjs/builders');
var Discord = require('discord.js')
const { PaginatorEvents, ReactionPaginator, ButtonPaginator  } = require('@psibean/discord.js-pagination');

module.exports ={
    data: new SlashCommandBuilder()
    .setName('loginhelp')
    .setDescription('Shows how to login!'),
    async execute(interaction) {
        await interaction.deferReply();

        em1 = new Discord.MessageEmbed()
        .setTitle("1.")
        .setDescription("First follow the link from /login and authorize spotify. Authorization site should look like this:")
        .setImage('https://i.imgur.com/MtHrDHB.png')
        
        em2 = new Discord.MessageEmbed()
        .setTitle("2.")
        .setDescription("Once you have authorized spotify it should take you to a page that looks like this. Copy the url of that page(where the arrow is pointing)")
        .setImage('https://i.imgur.com/GCMFUe1.png')
        
        em3 = new Discord.MessageEmbed()
        .setTitle("3.")
        .setDescription("Copy that link into the /auth command on discord under the url section. After this should it should say \"Successfully logged in! You can now use all the commands\"")
        .setImage('https://i.imgur.com/iFXYYNN.png')
        pages = [em1,em2,em3]



        const buttonPaginator = new ButtonPaginator(interaction, { pages });
        await buttonPaginator.send();
        return    

    },
};