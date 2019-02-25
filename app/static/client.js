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
        el('analyze-button').style.display = "inline-block";
        el('analyze-button').innerHTML = "Analyze";
    }
    reader.readAsDataURL(input.files[0]);
}

function generateOptions(){
    arr = ["http://placekitten.com/300/200", "../static/image_data/test2.jpg"]
    cat = [4,5]
    zip(arr,cat).forEach(function(e){
        res = document.createElement("option")
        res.setAttribute("data-img-src", e[0])
        res.value = e[1]
        console.log(res)
        el("results-display").appendChild(res)
    })
    $("select").imagepicker();

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
            var response = JSON.parse(e.target.responseText);
            var zipped = zip(response["cropped_items"], response["categories"])
            zipped.forEach(function(e) {
                res = document.createElement("option")
                res.setAttribute("data-img-src", e[0])
                res.value = e[1]
                console.log(res)
                el("results-display").appendChild(res)
                res = document.createElement('img')
                res.src = e[0]
                res.id = e[1]
                res.class = "img-thumbnail"
                res.style.maxWidth = "150px"
                res.style.margin = "10px"
		res.style.borderRadius = "20px"
                res.onclick = function() {
                    analyze(res)
                }
                el("results-diplay").appendChild(res)
              });
            $("select").imagepicker();
            el("example-image").style.display = "none"
        }
        // el('analyze-button').style.display = 'none';
    }
    var fileData = new FormData();
    fileData.append('file', uploadFiles[0]);
    xhr.send(fileData);
    el('analyze-button').innerHTML = "<i class='fa fa-spinner fa-spin '></i> Analyzing";

}

function analyze(pic) {
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
            for(i=0;i<=results.length;i++){
                el("result"+i).src = results[i];
            }
        }
        el('analyze-button').innerHTML = 'Analyze';
    }
    var json = {"chosen_image": ".."+pic.src.split("1997")[1], "chosen_cat": parseInt(pic.id)};
    xhr.send(JSON.stringify(json));

}

function zip(a, b) {
    var arr = [];
    for (var key in a) arr.push([a[key], b[key]]);
    return arr;
  }
