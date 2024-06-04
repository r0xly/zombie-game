export class GameWindow
{
    constructor(private windowElement: HTMLElement)
    {
        const closeButton = windowElement.querySelector("#close");

        if (closeButton)
            closeButton.addEventListener("onclick", () => this.hide());
    }

    show()
    {
        this.windowElement.style.display = "block";
    }

    hide()
    {
        this.windowElement.style.display = "none";
    }
}