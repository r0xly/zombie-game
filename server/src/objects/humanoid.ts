import EventEmitter from "events";
import { HumanoidState } from "../../../common/src/types/humanoid-state";
import { DEFAULT_HEALTH } from "../../../common/src/data/default-player-data";
import { Point } from "../util/point";
import { HumanoidData } from "../../../common/src/types/humanoid-data";

interface Tool
{
    name: string,
    catagory: string,
    rotation: number
}

export declare interface Humanoid
{
    on(event: string, listener: Function);
} 

export class Humanoid extends EventEmitter
{
    health = DEFAULT_HEALTH;
    x = 0;
    y = 0;
    velocity = new Point();
    tool?: Tool;

    private _state = HumanoidState.idle;

    constructor()
    {
        super();
    }

    getData(): HumanoidData
    {
        const humanoidData = 
        {
            position: 
            {
                x: this.x,
                y: this.y
            },

            velocity:
            {
                x: this.velocity.x,
                y: this.velocity.y
            },

            state: this.state,

            tool: this.tool,
        }

        return humanoidData;
    }


    set state(value: HumanoidState)
    {
        // TODO: Add event emitter
        this._state = value;
    }

    get state() 
    {
        return this._state;
    }
}