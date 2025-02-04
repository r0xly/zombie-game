import { Assets, Container, Point, Sprite, Text } from "pixi.js";
import { DEFAULT_HEALTH } from "../../../common/src/data/default-player-data";
import { HumanoidState } from "../../../common/src/types/humanoid-state";
import { Tool } from "./tools/tool";
import { HumanoidData } from "../../../common/src/types/humanoid-data";
import { Weapon } from "./tools/weapon";

export class Humanoid extends Sprite
{
    private _health = DEFAULT_HEALTH;
    private _state = HumanoidState.idle;
    
    equippedTool?: Tool;

    velocity = new Point(0, 0);

    constructor(name?: string)
    {
        super(Assets.get("humanoid"));

        this.anchor.set(0.5);

        if (name)
        {
            const nameTag = new Text(
            { 
                text: name,
                resolution: 2,
                style: 
                {
                    fontSize: 30,
                    fill: 0xffffff,
                    stroke: { color: '#000000', width: 10, join: 'round' },
                },

            });
            nameTag.anchor = new Point(0.5, 0)
            nameTag.y = -110;
            nameTag.zIndex = 100;
            
            this.addChild(nameTag);
        }
    }

    equipTool(tool: Tool)
    {
        this.unequipTool();

        this.addChild(tool);
        this.equippedTool = tool;
    }

    unequipTool()
    {
        if (this.equippedTool === undefined) 
        {
            return;
        }

        this.equippedTool.destroy()
        this.equippedTool = undefined;
    }

    getHumanoidData()
    {
        const humanoidData: HumanoidData = 
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
        }

        if (this.equippedTool)
        {
            humanoidData.tool = 
            {
                name: this.equippedTool.options.name,
                catagory: this.equippedTool.options.catagory,
                rotation: this.equippedTool.getRotation(),
            }
        }

        return humanoidData;
    }

    set state(state: HumanoidState)
    {
        this.emit("stateChanged", state, this._state);
        this._state = state;
    }

    get state()
    {
        return this._state;
    }

    set health(value: number)
    {
        if (value <= 0)
            this.state = HumanoidState.dead;

        this._health = value;
    }

    get health()
    {
        return this._health;
    }

}