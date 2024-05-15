import { Assets, curveEps, Point, Sprite, Texture } from "pixi.js"
import { addProjectile } from "../controllers/projectile-controller";
import { Projectile } from "./projectile";

interface BlasterOptions
{
    projectileSpeed: number,
    anchorPoint: Point,
    texture: Texture,
    fireRate: number,
    offset: Point,
    
}

export class Blaster extends Sprite
{
    nextFireTick = 0;

    constructor(public data: BlasterOptions)
    {
        super(data.texture);

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
        projectile.position = this.getGlobalPosition();
        projectile.texture = Assets.get("projectile");
        projectile.velocity.x = velcoity.x;
        projectile.velocity.y = velcoity.y;

        addProjectile(projectile);
    }
}