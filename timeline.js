var timeline_graph = function (recordingsData){

	var fs = require('fs'); //require the file system

	var fileArr = recordingsData; //['./adam_1_2.json', './will_1_2.json', './tanuj_1_2.json'];
	var fileCont = [];

	for (var i = 0; i < fileArr.length; i++) {
		fileCont.push(JSON.parse(fs.readFileSync(fileArr[i], 'utf8'))); //Read file JSON
	}

	var numPeople = fileCont.length;
	var totalLength = parseFloat(fileCont[0].job.duration); //Grab length of leader's clip

	//access people's talk timeline by talk[personNumber]
	
	var talk = [];

	fileCont.forEach(function(currVal, index, array) {
		talk[index] = currVal.speakers;
	});
}

module.exports = timeline_graph;