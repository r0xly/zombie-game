import { EventEmitter } from "pixi.js";

export class GameWindow extends EventEmitter
{
    constructor(private windowElement: HTMLElement)
    {
        super();
        const closeButton = windowElement.querySelector("#window-close");
        console.log(closeButton);
        const header = windowElement.querySelector("#window-header");

        if (closeButton) 
            closeButton.addEventListener("click", () => this.hide());

        if (header) 
            dragElement(windowElement);
    }

    show()
    {
        this.windowElement.style.display = "flex";
    }

    hide()
    {
        this.windowElement.style.display = "none";
    }
}

function dragElement(elmnt: HTMLElement) 
{
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    document.getElementById("window-header").onmousedown = dragMouseDown;

    function dragMouseDown(e) 
    {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) 
    {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() 
    {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}