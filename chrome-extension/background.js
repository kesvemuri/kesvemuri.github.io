console.log("background running");

//inject google api script tag into background.html
//from https://stackoverflow.com/questions/18681803/loading-google-api-javascript-client-library-into-chrome-extension
let head = document.getElementsByTagName('head')[0];
let script = document.createElement('script');
script.type = 'text/javascript';
script.src = "https://apis.google.com/js/api.js";
head.appendChild(script);


//set constants
const regex = /.*:\/\/www\.youtube\.com\/playlist\?list=(.*)/;
const channelId = "UC7eEV5o3IW9ympKVIwmTeDw";
const apiKey = "AIzaSyCyBVs3ULQr9YkejRnkt-xS7bBtus-FMnU";
const discoveryDocs = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];
const clientId = "706993707161-8m7bm2s2kmvup9dsbb62c4lv3lccmt8c.apps.googleusercontent.com";
const scope = "https://www.googleapis.com/auth/youtube.upload";

let status = false;


//wait for background.html to load
window.addEventListener("load", () => {

    //setup youtube channel / playlist info
    //google api (gapi) methods return promise objects, which are "thenable"

    gapi.load("client", () => {
        
        gapi.client.init({
            "apiKey": apiKey, 
            "discoveryDocs": discoveryDocs, //which google API we will be using
            // clientId and scope are optional if auth is not required.
            "clientId": clientId,
            "scope": scope
        }).then(() => {
    
            return gapi.client.youtube.playlists.list({
                part: "snippet,contentDetails,id",
                channelId: channelId
            });
    
        }).then((response) => {
    
            console.log(response.result);
    
        }, (reason) => {
    
        });
    });
});






//add listener for messages from popup.js
chrome.runtime.onMessage.addListener(processMessage);

function processMessage (message, sender, sendResponse) {

    if (message.text == "statusChange") {
        status = message.value
        
    } else if (message.text == "") {
        //make youtube API calls


    }
}









//////////playlist functionality///////////////////////////////////

//add listener to chrome-extension button
// chrome.browserAction.onClicked.addListener(buttonClicked);

function buttonClicked () {

    //TODO: check if button was already clicked on this page...set global variable
    //check if active tab's url is a youtube playlist
    let params = {active: true, currentWindow: true};

    //obtain tabs to extract active tab url
    chrome.tabs.query(params, processURL);
}

function processURL (tabs) {

    //TODO: use regex here instead...we need access to playlistId
    activeTab = tabs[0];
    test = regex.test(activeTab.url);

    if (test) {
        //launch video selection overlay using content.js
        //send message to content.js

        let msg = {text: "activate"};
        chrome.tabs.sendMessage(activeTab.id, msg);

        //load javascript client library for google API and request playlist info
        urlParts = regex.exec(activeTab.url);
        playlistId = urlParts[1];

        console.log(playlistId);
        gapi.load("client", function() {makeRequest(playlistId);});

    } else {
        //TODO: dynamically make popup appear with "invalid url" message 
    }
}


function makeRequest(playlistId) {
    //initialize javascript client library
    //adapted from https://github.com/google/google-api-javascript-client/blob/master/docs/start.md
    //and https://github.com/bradtraversy/youtube_api_auth_app/blob/master/main.js

    gapi.client.init({
        "apiKey": apiKey, 
        "discoveryDocs": discoveryDocs, //which google API we will be using
        // clientId and scope are optional if auth is not required.
        // 'clientId': 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
        // 'scope': 'profile'
    })
    .then(function() {
        //make the API request.

        return gapi.client.youtube.playlistItems.list({
            part: "snippet,contentDetails,id,status",
            playlistId: playlistId
            // maxResults: 50, 
        });

        return gapi.client.youtube.channels.list({

        });

    })
    .then(function(response) {
        //process response to the request

        console.log(response.result);

    }, function(reason) {
        console.log('Error: ' + reason.result.error.message);
    });
    



    // gapi.client.setApiKey(api_key);
    // return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
    //     .then(function() { console.log("GAPI client loaded for API"); },
    //           function(err) { console.error("Error loading GAPI client for API", err); });
}





