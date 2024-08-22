import { Point, Sprite } from "pixi.js";

export class Projectile extends Sprite
{
    velocity = new Point();
    accelerations = new Point();
    lifeTime = 100;
    elapsedTime = 0;
}