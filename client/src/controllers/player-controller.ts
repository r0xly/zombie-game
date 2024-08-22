import { Point, Ticker } from "pixi.js";
import { Game } from "../game";
import { Humanoid, HumanoidState } from "../objects/humanoid";
import { Blaster } from "../objects/blaster";
import { BlasterData } from "../data/blaster-data";

const PLAYER_SPEED = 8;

export class PlayerController
{
    player?: Humanoid;

    constructor(private game: Game)
    {
        game.pixi.ticker.add(ticker => this.update(ticker));
    }

    spawnPlayer()
    {
        this.despawnPlayer();

        const blaster = new Blaster(BlasterData.AA22, this.game.projectileController);

        this.player = new Humanoid();
        this.player.equipTool(blaster);

        this.player.on("stateChanged", (newState, oldState) =>
        {
            if (newState === HumanoidState.dead)
            {
                this.spawnPlayer();
            }
        });

        this.game.workspace.addChild(this.player);
    }

    despawnPlayer()
    {
        if (!this.player)
            return;

        this.player.destroy();
        this.player = undefined;
    }

    update(ticker: Ticker)
    {
        const player = this.player;

        if (!player || this.player.state === HumanoidState.dead)
            return;

        const collisionController = this.game.collisionController;
        const deltaTime = ticker.deltaTime;

        const moveDirection = new Point(this.game.inputController.getHorizontalAxis(), this.game.inputController.getVerticalAxis()).normalize();

        const x = player.x + (PLAYER_SPEED * deltaTime * moveDirection.x || 0)
        const y = player.y + (PLAYER_SPEED * deltaTime * moveDirection.y || 0)

        if (!collisionController.pointCollides(x, this.player.y)) 
            this.player.x = x;

        if (!collisionController.pointCollides(this.player.x, y)) 
            this.player.y = y;                

        if (this.player.equippedTool && this.player.equippedTool instanceof Blaster)
        {
            const pointer = this.game.inputController.pointer;
            this.player.equippedTool.lookAt(pointer.x, pointer.y);

            if (pointer.down)
                this.player.equippedTool.fireAt(pointer.x, pointer.y);
        }
    }
}