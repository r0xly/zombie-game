import { Ticker } from "pixi.js";
import { Game } from "../game";
import { Weapon } from "../objects/tools/weapon";
import { Humanoid } from "../objects/humanoid";
import { ToolState } from "../../../common/src/types/tool-state";
import { boxCollides } from "../util/collision";
import { AttackZombie } from "../../../common/src/messages/message-objects";

export class WeaponController
{
    /** A set of humanoids that have already been handled for collisions. */
    private hitHumanoids = new Set<string>();
    previousState = ToolState.idle;

    constructor(private game: Game)
    {
        game.pixi.ticker.add(ticker => this.update(ticker));
    }

    private update(ticker: Ticker)
    {
        const pointer = this.game.inputController.pointer;
        const player = this.game.playerController.player;

        if (player && player.equippedTool && player.equippedTool instanceof Weapon)
        {
            const weapon = player.equippedTool;

            if (pointer.down)
            {
                weapon.swing();
            }

            // Collison check
            if (weapon.state === ToolState.active)
            {
                if (this.previousState === ToolState.idle)
                {
                    this.hitHumanoids.clear();
                }

                for (const zombieId in this.game.zombieControler.zombies)
                {
                    const zombie = this.game.zombieControler.zombies[zombieId];

                    if (!this.hitHumanoids.has(zombieId) && boxCollides(zombie, weapon))
                    {
                        this.hitHumanoids.add(zombieId);
                        const angle = Math.atan2(zombie.position.y - this.game.playerController.player.position.y, zombie.position.x - this.game.playerController.player.position.x);
                        this.game.networkController.sendMessage(new AttackZombie(zombieId, 25, 2000, angle));
                    }
                }
            }

            weapon.update(pointer.x, pointer.y);
            this.previousState = weapon.state;
        }

    }
}