import { Game } from "../game";

export class InputController
{
    private keysDown = new Set();
    private horizontalAxis = 0;
    private verticalAxis = 0;

    pointer = 
    { 
        x: 0, 
        y: 0, 
        down: false 
    }

    constructor(game: Game)
    {
        const app = game.pixi;

        app.stage.addEventListener("pointermove", ({ globalX, globalY }) => 
        {
            this.pointer.x = globalX;
            this.pointer.y = globalY;
        });

        app.stage.addEventListener("pointerdown", (event) => 
        {
            this.pointer.down = true;
        });

        app.stage.addEventListener("pointerup", (event) => 
        {
            this.pointer.down = false;
        });

        window.addEventListener("keyup", ({ key })=>
        {
            this.keysDown.delete(key);

            if (key === "w")
                this.verticalAxis = this.keysDown.has("s") ? 1 : 0;
            else if (key === "d")
                this.horizontalAxis = this.keysDown.has("a") ? -1 : 0;
            else if (key === "a")
                this.horizontalAxis = this.keysDown.has("d") ? 1 : 0;
            else if (key === "s")
                this.verticalAxis = this.keysDown.has("w") ? -1 : 0;
        });

        window.addEventListener("contextmenu", (event) => 
        {
            event.preventDefault();
        });

        window.addEventListener("keydown", ({ key }) => 
        {
            this.keysDown.add(key);

            if (key === "w")
                this.verticalAxis = -1;
            else if (key === "s")
                this.verticalAxis = 1;
            else if (key === "a")
                this.horizontalAxis = -1;
            else if (key === "d")
                this.horizontalAxis = 1;
        });
    }

    getHorizontalAxis()
    {
        return this.horizontalAxis;
    }

    getVerticalAxis()
    {
        return this.verticalAxis;
    }
}