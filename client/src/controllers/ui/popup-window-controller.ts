const popupContainer = document.getElementById("popup-window-container") as HTMLDivElement;
const popupWindow = document.getElementById("popup-window") as HTMLDivElement;
const popupText = document.getElementById("popup-window-text") as HTMLParagraphElement;
const popupButton = document.getElementById("popup-window-button") as HTMLButtonElement;

export class PopupWindowController
{
    constructor()
    {

    }

    /**
     * Shows a popup with a specificied text and an optional button.
     * Warning: this popup will blur the entire screen and should only be used for displaying important information.
     * 
     * @param content           The string to be displayed on the pop-up
     * @param buttonLabel       The text displayed on the button. If left undefined, no button will be shown.
     * @param buttonCallback    The function that will be ran when the button is clicked. If left undefined, no button will be shown.
     */
    showPopup(content: string, buttonLabel?: string, buttonCallback?: () => void)
    {  
        popupContainer.style.display = "flex";
        popupText.innerHTML = content;

        if (buttonCallback && buttonLabel)
        {
            popupButton.style.display = "block";
            popupButton.innerHTML = buttonLabel;
            popupButton.onclick = buttonCallback;
        } 
        else 
        {
            popupButton.style.display = "none";
        }
    }

    hidePopup()
    {
        popupContainer.style.display = "none";
    }
}