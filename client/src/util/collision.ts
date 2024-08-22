import { Container, Graphics, Point } from "pixi.js";

export function boxCollides(object1: Container, object2: Container)
{
    const bounds1 = object1.getBounds();
    const bounds2 = object2.getBounds();

     return (
        bounds1.x < bounds2.x + bounds2.width && 
        bounds1.x + bounds1.width > bounds2.x && 
        bounds1.y < bounds2.y + bounds2.height &&
        bounds1.y + bounds1.height > bounds2.y
    );
}

export function pointCollides(x: number, y: number, object: Container)
{

    const bounds = object.getLocalBounds();

    return (
        x > bounds.minX &&
        x < bounds.maxX &&
        y > bounds.minY &&
        y < bounds.maxY
    )
}

const graphics = new Graphics();
graphics