const TYPING_ID = "typing"
const TYPING_RESULT_ID = "typing-result"

window.onload = function(){
    var typing = document.getElementById(TYPING_ID);
    var typing_result = document.getElementById(TYPING_RESULT_ID);

    if (typing != null && typing_result != null){
        let typing_txt = typing.innerHTML;

        typing.innerHTML = "";
        typing.style.visibility = "visible";
    
        new Typed('#'+TYPING_ID, {
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
    }
}
