import { Assets, Point, Sprite } from "pixi.js";
import { Blaster } from "./blaster";

type Weapon = Blaster;

export class Player extends Sprite
{
    activeWeapon?: Weapon; 
    velocity = new Point();

    constructor()
    {
        super(Assets.get("character"));

        this.anchor.set(0.5);
    }

    equipWeapon(weapon?: Weapon)
    {
        this.unequipWeapon();
        
        if (weapon === undefined)
            return;

        this.addChild(weapon);
        this.activeWeapon = weapon;
    }

    unequipWeapon()
    {
        if (this.activeWeapon === undefined)
            return;

        this.activeWeapon.destroy();
        this.activeWeapon = undefined;
    }
}