function upload(audioFile) {

  console.log(audioFile.files[0]);
  alert("hello");

  var json = {
    "data_file"    : audioFile.files[0],
    "model"        : "en-US,",
    "notification" : "callback",
    "callback"     : "localhost:3000/speechmatics/process"
  }

  $.ajax({
      url: "https://api.speechmatics.com/v1.0/user/3621/jobs/?auth_token=MDBhM2Q3YWEtODI3OS00MDA1LWFjNzAtMjE0OGJjYWEzNjQ0",
      type: "POST",
      data: json,
      processData: false,
      contentType: false,
      success: function (res) {
        document.getElementById("response").innerHTML = res;
      }
  });

}
