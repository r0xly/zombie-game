import { App } from "uWebSockets.js";
import { Server } from "./server";

import "../../common/src/messages/message-objects";

const server = new Server(App(), 9001);

let i = 0;


setInterval(() => 
{
    if (server.zombies.getZombies().length < 120)
    {
        i += 1;
        server.zombies.spawnZombie("z" + i, 900 + Math.random() * 2500, 900 + Math.random() * 2500);
    }
}, 500)