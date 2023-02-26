(function () {

function handleDrop(evt) {

    var files = evt.dataTransfer.files;
    if (!files.length) {
      alert('Please select a file!');
      return;
    }
    return handleHash(evt, files);
  }

function handleFileSelect(evt) {
    var files = document.getElementById('files').files;
    if (!files.length) {
      alert('Please select a file!');
      return;
    }
    return handleHash(evt, files);
}

function handleHash(evt, files) {

  var sha256;
  var md5;

  function readBlob(opt_startByte, opt_stopByte) {

    var file = files[0];
    var start = parseInt(opt_startByte) || 0;
    var stop = parseInt(opt_stopByte) || file.size - 1;

    var reader = new FileReader();
    // If we use onloadend, we need to check the readyState.
    reader.onloadend = function(evt) {
      if (evt.target.readyState == FileReader.DONE) { // DONE == 2

        sha256.update(CryptoJS.enc.Latin1.parse(evt.target.result));
        md5.update(CryptoJS.enc.Latin1.parse(evt.target.result));

        var hash_sha256 = sha256.finalize();
        var hash_md5 = md5.finalize();

        document.getElementById('crypto_sha256').textContent = ['SHA-256: ', hash_sha256].join('');
        document.getElementById('crypto_md5').textContent = ['MD5: ', hash_md5].join('');
      }
    };

    var blob = file.slice(start, stop + 1);
    reader.readAsBinaryString(blob);
  }

  var startByte = evt.target.getAttribute('data-startbyte');
  var endByte = evt.target.getAttribute('data-endbyt');
  sha256 = CryptoJS.algo.SHA256.create();
  md5 = CryptoJS.algo.MD5.create();

  readBlob(startByte, endByte);
}
    // Setup browse listener
    var fileSelector = document.getElementById('files');
    fileSelector.addEventListener('change', handleFileSelect, false);
// let dropArea = document.getElementById('drop-area');

let dropArea = document.getElementById('placeholder');
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false)
});
function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
};

['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false)
});

['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false)
});

function highlight(e) {
  dropArea.classList.add('highlight');
}
function unhighlight(e) {
  dropArea.classList.remove('highlight');
}
dropArea.addEventListener('drop', handleDrop, false);

})();