import { Sprite } from "pixi.js";

export class Projectile extends Sprite
{
    velocity = { x: 0, y: 0 };
    acceleration = { x: 0, y: 0};
    lifeTime = 100;
    time = 0;
}