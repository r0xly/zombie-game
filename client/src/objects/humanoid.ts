import { Assets, Container, Point, Sprite } from "pixi.js";

type Tool = Container;

const DEFAULT_HEALTH = 100;

export enum HumanoidState 
{
    dead,
    idle,
    moving
}

export class Humanoid extends Sprite
{
    private _health = DEFAULT_HEALTH;
    private _state = HumanoidState.idle;
    
    equippedTool?: Tool;

    velocity = new Point(0, 0);

    constructor()
    {
        super(Assets.get("humanoid"));

        this.anchor.set(0.5);
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
            return;

        this.equippedTool.destroy()
        this.equippedTool = undefined;
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