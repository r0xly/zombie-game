import { Application, Point, Ticker, triangulateWithHoles } from "pixi.js";
import { Player } from "../objects/player";
import { InputController } from "./input-controller";
import { Blaster } from "../objects/blaster";

const PLAYER_SPEED = 6;

export class PlayerController
{
    constructor(private player: Player, private input: InputController)
    {

    }

    update(ticker: Ticker)
    {
        const moveDirection = new Point(this.input.getHorizontalAxis(), this.input.getVerticalAxis()).normalize();

        this.player.y -= PLAYER_SPEED * ticker.deltaTime * moveDirection.y || 0;
        this.player.x += PLAYER_SPEED * ticker.deltaTime * moveDirection.x || 0;

        this.player.velocity = moveDirection;

        if (this.player.activeWeapon && this.player.activeWeapon instanceof Blaster)
        {
            this.player.activeWeapon.lookAt(this.input.pointer.x, this.input.pointer.y);

            if (this.input.pointer.down)
            {
                this.player.activeWeapon.fireAt(this.input.pointer.x, this.input.pointer.y);
            }
        }
    }
}