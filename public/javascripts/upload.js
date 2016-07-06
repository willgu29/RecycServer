function upload(audioFile) {

  console.log(audioFile.files[0]);
  alert("hello");



  $.ajax({
      url: "https://recyc.herokuapp.com/speechmatics/upload",
      type: "POST",
      data: {"file" :audioFile.files[0]},
      processData: false,
      contentType: false,
      success: function (res) {
        document.getElementById("response").innerHTML = res;
      }
  });

}
