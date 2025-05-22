// Reset everything
function resetFunctionalities(){
    localStorage.clear();
    location.reload();
}


// Movable window logic
function makeDraggable (movable_id, header_id) {
    var movable = document.getElementById(movable_id);
    var header = document.getElementById(header_id);

    let currentPosX = 0, currentPosY = 0, previousPosX = 0, previousPosY = 0;

    // Restore previous position if < 10 minutes from previous movement
    let ts = localStorage.getItem("pos_ts");
    if ((new Date().getTime() - 10*60*1000) < ts){
        movable.style.top = localStorage.getItem("pos_top");
        movable.style.left = localStorage.getItem("pos_left");
    }

    // Make it visible
    movable.style.display = "inherit";

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


// Typing
function animateTyping(typing_id, typing_result_id){
    var typing = document.getElementById(typing_id);
    var typing_result = document.getElementById(typing_result_id);
    var visited =  localStorage.getItem("typed");

    if (typing != null && typing_result != null){
        // Omit typing if < 10 mins from last typed
        if (visited != null && ((new Date().getTime() - 10*60*1000) < visited)){
            typing.style.visibility = "visible";
            typing_result.style.visibility = "visible";
        }
        else {
            let typing_txt = typing.innerHTML;

            typing.innerHTML = "";
            typing.style.visibility = "visible";
        
            new Typed('#'+typing_id, {
                strings: [typing_txt],
                startDelay: 500,
                typeSpeed: 50,
                cursorChar: '█',
                onComplete: async (self) => {
                    await new Promise(r => setTimeout(r, 800));
                    document.getElementsByClassName("typed-cursor typed-cursor--blink")[0].style.display = "none";
                    typing_result.style.visibility = "visible";
                }
            });
    

            localStorage.setItem("typed", new Date().getTime());
        }
    }
}


document.addEventListener("DOMContentLoaded", (e) => {
    // Enable movable window
    makeDraggable("main", "decorations");

    // Enable typing
    animateTyping("typing", "typing-result");
});