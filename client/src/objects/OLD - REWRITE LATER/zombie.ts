import { Point, Sprite, Ticker } from "pixi.js";
import { limitPoint, randomUnitPoint } from "../../util/point";
import { ZombieBehavior } from "./zombie-behavior";

export class Zombie extends Sprite
{
    maxSpeed = 6.0;
    maxforce = 0.3;

    behavior = new ZombieBehavior(this);
    acceleration = new Point();
    velocity = new Point();

    constructor(texture)
    {
        super(texture);
        this.anchor.set(0.5);
        this.tint = "#09d12e";

        const theta = Math.random() * 2 * Math.PI;

        this.velocity = randomUnitPoint()
            .multiplyScalar(this.maxSpeed);
    }


    applyForce(force: Point)
    {
        force = limitPoint(force, this.maxforce);

        this.acceleration.x += force.x;
        this.acceleration.y += force.y;
    }
}