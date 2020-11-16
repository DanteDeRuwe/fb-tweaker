/*
 * SEND OPTIONS
 * sends checkbox boolean options to content js
 */

function sendOptions(options) {
    let params = { active: true, currentWindow: true };

    chrome.tabs.query(params, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, options);
    });
}

/*
 * SETUP
 * makes checkboxes based on storage + adds event listeners to them
 */
function setupCheckBoxes(data) {
    //grab checkbox elements
    let checkboxes = Array.from(document.querySelectorAll("input"));

    //check if data found, else use default (all false)
    data = data.checkboxValues ? JSON.parse(data.checkboxValues) : Array(checkboxes.length).fill(false);

    for (let i = 0; i < checkboxes.length; i++) {
        //set checkbox checked or not
        checkboxes[i].checked = data[i];

        //add event listener for changes
        checkboxes[i].onchange = event => {
            //change the message on popup (on deselect you should refresh) but dont do it when there's already a message
            //it is also not needed for anything other than option 0 (blocking of the ads)
            let msg = document.getElementById("message");
            if (i == 0 && msg.innerHTML.length == 0) {
                msg.innerHTML = checkboxes[i].checked ? "" : "Please refresh Facebook for changes";
            }

            //when textbox changed: send options to content.js
            let options = checkboxes.map(cb => cb.checked);
            sendOptions(options);
        };
    }

    //send the options in the beginning too
    let options = checkboxes.map(cb => cb.checked);
    sendOptions(options);
}

/*
 * POPUP ON LOAD
 * get savedata, and use it to setup the checkboxes
 */
chrome.storage.sync.get("checkboxValues", setupCheckBoxes);
