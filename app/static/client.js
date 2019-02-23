var el = x => document.getElementById(x);

function showPicker(inputId) { el('file-input').click(); }

function showPicked(input) {
    var reader = new FileReader();
    reader.onload = function (e) {
        el('image-picked').src = e.target.result;
        el('analyze-button').style.display = "inline-block";
    }
    reader.readAsDataURL(input.files[0]);
}

function analyze() {
    var uploadFiles = el('file-input').files;
    if (uploadFiles.length != 1){
         alert('Please select 1 file to analyze!');
         return;
    }
    el('analyze-button').innerHTML = "<i class='fa fa-spinner fa-spin '></i> Analyzing";
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
    var fileData = new FormData();
    fileData.append('file', uploadFiles[0]);
    xhr.send(fileData);
}

