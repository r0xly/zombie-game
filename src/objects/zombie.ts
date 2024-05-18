import { Point, Sprite, Ticker } from "pixi.js";
import { limitPoint } from "../util/limit-point";
import { noise } from "../util/noise";
import { Player } from "./player";


export class Zombie extends Sprite
{
    
    maxSpeed = 6
    maxforce = 0.3;
    velocity = new Point(0, 0);
    acceleration = new Point(0, 0);

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


    seek(player)
    {
        let x = player.x + (player.velocity.x || 0) * 100;
        let y = player.y - (player.velocity.y || 0) * 100;
        let desired = new Point(x - this.x, y - this.y)
            .normalize();
        
        let distance = desired.magnitudeSquared();

        if (distance < 10)
        {
            let m = map(distance, 0, 100, 0, this.maxSpeed)
            desired = desired.multiplyScalar(this.maxSpeed);
        }
        else
        {
            desired = desired.multiplyScalar(this.maxSpeed);
        }

        let steer = limitPoint(new Point(desired.x - this.velocity.x, desired.y - this.velocity.y), this.maxforce);

        this.applyForce(steer);
    }

    wanderTheta = 0;
    wanderSeed = Math.random() * 1000000

    wander(t: number)
    {
        let x = noise((t + this.wanderSeed) / 2000) * 2 - 1;
        let y = noise((t - this.wanderSeed) / 2000) * 2 - 1;

        this.applyForce(limitPoint(new Point(x, y), this.maxforce));
    }

    seperate(zombies: Zombie[])
    {
        let desiredSeperation = 100;
        let sum = new Point();

        let count = 0;

        for (let zombie of zombies)
        {
            let d = zombie.position.subtract(this.position).magnitude();

            if (d > 0 && d < desiredSeperation)
            {
                let diff = this.position
                    .subtract(zombie.position)
                    .normalize()
                    .multiplyScalar(1 / d);

                sum = sum.add(diff);
                count++;
            }
        }

        if (count > 0)
        {
            let steer = sum
                .multiplyScalar(1 / count)
                .normalize()
                .multiplyScalar(this.maxSpeed)
                .subtract(this.velocity);

            steer = limitPoint(steer, this.maxforce);

            this.applyForce(steer);
        }
    }

    align(zombies: Zombie[])
    {
        const neighborDistance = 200;
        let sum = new Point();
        let count = 0;

        for (let zombie of zombies)
        {
            const distance = this.position
                .subtract(zombie.position)
                .magnitude();

            if (this !== zombie && distance < neighborDistance)
            {
                sum = sum.add(zombie.velocity);
                count++
            }
        }

        if (count > 0)
        {
            sum = sum
                .multiplyScalar(1 / count)
                .normalize()
                .multiplyScalar(this.maxSpeed);
            
            const steer = limitPoint(sum.subtract(this.velocity), this.maxSpeed)
            this.applyForce(steer)
        }
    }

    cohesion(zombies: Zombie[]) 
    {
        const neighborDistance = 200;
        let sum = new Point();
        let count = 0;

        for (let zombie of zombies)
        {
            const distance = this.position
                .subtract(zombie.position)
                .magnitude();

            if (zombie !== this  && distance < neighborDistance)
            {
                sum.add(zombie.position);
                count++;
            }
        }

        if (count > 0)
        {
            sum = sum.multiplyScalar(1 / count);
            this.seek({ x: sum.x, y: sum.y, velocity: new Point() });
        }
    }

    applyForce(force: Point)
    {
        this.acceleration.x += force.x;
        this.acceleration.y += force.y;
    }

    

}

function map(x: number, in_min: number, in_max: number, out_min: number, out_max: number) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}