function upload() {

  var audio = document.getElementById('audio');

  alert("Upload successful");

  alert(JSON.stringify(audio));

  $.ajax({
      url: "localhost:3000/analysis/wordspace",
      type: "POST",
      data: {"file" : audio},
      processData: false,
      // contentType: "multipart/form-data",
      success: function (res) {
        alert(res);
      }
  });

};
