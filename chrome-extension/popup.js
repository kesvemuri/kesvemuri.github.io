toggle = document.getElementById("toggle");
toggle.checked = false;

//stores whether playlist suggestions is on/off
let status = toggle.checked;

toggle.addEventListener("change", onChange);

function onChange () {
    //update status flag
    status = toggle.checked;
    console.log(toggle.checked);

    //send message to background.js with update info
    chrome.runtime.sendMessage({
        text: "statusChange",
        value: status
    });
}




