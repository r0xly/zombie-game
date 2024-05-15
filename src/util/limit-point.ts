import { Point } from "pixi.js";

export function limitPoint(point: Point, limit: number)
{
    const magnitudeSqaured = point.magnitudeSquared();

    if (magnitudeSqaured > limit ** 2)
    {
        point = point.normalize();
        point = point.multiplyScalar(limit);
    }

    return point;
}