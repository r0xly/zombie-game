import { BoundingBox, QuadTree } from "../util/quadTree";
import { pointCollides } from "../util/collision";
import { Container, Point } from "pixi.js";
import { Game } from "../game";


export class CollisionController 
{
    collisonTree = new QuadTree(new BoundingBox(0, 0, 1000, 1000), 4);

    constructor(private game: Game)
    {

    }

    addContainer(container: Container)
    {
        this.collisonTree.insert(container);
    }

    pointCollides(x: number, y: number)
    {

        const nearbyContainers = this.collisonTree.query(new BoundingBox(x, y, 1, 1));

        for (const container of nearbyContainers)
            if (pointCollides(x, y, container))
                return true;

        return false;
    }
}