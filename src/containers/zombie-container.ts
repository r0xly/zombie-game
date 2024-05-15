import { Container, Point, Ticker } from "pixi.js";
import { Zombie } from "../objects/zombie";
import { limitPoint } from "../util/limit-point";

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



        zombie.velocity = limitPoint(zombie.velocity.add(zombie.acceleration.multiplyScalar(ticker.deltaTime)), zombie.maxSpeed);
        zombie.position = zombie.position.add(zombie.velocity.multiplyScalar(ticker.deltaTime));
        zombie.acceleration = new Point();
    }
}