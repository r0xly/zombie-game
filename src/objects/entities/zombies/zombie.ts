import { Point, Sprite, Ticker } from "pixi.js";
import { limitPoint } from "../../../util/point-util";
import { noise } from "../../../util/noise";
import { Player } from "../../player";
import { ZombieBehavior } from "./zombie-behavior";


export class Zombie extends Sprite
{
    
    maxSpeed = 6
    maxforce = 0.3;
    velocity = new Point(0, 0);
    acceleration = new Point(0, 0);
    behavior = new ZombieBehavior(this);

    constructor(texture)
    {
        super(texture);
        this.anchor.set(0.5);
        this.tint = "#09d12e";

        const randomAngle = Math.random() * 2 * Math.PI;
        this.velocity = new Point(
            Math.cos(randomAngle) * this.maxSpeed,
            Math.sin(randomAngle) * this.maxSpeed
        )
    }


    applyForce(force: Point)
    {
        force = limitPoint(force, this.maxforce);

        this.acceleration.x += force.x;
        this.acceleration.y += force.y;
    }
}