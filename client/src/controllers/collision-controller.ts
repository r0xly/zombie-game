import { BoundingBox, QuadTree } from "../util/quadTree";
import { boxCollides, pointCollides } from "../util/collision";
import { Container, ContextIds, Point } from "pixi.js";
import { Game } from "../game";

// IMPORTANT NOTE: This controller should only be used for detecting collisons with UNMOVABLE objects. This only sets up the quad tree onces!! For dynamicly moving objects, use somehting else
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
        {
            if (pointCollides(x, y, container))
            {
                return true;
            }
        }

        return false;
    }

    containerCollides(container: Container)
    {
        const containers: Container[] = [];
        const nearbyContainers = this.collisonTree.queryContainer(container);

        for (const possibleContainer of nearbyContainers)
        {
            if (boxCollides(container, possibleContainer))
            {
                containers.push(possibleContainer);
            }
        }
        
        return containers;
    }
}