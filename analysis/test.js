var fs = require('fs'); //require the file system
var obj = JSON.parse(fs.readFileSync('./adam_1_2.json', 'utf8')); //Async

/*  Async
var obj;
fs.readFile('file', 'utf8', function(err, data) {
	if(err) throw err;
	obj = JSON.parse(data);
});
*/

//Read file JSON: http://bit.ly/29bSF9J


var words = obj.words;


var totalLength = words[words.length-1].time;
var division = 1;
var partLen = totalLength/division;
var part = {};

//initialize part variable
for (var i = 0; i<=division;i++) {
	part[parseInt(i)] = {
		'duration' : 0,
		'numWords' : 0,
		'confSum' : 0,
		'avgConf' : 0,
		'wordConcat' : []
	};
}

//console.log(part);
//console.log(partLen);


for (word in words) { //iterate through each word
	//determine position in partitionArr to add the data
	var partNum = Math.floor(words[word].time/partLen);
	//obtain metadata about word
	var wordDuration = parseFloat(words[word].duration);
	var wordText = words[word].name;
	var wordConf = parseFloat(words[word].confidence);
	if (isNaN(wordConf)) {
		continue;
	}

	//add individual word contribution to part
	part[parseInt(partNum)].duration += wordDuration;
	part[parseInt(partNum)].wordConcat.push(wordText);
	part[parseInt(partNum)].confSum += wordConf;
	part[parseInt(partNum)].numWords += 1;
	

	// part.partNum = partNum;

	// if(words[word].time <= partLen) {
	// 	wordArr.push(words[word].time);
	// }
	//console.log(words[word].duration);
}

for (var i=0;i<=division; i++) {
	if (part[i].numWords == 0)
		continue;
	//console.log(part[i].confSum);
	part[i].avgConf = part[i].confSum/part[i].numWords;
	delete part[i].confSum;
}




// console.log(wordArr[wordArr.length-1]);
//console.log(obj);
console.log(part);