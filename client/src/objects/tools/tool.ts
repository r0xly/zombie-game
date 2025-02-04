import { Assets, Point, Sprite } from "pixi.js";
import { ToolState } from "../../../../common/src/types/tool-state";

export interface ToolOptions
{
    /** The tool's name. This must be unique! */
    name: string,

    /** The tool's catagory. This is used for idenitifying tools when syncing. Spelling is important. */ 
    catagory: string,

    /** Alias of the tool's sprite asset. Warning: the sprite should already be loaded before the tool is created. */
    texture: string,

    /** The tool's offset from the player. */
    offset: Point,

    /** The tool's rotation (in radians). */
    rotation: number

    /** The tool's center of rotation. This should be positioned around the middle of the tool's handle. */
    anchorPoint: Point,

    /** (Optional) Position of the hands added to the tool. There should be no more than 2. */
    handPositions?: Point[],
}

export class Tool extends Sprite
{
    /** The angle (in radians) the tool is rotated around the player. */
    private rotationAroundPlayer = 0;

    /** The angle (in radians) the tool's rotation is offseted by. This is mostly used for the tool's animation. */
    rotationOffset = 0;

    state = ToolState.idle;

    constructor(public options: ToolOptions)
    {
        const texture = Assets.get(options.texture);

        if (texture === undefined)
        {
            console.error(`Error: failed to create tool. Could not get tool's texture. No asset with the alias ${options.texture} exists.`);
            
        }

        super(texture);

        this.position = this.options.offset;
        this.rotation = this.options.rotation;
        this.anchor = this.options.anchorPoint;

        if (options.handPositions)
        {
            for (const position of options.handPositions)
            {
                const hand = Sprite.from("hand");
                hand.position = position;

                this.addChild(hand);
            }
        }
    }

    /**
     * Rotates the tool to face a specificed position. Note: this method will also offset the rotation by rotationOffset.  
     * 
     * @param lookX
     * @param lookY
     * @returns {number} The angle the tool is facing (in radians). 
     */
    lookAt(lookX: number, lookY: number)
    {
        const globalPostion = this.parent.getGlobalPosition();
        const angle = Math.atan2(globalPostion.y - lookY, globalPostion.x - lookX) + this.rotationOffset;

        return this.setRotation(angle);
    }

    /**
     * Set the tool's rotation around the player to a specified number. Note: this method will offset the angle by rotationOffset. 
     * 
     * @param angle The specified rotation (in radians). 
     * @returns {number} The angle the tool is facing (in radians). 
     */

    setRotation(angle: number)
    {
        angle += this.rotationOffset;

        const offset = this.options.offset;

        this.position.x = offset.x * Math.cos(angle) - offset.y * Math.sin(angle);
        this.position.y = offset.x * Math.sin(angle) + offset.y * Math.cos(angle);
        this.rotation = this.options.rotation + angle;

        this.rotationAroundPlayer = angle;

        return angle;
    }


    /**
     * Returns the tool's current rotation (in radians) around the player.
     */
    getRotation()
    {
        return this.rotationAroundPlayer;
    }
}