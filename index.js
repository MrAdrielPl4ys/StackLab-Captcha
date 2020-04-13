const Discord = require("discord.js"); // puxando a livraria discord.js
const config = require("./config.json"); // puxando o arquivo config.json
const fs = require("fs"); // definindo fs
const client = new Discord.Client(); // definindo o nome do client

// um evento ready, que traduzindo, fica 'pronto'. Como ele diz, iremos criar o evento para verificar se o bot está pronto para ligar.
client.on('ready', () => { // setando o evento com nosso Discord.Client
    console.log(`Bot foi iniciado com sucesso`); // caso não haja erro, o bot enviara no console que ligou
    client.user.setActivity('Adicionando cargo aos usuários.') // setando a rich presence do nosso bot
});  

client.on('guildMemberAdd', membro => { // definimos o nome desse evento, como: membro
    var cargo = membro.guild.roles.cache.get("691904146357616660"); // puxamos o ID de um cargo, no qual, iremos adicionar para o usuário
    var canal = client.channels.cache.get("692196839482458232"); // puxando mais um canal, aonde iremos enviar um sistema de CAPTCHA!

    // embed do CAPTCHA    
    let embed = new Discord.MessageEmbed()

    .setTitle(`SISTEMA DE CAPTCHA`)
    .setDescription(`Olá **${membro.user.username}**, para receber o seu cargo, clique no emoji abaixo`)
    .setColor('#97f2ff') 

    canal.send(`${membro}`, embed).then(msg => { // criando um nome para a function 'then', no caso: msg
        msg.react("699367631894872086"); // reagimos nesse mensagem com um emoji
  
        let filtro = (reaction, usuario) => reaction.emoji.id === "699367631894872086" && usuario.id === membro.id; // criamos um filtro, para definir quem reagiu nessa mensagem
        let coletor = msg.createReactionCollector(filtro, {max: 1}); // criamos um coletor, para coletar informações do usuário que reagiu

        coletor.on('collect', r => { // utilizamos a variável do coletor, criando um evento sobre quais ações iremos fazer 
            r.remove(membro.id); // deletando o clique do usuário, sobre o emoji
            membro.roles.add(cargo.id); // caso ele clique, adicionaremos o cargo à ele
            msg.delete() // deletando a mensagem de CAPTCHA
        });
    });
});

client.on('message', message => { // nome desse evento, foi setado como: message
    if (message.author.bot) return; // puxando o nome definido, bloquearemos o uso de comandos por outros bots
    if (message.channel.type === "dm") return; // caso seja uma mensagem privada ao nosso bot, não retornaremos

    let prefix = "c."; // puxando o prefixo do nosso bot
    if (!message.content.startsWith(prefix)) return; // para evitar bugs, setaremos uma function, definindo que o bot respondera apenas para mensagens que possuem seu prefixo, no inicio
    var args = message.content.substring(config.prefix.length).split(" "); // definindo o que seria os argumentos
    let cmd = args.shift().toLowerCase(); // puxando dos args, setaremos que o bot pode responder sim, a comandos com a letra inicial maiuscula

    let command = client.commands.get(cmd) // puxaremos o conteudo de tal comando
    if (command) { // caso o membro utilize um comando inexistente, daremos o erro
    command.run(client, message, args); // essa é a base de todo arquivo js
  } else {
    message.reply(`eu não possuo comandos! Sou apenas um bot de captcha.`); // mensagem de comando inexistente
  }
})

client.login(config.token);
