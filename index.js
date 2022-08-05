const { Client, MessageEmbed } = require('discord.js');
const client = new Client({ intents: 32767 });
const db = require("pro.db");
const prefix = "$";

client.on('ready', async () => {
  await console.log(client.user.tag);
});



client.on('messageCreate', async (message) =>{
  if (!message.content.startsWith(prefix) || message.author.bot || !message.guild) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    if (command === "add-channel"){
    if (!args[0]) return await message.channel.send({content: `**${prefix}add-channel <channel id>**`});
    const data = db.get("CHANNELS");
    if (!data.includes(args[0])) {
      await db.push("CHANNELS", args[0]);
      await message.channel.send({content: `**Done.**`});    
      }else{
        return await message.channel.send({content: `**This id alredy in data.**`});
      }
    
    }
    if (command === "remove-channel"){
      if (!args[0]) return await message.channel.send({content: `**${prefix}remove-channel <channel id>**`});
      const data = db.get("CHANNELS");
      if (!data.includes(args[0])) return await message.channel.send({content: `**I can't find this id in data.**`});
      await db.set("CHANNELS", data.filter(data => data !== args[0]));
      await message.channel.send({content: `**Done.**`});
    }
    if (command === "set-line"){
      if (!args[1]) return await message.channel.send({content: `**${prefix}set-line <all/channel> <link>**`});
      if (args[0].toLowerCase() === "all"){
        await db.set("LineAllChannels", args[1]);
        await message.channel.send({content: `**Done.**`});
      }else {
        let data = db.get(`CHANNELS`);
        if (!data.includes(args[0])) return await message.channel.send({content: `**I can't find this id in data**`});
        db.set(`line_${args[0]}`, args[1]);
        await message.channel.send({content: `**Done.**`});
      }
    }
    if (command === "list"){
      let data = db.get("CHANNELS");
      if (!data || !data[0]) return await message.channel.send({content: `**I can't find any id in data.**`});
      let x = ""
      data.forEach(async (channel, i) =>{
        x += `**#${i + 1} - ${channel}**\n`
      });
      let embed = new MessageEmbed()
      .setDescription(`${x}`)
      await message.channel.send({embeds: [embed]})
    }
});
client.on('messageCreate', async (message) =>{
  if (!message.guild || message.author.bot) return; 
  let data = db.get("CHANNELS");

  if (!data) return;
  if (data.includes(message.channel.id)){
    let lineData = db.get(`line_${message.channel.id}`) || db.get(`LineAllChannels`) || "Not Line";
    await message.channel.send({content: `${lineData}`});
  }
})
client.login('توكن بوتك').catch(err => console.log('Token !'));
