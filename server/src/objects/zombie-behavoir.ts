import { match } from "assert";
import { noise } from "../../../common/src/util/noise";
import { Point } from "../util/point";
import { Zombie } from "./zombie";
import { Player } from "../controllers/player-controller";

const SEPERATION_DISTANCE = 100;
const SEPERATION_DISTANCE_SQAURED = SEPERATION_DISTANCE ** 2;
const ALIGNMENT_DISTANCE_SQAURED = 200 ** 2;
const PLAYER_ATTACK_RADIUS_SQAURED = 700 ** 2;
const COHESION_DISTANCE_SQAURED = 200 ** 2;
const SEED_CONSTANT = 1000000

export class ZombieBehavior 
{
    seed = Math.random() * SEED_CONSTANT;
    wanderSmoothnes = 5000;
    xoff = 0;
    playerInSight = false;

    lastWanderTick = performance.now();

    constructor(private zombie: Zombie)
    {

    }

    seek(point: Point)
    {
        const desiredVelocity = point
            .subtract(new Point(this.zombie.humanoid.x, this.zombie.humanoid.y))
            .normalize()
            .multiplyScalar(this.zombie.maxSpeed);
        
        const steeringForce = desiredVelocity.subtract(this.zombie.velocity);

        this.zombie.applyForce(steeringForce);
    }
    
    moveTowards(point: Point)
    {
        const desiredVelocity = point
            .subtract(new Point(this.zombie.humanoid.x, this.zombie.humanoid.y))
            .normalize()
            .multiplyScalar(this.zombie.maxForce);

        this.zombie.applyForce(desiredVelocity);
    }

    wander()
    {
        if (this.playerInSight)
            return;

        this.xoff += 0.01 * 0.1;
        const angle = noise(this.seed + this.xoff) * Math.PI * 4;
        const streer = new Point();
        streer.x = Math.cos(angle) * this.zombie.maxForce;
        streer.y = Math.sin(angle) * this.zombie.maxForce;

        this.lastWanderTick = performance.now();
        this.zombie.applyForce(streer);
    }

    boundaries()
    {
        let desired = new Point();

        if (this.zombie.humanoid.x < 0)
        {
            desired = new Point(this.zombie.maxSpeed, this.zombie.velocity.y);
        }
        else if (this.zombie.humanoid.x > 5000)
        {
            desired = new Point(-this.zombie.maxSpeed, this.zombie.velocity.y);
        }

        if (this.zombie.humanoid.y < 0)
        {
            desired = new Point(this.zombie.velocity.x, this.zombie.maxSpeed);
        }
        else if (this.zombie.humanoid.y > 5000)
        {
            desired = new Point(this.zombie.velocity.x, -this.zombie.maxSpeed);
        }

        desired = desired.normalize().multiplyScalar(this.zombie.maxForce * 100);

        this.zombie.applyForce(desired);
    }

    attackPlayer(players: Player[])
    {
        this.playerInSight = false;
        let closestPlayer: Player | undefined;
        let closesetDistanceSqaure = 10000000000000000000;

        for (const player of players)
        {
            const distanceSqaured = (player.humanoid.x - this.zombie.humanoid.x) ** 2 + (player.humanoid.y - this.zombie.humanoid.y) ** 2;

            if (distanceSqaured < closesetDistanceSqaure && distanceSqaured < PLAYER_ATTACK_RADIUS_SQAURED)
            {
                closestPlayer = player;
                closesetDistanceSqaure = distanceSqaured;
            }
        }

        if (closestPlayer)
        {
            this.playerInSight = true;
            this.seek(new Point(closestPlayer.humanoid.x + closestPlayer.humanoid.velocity.x * 5000, closestPlayer.humanoid.y + closestPlayer.humanoid.velocity.y * 5000))
        }
    }

    seperate(zombies: Zombie[])
    {
        let sum = new Point();
        let count = 0;

        for (let zombie of zombies)
        {
            const distanceSqaured = (this.zombie.humanoid.x - zombie.humanoid.x) ** 2 + (this.zombie.humanoid.y - zombie.humanoid.y) ** 2;
            
            if (distanceSqaured > 0 && distanceSqaured < SEPERATION_DISTANCE_SQAURED)
            {
                const differnce = new Point(this.zombie.humanoid.x - zombie.humanoid.x, this.zombie.humanoid.y - zombie.humanoid.y)
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
        if (this.attackPlayer)
            return;

        let sum = new Point();
        let count = 0;

        for (let zombie of zombies)
        {
            const distanceSqaured = (this.zombie.humanoid.x - zombie.humanoid.x) ** 2 + (this.zombie.humanoid.y - zombie.humanoid.y) ** 2;

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
            const distanceSqaured = (this.zombie.humanoid.x - zombie.humanoid.x) ** 2 + (this.zombie.humanoid.y - zombie.humanoid.y) ** 2;

            if (this.zombie !== zombie && distanceSqaured < COHESION_DISTANCE_SQAURED)
            {
                sum.x += zombie.humanoid.x;
                sum.y += zombie.humanoid.y;
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