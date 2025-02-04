export class Point 
{
    constructor(public x = 0, public y = 0)
    {

    }

    magnitude()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    magnitudeSqaured()
    {
        return this.x * this.x + this.y * this.y;
    }

    multiplyScalar(scalar: number)
    {
        return new Point(this.x * scalar, this.y * scalar)
    }

    limit(limitValue: number)
    {
        const magnitudeSqaured = this.magnitudeSqaured();

        limitValue = limitValue ** 2;

        if (magnitudeSqaured > limitValue)
        {
            const scale = Math.sqrt(limitValue / magnitudeSqaured); 

            this.x *= scale;
            this.y *= scale;
        }
    }

    add(value: Point)
    {
        const sum = new Point(this.x, this.y);
        
        sum.x += value.x;
        sum.y += value.y;

        return sum;
    }

    subtract(value: Point)
    {
        const sum = new Point(this.x, this.y);
        
        sum.x -= value.x;
        sum.y -= value.y;

        return sum;
    }

    normalize()
    {
        const magnitude = this.magnitude();
        const point = new Point(this.x, this.y);

        if (magnitude > 0)
        {
            point.x /= magnitude;
            point.y /= magnitude; 
        }

        return point;
    }
}