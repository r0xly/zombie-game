import { ToolState } from "../../../../common/src/types/tool-state";
import { Tool, ToolOptions } from "./tool";
import { easeInOutBack, easeInOutExpo, easeOutExpo, easeOutQuad, easeOutQuadBounce } from "../../util/tween";

export interface WeaponOptions extends ToolOptions
{
    /** The cooldown (in ms) between swings. */
    swingDebounce: number,
}


export class Weapon extends Tool
{
    private previousSwingTick = 0;

    constructor(public options: WeaponOptions)
    {
        super(options);
    }

    update(mouseX: number, mouseY: number)
    {
        const currentTick = performance.now();

        // Swing animation
        if (this.state === ToolState.active)
        {
            const swingDistance = -(Math.PI / 4);
            const swingDuration = this.options.swingDebounce * 0.9;

            const t = (currentTick - this.previousSwingTick) / swingDuration;

            if (t < 0.25)
            {
                // First half: Accelerate upwards
                this.rotationOffset = swingDistance * easeOutExpo(t * 4);
            }
            else if (t < 0.75)
            {
                // Second half: Decelerate downwards
               this.rotationOffset = swingDistance - 2 * swingDistance * easeInOutExpo((t - 0.25) * 2);
            }
            else if (t < 1)
            {
                // Third half: Return to original postion
                this.rotationOffset = -swingDistance + swingDistance * easeOutQuadBounce((t - 0.75) * 4) 
            }
        }

        this.lookAt(mouseX, mouseY);
    }


    swing()
    {
        const currentTick = performance.now();

        if (currentTick > this.previousSwingTick + this.options.swingDebounce) 
        {
            this.previousSwingTick = currentTick;
            this.state = ToolState.active;
            
            setTimeout(() =>
            {
                this.state = ToolState.idle;
            }, 
            this.options.swingDebounce);
        }
    }

    
}