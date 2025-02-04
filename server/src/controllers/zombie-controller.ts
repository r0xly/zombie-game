import { SyncZombieHumanoids, ZombieDespawned, ZombieSpawned } from "../../../common/src/messages/message-objects";
import { MessageType } from "../../../common/src/messages/message-type";
import { HUMANOID_UPDATE_TICK } from "../config";
import { Zombie } from "../objects/zombie";
import { Server } from "../server";


export class ZombieController
{
    private zombiesMap: Record<string, Zombie> = {};       // A map of zombie IDs to their associated Zombie objects

    constructor(private server: Server)
    {
        server.messages.on(MessageType.AttackZombie, (player, message) =>
        {
            const zombie = this.zombiesMap[message.zombieId];

            if (zombie)
            {
                zombie.applyKnockback(message.knockbackAngle, message.knockbackForce);
                zombie.humanoid.health -= message.damage;

                if (zombie.humanoid.health === 0)
                {
                    this.despawnZombie(message.zombieId);
                }
            }
        });

        setInterval(() => 
        {
            this.updateZombies(HUMANOID_UPDATE_TICK / 1000, this.getZombies());

        }, HUMANOID_UPDATE_TICK);
    }

    getZombies()
    {
        return Object.values(this.zombiesMap);
    }

    spawnZombie(zombieId: string, x: number, y: number)
    {
        const zombie = new Zombie(zombieId, x, y);

        this.zombiesMap[zombieId] = zombie;
        this.server.messages.broadcastMessage(new ZombieSpawned(zombieId, x, y));
    }
    

    despawnZombie(zombieId: string)
    {
        const zombie = this.zombiesMap[zombieId];

        if (zombie)
        {
            delete this.zombiesMap[zombieId];

            this.server.messages.broadcastMessage(new ZombieDespawned(zombieId));
        }
    }

    updateZombies(deltaTime: number, zombies: Zombie[])
    {
        for (const zombie of zombies)
        {
            zombie.zombieBehvaoir.wander();
            zombie.zombieBehvaoir.boundaries();
            zombie.zombieBehvaoir.align(zombies);
            zombie.zombieBehvaoir.attackPlayer(this.server.players.getPlayers());
            //zombie.zombieBehvaoir.cohesion(zombies);
            zombie.zombieBehvaoir.seperate(zombies);
            zombie.tick(deltaTime);
        }
    }
}