import * as PIXI from 'pixi.js';

export class BoundingBox {
    constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number
    ) {}

    intersects(other: BoundingBox): boolean {
        return !(
            this.x + this.width < other.x ||
            this.x > other.x + other.width ||
            this.y + this.height < other.y ||
            this.y > other.y + other.height
        );
    }
}

export class QuadTree {
    private bounds: BoundingBox;
    private capacity: number;
    private objects: PIXI.Container[] = [];
    private divided: boolean = false;
    private northWest: QuadTree | null = null;
    private northEast: QuadTree | null = null;
    private southWest: QuadTree | null = null;
    private southEast: QuadTree | null = null;

    constructor(bounds: BoundingBox, capacity: number) {
        this.bounds = bounds;
        this.capacity = capacity;
    }

    subdivide() {
        const x = this.bounds.x;
        const y = this.bounds.y;
        const w = this.bounds.width / 2;
        const h = this.bounds.height / 2;

        this.northWest = new QuadTree(new BoundingBox(x, y, w, h), this.capacity);
        this.northEast = new QuadTree(new BoundingBox(x + w, y, w, h), this.capacity);
        this.southWest = new QuadTree(new BoundingBox(x, y + h, w, h), this.capacity);
        this.southEast = new QuadTree(new BoundingBox(x + w, y + h, w, h), this.capacity);

        this.divided = true;
    }

    insert(container: PIXI.Container) {
        const bounds = container.getLocalBounds();

        const boundingBox = new BoundingBox(
            container.x + bounds.x,
            container.y + bounds.y,
            bounds.width,
            bounds.height
        );


        console.log(boundingBox)

        if (!this.bounds.intersects(boundingBox)) {
            return false;
        }

        if (this.objects.length < this.capacity) {
            this.objects.push(container);
            return true;
        } else {
            if (!this.divided) {
                this.subdivide();
            }

            if (this.northWest?.insert(container) || this.northEast?.insert(container) ||
                this.southWest?.insert(container) || this.southEast?.insert(container)) {
                return true;
            }
        }
        return false;
    }

    queryContainer(container: PIXI.Container)
    {
        const bounds = container.getLocalBounds();

        const boundingBox = new BoundingBox(
            container.x + bounds.x,
            container.y + bounds.y,
            bounds.width,
            bounds.height
        );

        return this.query(boundingBox);
           
    }

    query(range: BoundingBox, found: PIXI.Container[] = []): PIXI.Container[] {
        if (!this.bounds.intersects(range)) {
            return found;
        }

        for (let obj of this.objects) {
            const bounds = obj.getLocalBounds();
            const boundingBox = new BoundingBox(
                obj.x + bounds.x,
                obj.y + bounds.y,
                bounds.width,
                bounds.height
            );

            if (range.intersects(boundingBox)) {
                found.push(obj);
            }
        }

        if (this.divided) {
            this.northWest?.query(range, found);
            this.northEast?.query(range, found);
            this.southWest?.query(range, found);
            this.southEast?.query(range, found);
        }

        return found;
    }
}
