import { Container, Ticker } from "pixi.js";
import { Projectile } from "../objects/projectile";
import { zombies } from "../objects/entities/zombies/zombie-controller";

const projectiles: Projectile[] = [];

export const projectileContainer = new Container();

function collides(objectA, objectB)
{
    const bounds1 = objectA.getBounds();
    const bounds2 = objectB.getBounds();

    return (
        bounds1.x < bounds2.x + bounds2.width
        && bounds1.x + bounds1.width > bounds2.x
        && bounds1.y < bounds2.y + bounds2.height
        && bounds1.y + bounds1.height > bounds2.y
    );
}

export function updateProjectiles(ticker: Ticker)
{
    for (let i = 0; i < projectiles.length; i++) 
    {
        const projectile = projectiles[i];
        

        projectile.time += ticker.deltaTime;
        projectile.x -= ticker.deltaTime * projectile.velocity.x;
        projectile.y -= ticker.deltaTime * projectile.velocity.y;
        projectile.velocity.x += ticker.deltaTime * projectile.acceleration.x;
        projectile.velocity.y += ticker.deltaTime * projectile.acceleration.y;

        for (const zombie of zombies)
        {
            if (!zombie.destroyed && projectile && collides(zombie, projectile))
            {
                projectiles.splice(i, 1);
                projectile.destroy();
                zombie.destroy();
                break;
            }
        }
        

        if (!projectile.destroyed && projectile.time > projectile.lifeTime) 
        {
            projectiles.splice(i, 1);
            projectile.destroy();
        }
    }
}

export function addProjectile(projectile: Projectile)
{
    projectileContainer.addChild(projectile);
    projectiles.push(projectile);
}
