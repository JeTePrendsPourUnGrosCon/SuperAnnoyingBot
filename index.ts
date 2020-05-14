import {config as loadEnv} from 'dotenv';
import { Client, GuildMember, VoiceChannel, VoiceConnection } from 'discord.js';
import { setInterval } from 'timers';
import Timeout = NodeJS.Timeout;

loadEnv();
const client = new Client();
const users = JSON.parse(process.env.USERS);
let conn: VoiceConnection;
let interval: Timeout;

async function panic(client: Client) {
    let guild = client.guilds.resolve(process.env.SERVER);
    let channel = guild.channels.cache.find(val => {
        if (val instanceof VoiceChannel) {
            let member = val.members.find(val => users.find(val2 => val.id === val2));
            if (member instanceof GuildMember) {
                console.log(`Leon trouvé dans ${val.name}`);
                return true;
            }
        }
        return false;
    });
    if (channel) {
        return await (channel as VoiceChannel).join();
    } else {
        return false;
    }
}

function check() {
    if (conn) {
        if (conn.status === 4) {
            console.log('disconnected');
            conn = undefined;
        } else {
            conn.play('alarm.ogg', {volume: 0.25});
        }
    } else {
        panic(client).then(connection => {
            if (connection) {
                conn = connection;
                connection.play('alarm.ogg', {volume: 0.25});
            } else {
                console.log('Not found');
            }
        });
    }
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    interval = setInterval(check, 2500);
});

client.login(process.env.TOKEN).then(res => {
    console.log(`The token *****${res.substr(-5, 5)} is working.`);
});