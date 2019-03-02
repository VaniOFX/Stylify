// Get and element from the DOM by id
var el = x => document.getElementById(x);

// Set the specified element to be visible
var setVisible = elementName => el(elementName).style.display = "inline-block";

// Set the specified element to be invisible
var setInvisible = elementName => el(elementName).style.display = "none";

// converting a JS object to JSON Objec
var asJson = jsObj => JSON.stringify(jsObj);

// Display an error message
var displayErrorMessage = () => alert("Something Went Wrong. Please contact the support");

// global sign for handling data from the server
var concatSign = ":::";

// Function which pack together the respective elements from two arrays
var zip = (a, b) => {
    var arr = [];
    for (var key in a) arr.push([a[key], b[key]]);
    return arr;
}

// Cleaning the child elements from a DOM element
var removeAllChildren = (elementName) => {
    var results = el(elementName);
    while (results.firstChild) {
        results.removeChild(results.firstChild);
    }
}

// A function which displays the file input selector
function showPicker() {
    el('file-input').click();
}

// A function which displays the image in an IMG element
function showPicked(input) {
    var reader = new FileReader();

    // Specify what needs to be done after the file is read
    reader.onload = function (e) {
        // display the chosen image and change the formatting
        el('image-picked').src = e.target.result;
        el('image-picked').setAttribute("class", "img-thumbnail image-picked");

        // discard the example or previous results
        setInvisible("example-items");
        setInvisible("results-button");
        setInvisible("select-item-button");

        // Remove all the previous image options and refresh the image picker plugin to discard them
        removeAllChildren("select-menu");
        $("select").imagepicker({ show_label: true });

        // Automatically make a request to the server to receive the results for the newly picked image
        detect();
    }
    reader.readAsDataURL(input.files[0]);
}

// A function which handles uploading the chosen file to the server and deals with the response
function detect() {

    // Check if there is a selected file if not abort
    var uploadFiles = el('file-input').files;
    if (uploadFiles.length != 1) {
        alert('Please select 1 file to analyze!');
        return;
    }

    // New Request object
    var xhr = new XMLHttpRequest();
    // Get the webpage location
    var loc = window.location;
    // Create an async POST Request
    xhr.open('POST', `${loc.protocol}//${loc.hostname}:${loc.port}/detect`, true);
    // Handle errors with the request
    xhr.onerror = function () { displayErrorMessage(); }
    // Specify the handling of the response
    xhr.onload = function (e) {
        if (this.readyState === 4) {
            //Parse the reseponse a a JSON object
            var response = JSON.parse(e.target.responseText);
            var zipped_array = zip(response["cropped_items"], response["categories"]);
            zipped_array.forEach(function (e) {
                // For each pair creaate an element and add it to the DOM
                res = document.createElement("option");
                // Set the elements used by the image picker
                res.setAttribute("data-img-src", e[0]);
                res.setAttribute("data-img-class", "result-image img-responsive")
                res.setAttribute("data-img-label", `<h4 style=\"text-align:center\">${response["id2cat"][e[1]]}</h4>`);
                // Set the value attribute which is then used to identify the chosen image
                res.value = e[0] + concatSign + e[1];
                el("select-menu").appendChild(res);
            });
            // Refresh the image picker with the newly added images
            $("select").imagepicker({ show_label: true });
            setVisible("select-item-button");

            // Reset the photo picking button
            el('pick-photo-button').innerHTML = "Choose Your photo";
            el('pick-photo-button').disabled = false;
        }
    }
    // Send the file to the server
    var fileData = new FormData();
    fileData.append('file', uploadFiles[0]);
    xhr.send(fileData);

    // Display loading spinner instead of the button
    el('pick-photo-button').innerHTML = "<i class='fa fa-spinner fa-spin '></i> Analyzing";
    el('pick-photo-button').disabled = true;
}

// A function which handles the selection of an item from the image picker
function analyze() {

    // Change the state of the button
    el('select-item-button').innerHTML = "<i class='fa fa-spinner fa-spin '></i> Fetching Results";
    el('select-item-button').disabled = true;

    // New Request object
    var xhr = new XMLHttpRequest();
    // Get the webpage location
    var loc = window.location;
    // Create an async POST Request
    xhr.open('POST', `${loc.protocol}//${loc.hostname}:${loc.port}/analyze`, true);
    // handle request errors
    xhr.onerror = function () { displayErrorMessage(); }
    // Specify the handling of the response
    xhr.onload = function (e) {
        if (this.readyState === 4) {

            // Parse the response and display the results
            var response = JSON.parse(e.target.responseText);
            var i;
            var results = response["results"];
            for (i = 0; i < results.length; i++) {
                el("result" + i).src = results[i];
            }
            
            // Fix the state of the buttons
            setVisible("results-button");
            el('select-item-button').disabled = false;
            el('select-item-button').innerHTML = "Select Another";
        }
    }
    // Parse the data from the value attribute from the selected image
    var tuple = $(".image-picker").data('picker').selected_values()[0].split(concatSign);
    // Create an object with it and send the request
    var json = {"chosen_image": tuple[0],
                "chosen_cat": parseInt(tuple[1])};
    xhr.send(asJson(json));
}

// Sending information to the server from the feedback form
function submitForm() {
    // Get the values from the form and create an object with them
    var name = el("form-name").value;
    var email = el("form-email").value;
    var comments = el("form-comments").value;
    json = {
        "name": name,
        "email": email,
        "comments": comments
    };

    // New Request object
    var xhr = new XMLHttpRequest();
    // Get the webpage location
    var loc = window.location;
    // Create an async POST Request
    xhr.open('POST', `${loc.protocol}//${loc.hostname}:${loc.port}/email`, true);
    // Specify the handling of the response
    xhr.onload = function (e) {
        if (this.readyState == 4) {
            setInvisible("feedback-form");
            setVisible("feedback-thanks");
        }
    }
    //handle server errors
    xhr.onerror = function () { displayErrorMessage() }
    // send the request
    xhr.send(asJson(json));
}

