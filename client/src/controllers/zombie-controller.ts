import { SyncZombieHumanoids, WelcomeMessage } from "../../../common/src/messages/message-objects";
import { MessageType } from "../../../common/src/messages/message-type";
import { Game } from "../game";
import { Humanoid } from "../objects/humanoid"

export class ZombieController
{
    zombiesMap = new Map<string, Humanoid>();       // A map of zombie Ids to their associated Humanoid objects

    constructor(private game: Game)
    {
        game.networkController.on(MessageType.ZombieSpawned, message =>
        {
            this.spawnZombie(message.zombieId, message.x, message.y);
        });

        game.networkController.on(MessageType.SyncZombieHumanoids, message =>
        {
            this.syncZombies(message);
        });

        game.networkController.on(MessageType.Welcome, message =>
        {
            this.welcome(message);
        });

        game.networkController.on(MessageType.ZombieDespawned , message =>
        {
            this.despawnZombie(message.zombieId);
        });
    }

    welcome(welcome: WelcomeMessage)
    {
        for (const zombie of welcome.zombies)
        {
            this.spawnZombie(zombie.zombieId, zombie.x, zombie.y);
        }
    }

    spawnZombie(id: string, x: number, y: number)
    {
        const zombie = new Humanoid();
        zombie.x = x;
        zombie.y = y;
        zombie.tint = "#09d12e";        // Green

        this.game.workspace.addChild(zombie);
        this.zombiesMap.set(id, zombie);
    }

    despawnZombie(id: string)
    {
        const zombie = this.zombiesMap.get(id);

        if (zombie)
        {
            this.zombiesMap.delete(id);
            zombie.destroy();
        }
    }

    syncZombies(message: SyncZombieHumanoids)
    {
        for (const zombieId in message.zombies)
        {
            const zombieData = message.zombies[zombieId];
            const humanoid = this.zombiesMap.get(zombieId);

            if (zombieData && humanoid)
            {
                humanoid.x = zombieData.position.x;
                humanoid.y = zombieData.position.y;   
            }
            else
            {
                console.warn(`Failed to sync zombie with id >>${zombieId}<<. Zombie does not exist!`);
            }
        }
    }

    getZombies()
    {
        return Object.values(this.zombiesMap);
    }
}