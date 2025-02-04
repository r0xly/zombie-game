import { match } from "assert";
import { Point } from "../util/point";
import { Humanoid } from "./humanoid";
import { ZombieBehavior } from "./zombie-behavoir";


export function limitPoint(point: Point, limit: number)
{
    const magnitudeSqaured = point.magnitudeSqaured();

    if (magnitudeSqaured > limit ** 2)
    {
        point = point.normalize();
        point = point.multiplyScalar(limit);
    }

    return point;
}

export class Zombie 
{
    id: string;

    humanoid = new Humanoid();
    velocity = new Point();
    acceleration = new Point();
    knockbackAcceleration = new Point();
    knockbackVelocity = new Point();

    maxSpeed = 900;
    maxForce = 200;

    zombieBehvaoir = new ZombieBehavior(this);


    constructor(id: string, x: number, y: number)
    {
        this.id = id;
        this.humanoid.x = x;
        this.humanoid.y = y;
    }

    applyForce(force: Point)
    {
        this.acceleration.x += force.x;
        this.acceleration.y += force.y;
    }

    applyKnockback(angle: number, magnitude: number)
    {
        this.knockbackAcceleration.x = Math.cos(angle) * magnitude;
        this.knockbackAcceleration.y = Math.sin(angle) * magnitude;
    }

    tick(deltaTime: number)
    {
        this.velocity.x += this.acceleration.x * deltaTime;
        this.velocity.y += this.acceleration.y * deltaTime;
        this.velocity = limitPoint(this.velocity, this.maxSpeed);

        this.knockbackVelocity.x += this.knockbackAcceleration.x;
        this.knockbackVelocity.y += this.knockbackAcceleration.y;

        this.humanoid.x += (this.velocity.x + this.knockbackVelocity.x) * deltaTime;
        this.humanoid.y += (this.velocity.y + this.knockbackVelocity.y) * deltaTime;

        this.acceleration.x = 0;
        this.acceleration.y = 0;

        this.knockbackAcceleration.x = 0;
        this.knockbackAcceleration.y = 0;

        this.knockbackVelocity.x *= 0.9;
        this.knockbackVelocity.y *= 0.9;
    }
}