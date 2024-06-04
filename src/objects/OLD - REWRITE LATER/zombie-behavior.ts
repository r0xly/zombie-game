import { Point } from "pixi.js";
import { Zombie } from "./zombie";
import { noise } from "../../util/noise";
import { limitPoint } from "../../util/point";

const SEPERATION_DISTANCE = 150;
const SEPERATION_DISTANCE_SQAURED = SEPERATION_DISTANCE ** 2;
const ALIGNMENT_DISTANCE_SQAURED = 200 ** 2;
const COHESION_DISTANCE_SQAURED = 200 ** 2;
const SEED_CONSTANT = 1000000

export class ZombieBehavior 
{
    seed = Math.random() * SEED_CONSTANT;
    wanderSmoothnes = 2000;

    constructor(private zombie: Zombie)
    {

    }

    seek(point: Point)
    {
        const desiredVelocity = point
            .subtract(this.zombie.position)
            .normalize()
            .multiplyScalar(this.zombie.maxSpeed);
        
        const steeringForce = desiredVelocity.subtract(this.zombie.velocity);

        this.zombie.applyForce(steeringForce);
    }

    wander()
    {
        const tick = performance.now();

        const force = new Point(
            noise((tick + this.seed) / this.wanderSmoothnes),
            noise((tick - this.seed) / this.wanderSmoothnes)
        ).multiplyScalar(this.zombie.maxforce)


        this.zombie.applyForce(force);
    }

    seperate(zombies: Zombie[])
    {
        let sum = new Point();
        let count = 0;

        for (let zombie of zombies)
        {
            const distanceSqaured = zombie.position
                .subtract(this.zombie.position)
                .magnitudeSquared();
            
            if (distanceSqaured > 0 && distanceSqaured < SEPERATION_DISTANCE_SQAURED)
            {
                const differnce = this.zombie.position
                    .subtract(zombie.position)
                    .normalize()
                    .multiplyScalar(1 / SEPERATION_DISTANCE);
                
                sum = sum.add(differnce);
                count++;
            }
        }

        if (count > 0)
        {
            const steeringForce = sum
                .multiplyScalar(1 / count)
                .normalize()
                .multiplyScalar(this.zombie.maxSpeed)
                .subtract(this.zombie.velocity);
            
            this.zombie.applyForce(steeringForce);
        }

    }

    align(zombies: Zombie[])
    {
        let sum = new Point();
        let count = 0;

        for (let zombie of zombies)
        {
            const distanceSqaured = this.zombie.position
                .subtract(zombie.position)
                .magnitudeSquared();

            if (this.zombie !== zombie && distanceSqaured < ALIGNMENT_DISTANCE_SQAURED)
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
                .multiplyScalar(this.zombie.maxSpeed);
            
            const steeringForce = sum.subtract(this.zombie.velocity)

            this.zombie.applyForce(steeringForce);
        }
    }

    cohesion(zombies: Zombie[]) 
    {
        let sum = new Point();
        let count = 0;

        for (let zombie of zombies)
        {
            const distanceSqaured = this.zombie.position
                .subtract(zombie.position)
                .magnitudeSquared();

            if (this.zombie !== zombie && distanceSqaured < COHESION_DISTANCE_SQAURED)
            {
                sum.add(zombie.position);
                count++;
            }
        }

        if (count > 0)
        {
            sum = sum.multiplyScalar(1 / count);

            this.seek(sum);
        }
    }
}