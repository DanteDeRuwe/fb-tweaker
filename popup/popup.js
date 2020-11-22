const DEFAULT_OPTIONS = { fbtweaker: `{ "stories": false , "rooms": false, "rightrail": false, "ads": false, "watch": false, "gaming": false }` }

function sendOptions(options) {
    let params = { active: true, currentWindow: true };

    chrome.tabs.query(params, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, options);
    });
}

function getCheckboxValues(checkboxes) {
    return checkboxes.reduce((map, obj) => {
        map[obj.id] = obj.checked;
        return map;
    }, {});
}


function setupCheckBoxes(data) {

    //grab checkbox elements
    let checkboxes = Array.from(document.querySelectorAll("input"));

    checkboxes.forEach(checkbox => {
        //set checkbox checked or not from data
        checkbox.checked = data[checkbox.id];

        //add event listener for changes, send all options to content.js
        checkbox.onchange = () => sendOptions(getCheckboxValues(checkboxes));
    });

    //send the options in the beginning too
    sendOptions(getCheckboxValues(checkboxes));
}


chrome.storage.sync.get(DEFAULT_OPTIONS, ({ fbtweaker }) => {
    setupCheckBoxes(JSON.parse(fbtweaker));
});
