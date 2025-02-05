import { Point } from "pixi.js";
import { WeaponOptions } from "../objects/tools/weapon";

export const WeaponData: Record<string, WeaponOptions> = 
{
    IronSword: 
    {
        name: "IronSword",
        catagory: "weapon",
        texture: "iron-sword",
        offset: new Point(-40, -65),
        anchorPoint: new Point(0.5, 0.7),
        rotation: -Math.PI / 2,
        handPositions: [new Point(-12, 6)],
        swingDebounce: 600,
        knockbackForce: 2000,
        damage: 25,
    },

    IronBattleAxe:
    {
        name: "IronBattleAxe",
        catagory: "weapon",
        texture: "iron-battle-axe",
        offset: new Point(-69, 0),
        anchorPoint: new Point(0.55, 0.6),
        rotation: 0,
        handPositions: [new Point(-10, -38), new Point(-10, 26)],
        swingDebounce: 1000,
        knockbackForce: 2000,
        damage: 25,
    }
}