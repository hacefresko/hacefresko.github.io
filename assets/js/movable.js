function makeDraggable (movable, header) {
    let currentPosX = 0, currentPosY = 0, previousPosX = 0, previousPosY = 0;

    // Restore previous position if > 10 minutes
    let ts = localStorage.getItem("pos_ts");
    if ((new Date().getTime() - 10*60*1000) < ts){
        movable.style.top = localStorage.getItem("pos_top");
        movable.style.left = localStorage.getItem("pos_left");
    }


    header.onmousedown = dragMouseDown;

    function dragMouseDown(e){
        // Prevent any default action on this movable (you can remove if you need this movable to perform its default action)
        e.preventDefault();
        // Get the mouse cursor position and set the initial previous positions to begin
        previousPosX = e.clientX;
        previousPosY = e.clientY;
        // When the mouse is let go, call the closing event
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        // Prevent any default action on this movable (you can remove if you need this movable to perform its default action)
        e.preventDefault();
        // Calculate the new cursor position by using the previous x and y positions of the mouse
        currentPosX = previousPosX - e.clientX;
        currentPosY = previousPosY - e.clientY;
        // Replace the previous positions with the new x and y positions of the mouse
        previousPosX = e.clientX;
        previousPosY = e.clientY;
        // Set the movable's new position
        movable.style.top = (Number(movable.style.top.replace("px", ""))  - currentPosY) + 'px';
        movable.style.left = (Number(movable.style.left.replace("px", "")) - currentPosX) + 'px';
    }

    function closeDragElement() {
        // Stop moving when mouse button is released and release events
        document.onmouseup = null;
        document.onmousemove = null;

        //Store position and timestamp
        localStorage.setItem("pos_top", movable.style.top);
        localStorage.setItem("pos_left", movable.style.left);
        localStorage.setItem("pos_ts", new Date().getTime());
    }
}


document.addEventListener("DOMContentLoaded", (e) => {
    makeDraggable(document.getElementById('main'), document.getElementById('decorations'));
});