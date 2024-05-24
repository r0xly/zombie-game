import { Container, Point, Ticker } from "pixi.js";
import { Zombie } from "./zombie";
import { limitPoint } from "../../../util/point-util";

export const zombieContainer = new Container();
export const zombies: Zombie[] = [];

export function addZombie(zombie: Zombie)
{
    zombieContainer.addChild(zombie);
    zombies.push(zombie);
}

export function updateZombies(ticker: Ticker) 
{
    for (let i = 0; i < zombies.length; i++) 
    {
        const zombie = zombies[i];

        if (zombie.destroyed)
        {
            zombies.splice(i, 1);
            continue;
        }

        zombie.velocity.x += ticker.deltaTime * zombie.acceleration.x;
        zombie.velocity.y += ticker.deltaTime * zombie.acceleration.y;
        zombie.velocity = limitPoint(zombie.velocity, zombie.maxSpeed);

        zombie.position.x += ticker.deltaTime * zombie.velocity.x;
        zombie.position.y += ticker.deltaTime * zombie.velocity.y;

        zombie.acceleration.x = 0;
        zombie.acceleration.y = 0;
    }
}