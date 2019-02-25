var el = x => document.getElementById(x);

function showPicker(inputId) {
     el('file-input').click();
}

function showPicked(input) {
    var reader = new FileReader();
    reader.onload = function (e) {
        el('image-picked').style.maxWidth = "100%";
        el('image-picked').style.maxHeight = "100%";
        el('image-picked').src = e.target.result;
        el('results-button').style.display = "none";
	el("select-item-button").style.display = "none";
        el('analyze-button').style.display = "inline-block";
        el('analyze-button').innerHTML = "Analyze";
	el('analyze-button').disabled = false;
	var results = el("select-menu");
	while (results.firstChild) {     
	     results.removeChild(results.firstChild);     
      } 
    }
    reader.readAsDataURL(input.files[0]);
}

function detect() {
    var uploadFiles = el('file-input').files;
    if (uploadFiles.length != 1){
         alert('Please select 1 file to analyze!');
         return;
    }
    
    var xhr = new XMLHttpRequest();
    var loc = window.location
    xhr.open('POST', `${loc.protocol}//${loc.hostname}:${loc.port}/detect`, true);
    xhr.onerror = function() { alert (xhr.responseText); }
    xhr.onload = function(e) {
        if (this.readyState === 4) {
	    el('analyze-button').innerHTML = "Analyzed!";
	    el('analyze-button').disabled  =  true;
            var response = JSON.parse(e.target.responseText);
            var zipped = zip(response["cropped_items"], response["categories"])
            zipped.forEach(function(e) {
                res = document.createElement("option")
                res.setAttribute("data-img-src", e[0])
		res.setAttribute("data-img-class", "result-image img-responsive")
                res.value = e[0]+":::"+e[1]
                console.log(res)
                el("select-menu").appendChild(res)
              });
            $("select").imagepicker();
	    el("select-item-button").style.display = "inline-block"
        }
    }
    var fileData = new FormData();
    fileData.append('file', uploadFiles[0]);
    xhr.send(fileData);
    el('analyze-button').innerHTML = "<i class='fa fa-spinner fa-spin '></i> Analyzing";

}

function analyze() {
    var value = $(".image-picker").data('picker').selected_values()
    var tuple = value[0].split(":::")
	console.log(tuple)
    el('analyze-button').innerHTML = "<i class='fa fa-spinner fa-spin '></i> Fetching Results";
    var xhr = new XMLHttpRequest();
    var loc = window.location
    xhr.open('POST', `${loc.protocol}//${loc.hostname}:${loc.port}/analyze`, true);
    xhr.onerror = function() { alert (xhr.responseText); }
    xhr.onload = function(e) {
        if (this.readyState === 4) {
            var response = JSON.parse(e.target.responseText);
            el('analyze-button').style.display = "none";
            el('results-button').style.display = "inline-block";
            var i;
            var results = response["results"];
            for(i=0;i<results.length;i++){
                el("result"+i).src = results[i];
            }
        }
        el('analyze-button').innerHTML = 'Analyze';
    }
    var json = {"chosen_image": tuple[0], "chosen_cat": parseInt(tuple[1])};
    xhr.send(JSON.stringify(json));

}

function zip(a, b) {
    var arr = [];
    for (var key in a) arr.push([a[key], b[key]]);
    return arr;
  }

