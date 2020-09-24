//this content.js code is automatically injected into urls of the form "*://www.youtube.com/watch?v=*"

//don't need to do all this....just change "matches" in "content_scripts"
//find the like button on the youtube video page and add a click-listener
document.querySelector("#button[aria-label~=like]").addEventListener("click", onLikeVideo);

function onLikeVideo (event) {
    //check if flag in background.js/popup.js is set
    chrome.runtime.sendMessage({text: "status"}, processResponse);

    function processResponse (response) {
        //click the "add to playlist" button programmatically
        //we use css-selector notation to do this
        document.querySelector("#button[aria-label~=playlist]").click();

        //tell baground.js to make youtube API calls and retrieve information
        //can't make the calls here without api_key and client_id
        chrome.runtime.sendMessage({
            text: ,
            videoId: ,
        });
    
    
    
        //select the playlist that is most appropriate for the current video
        document.querySelector();
    }

}



/////////////////////////////////////////////////////////


//listen for messages from popup.js or background.js
chrome.runtime.onMessage.addListener(processMessage);

function processMessage (message, sender, sendResponse) {

    if(message.text == "activate") {
        //this is a message from background.js to enable youtube video selection

        //now we dissect youtube html naming conventions...

        //find all div elements with id="index-container" 
        console.log(document.querySelectorAll("#index-container"));
        
        let containerDivs = document.querySelectorAll("#index-container");

        for (const div of containerDivs) {
            //add border to indicate selection option is active
            div.setAttribute("style", "border-left: 3px solid rgb(130, 224, 170);");
            
            //listen for video selection
            div.addEventListener("click", function() {videoSelected(div)});
        }

        //TODO: add a "done selecting" button, which when pressed activates popup

    }
}


function videoSelected (div) {
    //distinguish between selection and deselection

    if(div.style.background == "rgb(130, 224, 170)") {
        //div is already selected
        console.log("hello");
        div.style.background = null;

        //TODO: remove video from database

    } else {
        //change color of div to indicate selection
        div.style.background = "rgb(130, 224, 170)";

        //TODO: record video url stored in subsequent div in the DOM...

    }
}
