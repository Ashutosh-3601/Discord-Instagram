const uploadSchema = require('../../schema/upload.js');
const userSchema = require('../../schema/userSchema.js');
const Discord = require('discord.js')
module.exports = {
	name: 'leaderboard',
	description: 'View The Global Leaderboard Under Highest Liked Post, Highest Followers etc.',
	guildOnly: true,
	usage: ['+leaderboard <likes>', '+leaderboard <followers>'],
	aliases: ['lb'],
	module: 'Basic',
	example:['+leaderboard likes', '+leaderboard followers'],
	async execute(client, message, args) {
  if(!args[0]) return message.channel.send('You need to supply arguements as `likes` or `followers`.')
  if(args[0].toLowerCase() == 'likes'){
    
    
    const user = await userSchema.find({});
    if(!user) return message.channel.send('`Error 404` - No Enteries.')
    
    const upload = await uploadSchema.find({})
    
    const liked = [];
    
    for(const docs of upload) {
      await liked.push(docs.likes.length)
    }
    
    const like = liked.sort((a,b) => a - b);
    const embed = new Discord.RichEmbed().setColor('#7289da')
    for(let i=0; i < like.length; i++) {
      let index = liked.indexOf(i);
      let likedDoc = upload[index]
      embed.addField(i+1+'. By '+ await client.fetchUser(likedDoc.id).then(u => u.tag), `\`${likedDoc.likes.length}\` Likes\n[Upload](${likedDoc.url})`)
  return message.channel.send(embed)
    }
  
  }
    else if(args[0].toLowerCase() == 'followers'){
      const user = await userSchema.find({});
    if(!user) return message.channel.send('`Error 404` - No Enteries.')
   
    const followers = [];
    
    for(const docs of user) {
      await followers.push(docs.followers.length)
    }
    
    const followed = followers.sort((a,b) => a - b);
    const embed = new Discord.RichEmbed().setColor('#7289da')
    for(let i=0; i < followed.length; i++) {
      let index = followers.indexOf(i);
      let followedDoc = user[index]
      embed.addField(i+1+'. '+ await client.fetchUser(followedDoc._id).then(u => u.tag), `\`${followedDoc.followers.length}\` Followers`)
  return message.channel.send(embed)
    }
  }
  },
}
