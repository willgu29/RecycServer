var wordSpace = function (recordingsData){

	var fs = require('fs'); //require the file system

	var fileArr = recordingsData; //['./adam_1_2.json', './will_1_2.json', './tanuj_1_2.json'];

	var fileCont = fileArr;

	// for (var i=0;i<fileArr.length;i++) {
	// 	fileCont.push(JSON.parse(fs.readFileSync(fileArr[i], 'utf8')));  //Read file JSON: http://bit.ly/29bSF9J
	// 	//console.log(fileCont[i].job.name);
	// }

//	var words = obj.words;
	var words = [];

	fileCont.forEach(function(currVal, index, array) {
		words[index] = currVal.words;
	});

	//access people's words by words[personNumber]

	var numPeople = fileCont.length;
	var totalLength = parseFloat(fileCont[0].job.duration); //Grab length of leader's clip
	var division = 1;
	var partLen = totalLength/division;

	var part = [];  //stores entire partitions for each person

	for (var i =0; i<numPeople; i++) {
		part[i] = [];
	}

	//initialize part variable
	part.forEach(function(currVal, index, array) {
		for (var i=0; i<division;i++) {
			part[index][i] = {
				'duration' : 0,
				'numWords' : 0,
				'confSum' : 0,
				'avgConf' : 0,
				'wordConcat' : []
			}
		}
	});
	//console.log(part.length);
	//access individual word partition by: part[personNumber][partitionNumber]

	for (var numPerson = 0; numPerson<part.length; numPerson++) {
		var indvWords = words[numPerson];

		for (word in indvWords) { //iterate through each word
			//console.log(numPerson + '   ' + word)
			var indvWord = indvWords[word];
			//console.log(indvWord);
			//console.log(indvWord);
			//determine position in partitionArr to add the data
			var partNum = Math.floor(indvWord.time/partLen);
			var indvPart = part[numPerson][partNum];

			//obtain metadata about word
			var wordDuration = parseFloat(indvWord.duration);
			var wordText = indvWord.name;
			var wordConf = parseFloat(indvWord.confidence);
			//throw out words with null confidence.
			if (isNaN(wordConf)) {
				continue;
			}
			//console.log(indvPart);
			//add individual word contribution to part
			indvPart.duration += wordDuration;
			indvPart.wordConcat.push(wordText);
			indvPart.confSum += wordConf;
			indvPart.numWords += 1;
		}

		//remove intermediate confidence summing
		for (var i=0;i<division; i++) {
			if (indvPart.numWords == 0)
				continue;
			//console.log(part[i].confSum);
			indvPart.avgConf = part[i].confSum/part[i].numWords;
			delete indvPart.confSum;
		}
	}


	//access part partition via part[personNum][partitionNum]
	return part;

}

module.exports = wordSpace;
