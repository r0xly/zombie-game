import { Container, Ticker } from "pixi.js";
import { Game } from "../game";
import { Projectile } from "../objects/projectile";

export class ProjectileController 
{
    projectileContainer = new Container();
    projectiles: Projectile[] = [];

    constructor(game: Game)
    {
        game.pixi.ticker.add(ticker => this.update(ticker));
        game.workspace.addChild(this.projectileContainer);
    }

    addProjectile(projectile: Projectile)
    {
        this.projectileContainer.addChild(projectile);
        this.projectiles.push(projectile);
    }

    private update(ticker: Ticker)
    {
        for (let i = 0; i < this.projectiles.length; i++)
        {
            const projectile = this.projectiles[i];

            projectile.velocity.x += ticker.deltaTime * projectile.accelerations.x;
            projectile.velocity.y += ticker.deltaTime * projectile.accelerations.y;
            projectile.position.x += ticker.deltaTime * -projectile.velocity.x;
            projectile.position.y += ticker.deltaTime * -projectile.velocity.y;
            projectile.elapsedTime += ticker.deltaTime;

            if (projectile.lifeTime > projectile.lifeTime)
            {
                this.projectiles.splice(i, 1);
                projectile.destroy();
            }
        }
    }
}