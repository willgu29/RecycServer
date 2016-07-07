function upload() {

  var audio = document.getElementById('audio').value;

  alert(JSON.stringify(audio));
  //MISSING DATA_FILE????

  $.ajax({
      url: "https://recyc.herokuapp.com/speechmatics/upload",
      type: "POST",
      data: {"file" :audioFile.files[0]},
      processData: false,
      contentType: "multipart/form-data",
      success: function (res) {
        alert(res);
      }
  });

}
