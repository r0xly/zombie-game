import { Assets, curveEps, Point, Sprite, Texture } from "pixi.js"
import { Projectile } from "./projectile";
import { ProjectileController } from "../controllers/projectile-controller";

export interface BlasterOptions
{
    projectileSpeed: number,
    anchorPoint: Point,
    texture: string,
    fireRate: number,
    offset: Point,
    
}

export class Blaster extends Sprite
{
    nextFireTick = 0;

    constructor(public data: BlasterOptions, private projectileController: ProjectileController)
    {
        super(Assets.get(data.texture));

        this.anchor = data.anchorPoint;
        this.position = data.offset;
    }

    lookAt(x: number, y: number)
    {
        const globalPostion = this.getGlobalPosition();

        const angle = Math.atan2(globalPostion.y - y, globalPostion.x - x);

        this.rotation = angle;
    }

    fireAt(x: number, y: number)
    {
        const currentTick = performance.now();
        
        if (currentTick < this.nextFireTick)
            return;
        
        this.nextFireTick = currentTick + this.data.fireRate;

        const velcoity = this
            .getGlobalPosition()
            .subtract(new Point(x, y))
            .normalize()
            .multiplyScalar(this.data.projectileSpeed);

        const projectile = new Projectile();
        projectile.position = this.parent.position;
        projectile.texture = Assets.get("projectile");
        projectile.tint = "#001529";
        projectile.velocity.x = velcoity.x;
        projectile.velocity.y = velcoity.y;

        this.projectileController.addProjectile(projectile);
    }
}