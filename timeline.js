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
	
	var numPerson, talkSegment, numTalkSegments;
	
	
	// GOOGLE CHARTS API
	
	google.charts.load('current', {'packages':['timeline']});
  google.charts.setOnLoadCallback(drawChart);
				
  	var container = document.getElementById('timeline');
    var chart = new google.visualization.Timeline(container);
    var dataTable = new google.visualization.DataTable();

    dataTable.addColumn({ type: 'string', id: 'Person' });
		dataTable.addColumn({ type: 'string', id: 'Segment' });
    dataTable.addColumn({ type: 'date', id: 'Start' });
    dataTable.addColumn({ type: 'date', id: 'End' });
			
		for (numPerson = 0; numPerson < numPeople; numPerson++) {

			numTalkSegments = talk[numPerson].length;
			talkSegment = 0;
			
			var personTalkSegments = talk[numPerson];
			
			for (talkSegment = 0; talkSegment < numTalkSegments; talkSegment++) {
				
				dataTable.addRows([
				
					[('Person '+ (numPerson + 1).toString()) + , (talkSegment + 1).toString(), new Date(0, 0, 0, 0, 0, personTalkSegments[talkSegment].time), new Date(0, 0, 0, 0, 0, (personTalkSegments[talkSegment].time + personTalkSegments[talkSegment].duration)) ]]);
				}
		}
		
		chart.draw(dataTable);
}

module.exports = timeline_graph;