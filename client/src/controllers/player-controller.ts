import { Point, Ticker } from "pixi.js";
import { Game } from "../game";
import { Humanoid } from "../objects/humanoid";
import { Blaster } from "../objects/blaster";
import { BlasterData } from "../data/blaster-data";
import { UpdatePlayerHumanoid } from "../../../common/src/messages/message-objects";
import { Weapon } from "../objects/tools/weapon";
import { WeaponData } from "../data/weapon-data";
import { HumanoidState } from "../../../common/src/types/humanoid-state";

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

        this.player = new Humanoid();

        this.player.equipTool(new Weapon(WeaponData.IronSword));

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
        if (this.player)
        {
            this.player.destroy();
            this.player = undefined;
        }

    }

    update(ticker: Ticker)
    {
        const player = this.player;

        if (!player || this.player.state === HumanoidState.dead)
            return;

        try
        {
            this.game.networkController.sendMessage(new UpdatePlayerHumanoid(player.getHumanoidData()));
        }
        catch
        {
            
        }
        const collisionController = this.game.collisionController;
        const deltaTime = ticker.deltaTime;

        const moveDirection = new Point(this.game.inputController.getHorizontalAxis(), this.game.inputController.getVerticalAxis()).normalize();

        const x = player.x + (PLAYER_SPEED * deltaTime * moveDirection.x || 0)
        const y = player.y + (PLAYER_SPEED * deltaTime * moveDirection.y || 0)

        if (!collisionController.pointCollides(x, this.player.y)) 
            this.player.x = x;

        if (!collisionController.pointCollides(this.player.x, y)) 
            this.player.y = y;                
    }
}