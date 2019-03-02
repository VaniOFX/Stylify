var el = x => document.getElementById(x);

var setVisible = elementName => el(elementName).style.display = "inline-block";

var setInvisible = elementName => el(elementName).style.display = "none";

var displayErrorMessage = () => alert("Something Went Wrong. Please contact the support");

var concatSign = ":::"

var zip = (a, b) => {
    var arr = [];
    for (var key in a) arr.push([a[key], b[key]]);
    return arr;
}

var removeAllChildren = (elementName) => {
    var results = el(elementName);
    while (results.firstChild) {
        results.removeChild(results.firstChild);
    }
}

function submitForm(){
    var name = el("form-name").value
    var email = el("form-email").value
    var comments = el("form-comments").value
    var xhr = new XMLHttpRequest();
    var loc = window.location;
    xhr.open('POST', `${loc.protocol}//${loc.hostname}:${loc.port}/email`, true);
    xhr.onload = function (e) {
    	if(this.readyState == 4){
	     setInvisible("feedback-form");
	     setVisible("feedback-thanks");
	}
    }
    json = {"name": name, "email":email, "comments":comments}
    xhr.send(JSON.stringify(json));
}

function prepareRequest(endpoint){
    var xhr = new XMLHttpRequest();
    var loc = window.location;
    xhr.open('POST', `${loc.protocol}//${loc.hostname}:${loc.port}/${endpoint}`, true);
    return xhr
}

function showPicker(inputId) {
    el('file-input').click();
}

function showPicked(input) {
    var reader = new FileReader();
    reader.onload = function (e) {

        //display the chosen image
        el('image-picked').src = e.target.result;
        el('image-picked').setAttribute("class", "img-thumbnail image-picked");

        //discard previous results
	setInvisible("example-items");
        setInvisible("results-button");
        setInvisible("select-item-button");
        removeAllChildren("select-menu");
        $("select").imagepicker({show_label: true});  
	
	detect()
        //Prepare the Analyze button
        //setVisible("analyze-button");
        //el('analyze-button').innerHTML = "Analyze";
        //el('analyze-button').disabled = false;
    }
    reader.readAsDataURL(input.files[0]);;
}

function detect() {
    var uploadFiles = el('file-input').files;
    if (uploadFiles.length != 1) {
        alert('Please select 1 file to analyze!');
        return;
    }

    //var xhr = prepareRequest(detect)
    var xhr = new XMLHttpRequest();
    var loc = window.location;
    xhr.open('POST', `${loc.protocol}//${loc.hostname}:${loc.port}/detect`, true);
    //handle server errors
    xhr.onerror = function () { displayErrorMessage() }
    //no errors
    xhr.onload = function (e) {
        if (this.readyState === 4) {
            //Disable Analyze Button
            //el('analyze-button').innerHTML = "Analyzed!";
            //el('analyze-button').disabled = true;

            var response = JSON.parse(e.target.responseText);
            var zipped = zip(response["cropped_items"], response["categories"])
            zipped.forEach(function (e) {
                res = document.createElement("option")
                res.setAttribute("data-img-src", e[0])
                res.setAttribute("data-img-class", "result-image img-responsive")
		res.setAttribute("data-img-label", `<h4 style=\"text-align:center\">${response["id2cat"][e[1]]}</h4>`)
                res.value = e[0] + concatSign + e[1]
                el("select-menu").appendChild(res)
            });
            $("select").imagepicker({show_label: true});
            setVisible("select-item-button")
	    el('pick-photo-button').innerHTML = "Choose Your photo";
	    el('pick-photo-button').disabled = false;
        }
    }
    var fileData = new FormData();
    fileData.append('file', uploadFiles[0]);
    xhr.send(fileData);

    //loading spinner in the button
    el('pick-photo-button').innerHTML = "<i class='fa fa-spinner fa-spin '></i> Analyzing";
    el('pick-photo-button').disabled = true;
}

function analyze() {
    el('select-item-button').innerHTML = "<i class='fa fa-spinner fa-spin '></i> Fetching Results";
    el('select-item-button').disabled = true;
    //var xhr = prepareRequest(analyze)
    var xhr = new XMLHttpRequest();
    var loc = window.location;
    xhr.open('POST', `${loc.protocol}//${loc.hostname}:${loc.port}/analyze`, true); 
    //handle server errors
    xhr.onerror = function () { displayErrorMessage() }
    //no errors
    xhr.onload = function (e) {
        if (this.readyState === 4) {
            
            //change the state of the buttons
            //setInvisible("analyze-button");
            setVisible("results-button");

            //display the results
            var response = JSON.parse(e.target.responseText);
            var i;
            var results = response["results"];
            for (i = 0; i < results.length; i++) {
                el("result" + i).src = results[i];
            }
            el('select-item-button').disabled = false;
            el('select-item-button').innerHTML = "Select Another";
        }
    }
    var tuple = $(".image-picker").data('picker').selected_values()[0].split(concatSign);
    var json = { "chosen_image": tuple[0], "chosen_cat": parseInt(tuple[1]) };
    xhr.send(JSON.stringify(json));
}

