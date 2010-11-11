//chrome.extension.sendRequest( { actionType: "pageLoad" }, function(response) { });

document.body.onmouseup = getTextSelection;
document.body.onkeypress = closePopUp;

var newDiv = document.createElement('div');
var titleTextBox = document.createElement('input');
var detailTextBox = document.createElement('input');
var locationTextBox = document.createElement('input');
var dateTextBox = document.createElement('input');
var beginTimeHourTextBox = document.createElement('input');
var beginMinutesTextBox = document.createElement('input');
var beginAMPMTextBox = document.createElement('input');
var endTimeHourTextBox = document.createElement('input');
var endMinutesTextBox = document.createElement('input');
var endAMPMTextBox = document.createElement('input');

function init() {
	newDiv.setAttribute('id', 'popOver');
	newDiv.style.width = "350px";
	newDiv.style.height = "300px";
	newDiv.style.position = "absolute";
	newDiv.style.display = "none";
	newDiv.style.background = "#FFFFFF";
	newDiv.style.border = "4px solid #000";
	newDiv.style.padding = "5px 5px 5px 5px";
	newDiv.innerHTML = "";
	newDiv.style.left = "300px";
	document.body.appendChild(newDiv);

	titleTextBox.setAttribute('id', 'titleText');
	titleTextBox.setAttribute('type', 'text');
	titleTextBox.setAttribute('size', '40');
	titleTextBox.setAttribute('value', '');
	titleTextBox.setAttribute('placeholder', 'Event Title');
	titleTextBox.style.float = "right";

	detailTextBox.setAttribute('id', 'detailText');
	detailTextBox.setAttribute('type', 'text');
	detailTextBox.setAttribute('size', '40');
	detailTextBox.setAttribute('value', '');
	detailTextBox.setAttribute('placeholder', 'Event Details (Optional)');
	detailTextBox.style.float = "right";

	locationTextBox.setAttribute('id', 'locationText');
	locationTextBox.setAttribute('type', 'text');
	locationTextBox.setAttribute('size', '40');
	locationTextBox.setAttribute('value', '');
	locationTextBox.setAttribute('placeholder', 'Event Location');
	locationTextBox.style.float = "right";

	dateTextBox.setAttribute('id', 'dateText');
	dateTextBox.setAttribute('type', 'text');
	dateTextBox.setAttribute('size', '12');
	dateTextBox.setAttribute('maxlength', '10');
	//dateTextBox.setAttribute('value', '');
	dateTextBox.setAttribute('placeholder', 'Date');
	dateTextBox.style.float = "right";

	beginTimeHourTextBox.setAttribute('id', 'beginHour');
	beginTimeHourTextBox.setAttribute('type', 'text');
	beginTimeHourTextBox.setAttribute('size', '2');
	beginTimeHourTextBox.setAttribute('maxlength', '2');
	beginTimeHourTextBox.style.float = "right";

	beginMinutesTextBox.setAttribute('id', 'beginMinutes');
	beginMinutesTextBox.setAttribute('type', 'text');
	beginMinutesTextBox.setAttribute('size', '2');
	beginMinutesTextBox.setAttribute('maxlength', '2');
	beginMinutesTextBox.style.float = "right";

	beginAMPMTextBox.setAttribute('id', 'beginAMPM');
	beginAMPMTextBox.setAttribute('type', 'text');
	beginAMPMTextBox.setAttribute('size', '2');
	beginAMPMTextBox.setAttribute('maxlength', '2');
	//beginAMPMTextBox.setAttribute('value', '');
	beginAMPMTextBox.setAttribute('placeholder', 'PM');
	beginAMPMTextBox.style.float = "right";

	endTimeHourTextBox.setAttribute('id', 'endHour');
	endTimeHourTextBox.setAttribute('type', 'text');
	endTimeHourTextBox.setAttribute('size', '2');
	endTimeHourTextBox.setAttribute('maxlength', '2');
	endTimeHourTextBox.style.float = "right";

	endMinutesTextBox.setAttribute('id', 'endMinutes');
	endMinutesTextBox.setAttribute('type', 'text');
	endMinutesTextBox.setAttribute('size', '2');
	endMinutesTextBox.setAttribute('maxlength', '2');
	endMinutesTextBox.style.float = "right";

	endAMPMTextBox.setAttribute('id', 'endAMPM');
	endAMPMTextBox.setAttribute('type', 'text');
	endAMPMTextBox.setAttribute('size', '2');
	endAMPMTextBox.setAttribute('maxlength', '2');
	endAMPMTextBox.setAttribute('value', '');
	endAMPMTextBox.setAttribute('placeholder', 'PM');
	endAMPMTextBox.style.float = "right";
}

function closePopUp(evt) {
	if (evt.keyCode == 13) {
		if (titleText.value == "") {
			alert("Please enter a title for your event.");
		} else if (dateText.value.length != 10 || dateText.value.indexOf("-") < 4 || dateText.value.indexOf("D") > -1) {
			alert("The date you entered is not correct. It should be in the form of YYYY-MM-DD.");
		} else {

			//another else to make sure there is a beginning time
			//send them and add them
			
			if (theDate.indexOf("pm") > -1) {
				hour = String(parseInt(hour) + 12);
			}
			
			time = hour + ":" + minutes + ":" + "00.000";
			
			var endTime = '';
			if (endHour.value == '' || endMinutes.value == '') {
				endTime = String(parseInt(hour) + 1);
				endTime = endTime + ":" + minutes + ":" + "00.000";
			} else {
				if (endAMPM.value == 'PM') {
					endTime = String(parseInt(endHour.value) + 12) + ":" + endMinutes.value + ":" + "00.000";
				} else {
					endTime = endHour.value + ":" + endMinutes.value + ":" + "00.000";
				}
			}
			
			//alert("Title:" + titleText.value + " AND Details: " + detailText.value + " AND Location: " + locationText.value + " AND Date: " + dateText.value + " AND Begin: " + time + " AND End: " + endTime);
			
			chrome.extension.sendRequest( { actionType: "popOverCleared", eventTitle: titleText.value, eventDetails: detailText.value, eventLocation: locationText.value, eventDate: dateText.value }, function(response) { });
			$('#popOver').fadeOut('slow', function() { });			
		}
	}
}

var dateType = ''; var day = ''; var year = ''; var month = ''; var theDate = ''; var hour = ''; var minutes = '';

function getTextSelection() {
	var textSelection = window.getSelection();
	textSelection = textSelection.toString();
	var foundDate = false;
	
	var monthPattern = /(january|february|march|april|may|june|july|august|september|october|november|december)/gi; //any month
	var shortMonthPattern = /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/gi; //any short month
	var dashMonthPattern = /^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$/gi; //2004-04-30
	var timeDateStamp = /^(((((0[13578])|([13578])|(1[02]))[\-\/\s]?((0[1-9])|([1-9])|([1-2][0-9])|(3[01])))|((([469])|(11))[\-\/\s]?((0[1-9])|([1-9])|([1-2][0-9])|(30)))|((02|2)[\-\/\s]?((0[1-9])|([1-9])|([1-2][0-9]))))[\-\/\s]?\d{4})(\s(((0[1-9])|([1-9])|(1[0-2]))\:([0-5][0-9])((\s)|(\:([0-5][0-9])\s))([AM|PM|am|pm]{2,2})))?$/gi; //11/30/2003 10:12:24 am
	
	if (textSelection.match(monthPattern)) {
		foundDate = true;
		theDate = textSelection.toLowerCase();
		foundType = "monthPattern"; //convert the month to a number and try to find a date/year otherwise use the current year
		
		if (theDate.indexOf("january") > -1) month = "01";
		else if (theDate.indexOf("february") > -1) month = "02";
		else if (theDate.indexOf("march") > -1) month = "03";
		else if (theDate.indexOf("april") > -1) month = "04";
		else if (theDate.indexOf("may") > -1) month = "05";
		else if (theDate.indexOf("june") > -1) month = "06";
		else if (theDate.indexOf("july") > -1) month = "07";
		else if (theDate.indexOf("august") > -1) month = "08";
		else if (theDate.indexOf("september") > -1) month = "09";
		else if (theDate.indexOf("october") > -1) month = "10";
		else if (theDate.indexOf("november") > -1) month = "11";
		else if (theDate.indexOf("december") > -1) month = "12";
		
		if (theDate.indexOf("st") > -1) {
			if (theDate.indexOf("august") > -1) {
				if (theDate.indexOf("august") < 3) {
					day = theDate.substring(theDate.indexOf("st") + 2);
					day = day.substring(day.indexOf("st") - 2, day.indexOf("st"));				
				} else {
					day = "DD"; //give up looking for it
				}
			} else {
				day = theDate.substring(theDate.indexOf("st") - 2, theDate.indexOf("st"));				
			}
		} else if (theDate.indexOf("nd") > -1) {
			day = theDate.substring(theDate.indexOf("nd") - 2, theDate.indexOf("nd"));
		} else if (theDate.indexOf("th") > -1) {
			day = theDate.substring(theDate.indexOf("th") - 2, theDate.indexOf("th"));
		} else {
			day = 'DD';
		}
		
		if (theDate.indexOf("201") > -1) {
			year = theDate.substring(theDate.indexOf("201"), theDate.indexOf("201") + 4);
		} else {
			year = "2010";
		}
		
		theDate = year + "-" + month + "-" + day;

		dateTextBox.setAttribute('value', theDate);
	} else if (textSelection.match(shortMonthPattern)) {
		foundDate = true;
		theDate = textSelection.toLowerCase();
		foundType = "shortMonthPattern"; //convert the month to a number and try to find a date/year otherwise use the current year
		
		if (theDate.indexOf("jan") > -1) month = "01";
		else if (theDate.indexOf("feb") > -1) month = "02";
		else if (theDate.indexOf("mar") > -1) month = "03";
		else if (theDate.indexOf("apr") > -1) month = "04";
		else if (theDate.indexOf("may") > -1) month = "05";
		else if (theDate.indexOf("jun") > -1) month = "06";
		else if (theDate.indexOf("jul") > -1) month = "07";
		else if (theDate.indexOf("aug") > -1) month = "08";
		else if (theDate.indexOf("sep") > -1) month = "09";
		else if (theDate.indexOf("oct") > -1) month = "10";
		else if (theDate.indexOf("nov") > -1) month = "11";
		else if (theDate.indexOf("dec") > -1) month = "12";
		
		if (theDate.indexOf("st") > -1) {
			day = theDate.substring(theDate.indexOf("st") - 2, theDate.indexOf("st"));
		} else if (theDate.indexOf("nd") > -1) {
			day = theDate.substring(theDate.indexOf("nd") - 2, theDate.indexOf("nd"));
		} else if (theDate.indexOf("th") > -1) {
			day = theDate.substring(theDate.indexOf("th") - 2, theDate.indexOf("th"));
			if (!parseInt(day)) {
				day = "DD";
			}
		}
		
		for (var i = 0; i < theDate.length - 1; i++) {
			if (parseInt(String(theDate.charAt(i) + theDate.charAt(i + 1)))) {
				if (parseInt(String(theDate.charAt(i + 1) + theDate.charAt(i + 2)))) {
					day = String(theDate.charAt(i + 1) + theDate.charAt(i + 2));
					break;
				}
				day = String(theDate.charAt(i) + theDate.charAt(i + 1));
				break;
			}
		}
		if (day.indexOf(" ") > -1) {
			day = "0" + day;
		}
		
		if (theDate.indexOf("201") > -1) {
			year = theDate.substring(theDate.indexOf("201"), theDate.indexOf("201") + 4);
		} else {
			year = "2010";
		}
		
		theDate = year + "-" + month + "-" + day;
		dateTextBox.setAttribute('value', theDate);
		
		theDate = textSelection.toLowerCase();
		if (theDate.indexOf("pm") > -1) {
			if (theDate.indexOf(":") > -1 && Math.abs((theDate.indexOf(":") - theDate.indexOf("pm"))) < 5) {
				hour = theDate.substring(theDate.indexOf(":") - 2, theDate.indexOf(":"));
				minutes = theDate.substring(theDate.indexOf(":") + 1, theDate.indexOf(":") + 3);
			} else {
				hour = theDate.substring(theDate.indexOf("pm") - 2, theDate.indexOf("pm"));
				minutes = "00";
			}
			beginAMPMTextBox.setAttribute('value', 'PM');
		} else {
			if (theDate.indexOf(":") > -1 && Math.abs((theDate.indexOf(":") - theDate.indexOf("pm"))) < 5) {
				hour = theDate.substring(theDate.indexOf(":") - 2, theDate.indexOf(":"));
				minutes = theDate.substring(theDate.indexOf(":") + 1, theDate.indexOf(":") + 3);
			} else {
				hour = theDate.substring(theDate.indexOf("am") - 2, theDate.indexOf("am"));
				minutes = "00";
			}			
			beginAMPMTextBox.setAttribute('value', 'AM');
		}
		
		beginTimeHourTextBox.setAttribute('value', hour);
		beginMinutesTextBox.setAttribute('value', minutes);
	} else if (textSelection.match(timeDateStamp)) {
		foundDate = true;
		foundType = "timeDateStamp"; 
		if (textSelection.length <= 10) { //reverse it the right way and use dashes so that google likes it
			if (textSelection.indexOf('/') <= 3) {
				day += textSelection.substring(0, textSelection.indexOf('/'));
				month += textSelection.substring(day.length + 1, textSelection.length - 5);
				year += textSelection.substring(textSelection.length - 4);
			}
			
			theDate = year + "-" + month + "-" + day;

			dateTextBox.setAttribute('value', theDate);
		} else {
			if (textSelection.indexOf('/') <= 3) {
				day += textSelection.substring(0, textSelection.indexOf('/'));
				month += textSelection.substring(day.length + 1, day.length + 3);
				year += textSelection.substring(day.length + 4, day.length + 8);
			}
			
			theDate = year + "-" + month + "-" + day;

			dateTextBox.setAttribute('value', theDate);	
			
			theDate = textSelection.toLowerCase();
			if (theDate.indexOf("pm") > -1) {
				if (theDate.indexOf(":") > -1) {
					hour = theDate.substring(theDate.indexOf(":") - 2, theDate.indexOf(":"));
					minutes = theDate.substring(theDate.indexOf(":") + 1, theDate.indexOf(":") + 3);
				} else {
					hour = theDate.substring(theDate.indexOf("pm") - 2, theDate.indexOf("pm"));
					minutes = "00";
				}
				beginAMPMTextBox.setAttribute('value', 'PM');
			} else {
				if (theDate.indexOf(":") > -1) {
					hour = theDate.substring(theDate.indexOf(":") - 2, theDate.indexOf(":"));
					minutes = theDate.substring(theDate.indexOf(":") + 1, theDate.indexOf(":") + 3);
				} else {
					hour = theDate.substring(theDate.indexOf("am") - 2, theDate.indexOf("am"));
					minutes = "00";
				}			
				beginAMPMTextBox.setAttribute('value', 'AM');
			}

			beginTimeHourTextBox.setAttribute('value', hour);
			beginMinutesTextBox.setAttribute('value', minutes);
		}
	} else if (textSelection.match(dashMonthPattern)) {
		foundDate = true;
		foundType = "dashMonthPattern"; //doesn't need to be reversed because the wrong way won't match the regex
		theDate = textSelection;
		dateTextBox.setAttribute('value', theDate);
	}
		
	if (textSelection.length > 1 && textSelection.length < 40 && foundDate) {
		init();
		$("#popOver").fadeIn("slow");
		newDiv.style.top = window.pageYOffset + 20 + "px";
		newDiv.innerHTML = "<div style='color: black; text-align: center; margin-left: auto; margin-right: auto; font-size: 14px;'>\
							<u>Highlighted Text</u><br/>" + textSelection.toString() + "</div><br/><br/>";
		
		document.getElementById("popOver").appendChild(titleTextBox);
		document.getElementById("popOver").appendChild(detailTextBox);
		document.getElementById("popOver").appendChild(locationTextBox);
		
		newDiv.innerHTML += "<div style='width:300px; float:right;'>";
		document.getElementById("popOver").appendChild(dateTextBox);	
		newDiv.innerHTML += "</div>";		
		
		newDiv.innerHTML += "<div style='width:300px; float:right;'>";		
		document.getElementById("popOver").appendChild(beginAMPMTextBox);
		document.getElementById("popOver").appendChild(beginMinutesTextBox);
		newDiv.innerHTML += "<div style='float:right; color: black; font-size: 14px;'>:</div>";		
		document.getElementById("popOver").appendChild(beginTimeHourTextBox);
		newDiv.innerHTML += "</div>";	
		
		newDiv.innerHTML += "<div style='width:300px; float:right;'>";		
		document.getElementById("popOver").appendChild(endAMPMTextBox);
		document.getElementById("popOver").appendChild(endMinutesTextBox);
		newDiv.innerHTML += "<div style='float:right; color: black; font-size: 14px;'>:</div>";		
		document.getElementById("popOver").appendChild(endTimeHourTextBox);
		newDiv.innerHTML += "</div>";	
		
		newDiv.innerHTML += "<div style='color: black; font-size: 14px;'>\
							<div style='padding-bottom:6px;'>Event Title:</div>\
							<div style='padding-bottom:6px;'>Event Details:</div>\
							<div style='padding-bottom:6px;'>Event Location:</div>\
							<div style='padding-bottom:6px;'>Event Date:</div>\
							<div style='padding-bottom:6px;'>Event Begin Time:</div>\
							<div style='padding-bottom:6px;'>Event End Time:</div>\
							<br/><br/><center>Simply tap 'Enter' to have your event added.</center></div>";
		
		chrome.extension.sendRequest( { actionType: "popover" }, function(response) { });
	}
}

/*<script type="text/javaScript"> 
	new tcal ({
		'formname': 'emailform',
		'controlname': 'timedate'
	});
</script>*/

/*performMultiSearch("Lorem", document.body);

function performMultiSearch(elem, searchElem) {
    // set up variables
    var searchString; // Will hold the text to search for
    var theSelection; // Will hold the document's selection object
    var textNodes; // Will hold all the text nodes in the document
    
    // Set it to search the entire document if we haven't been given an element to search
    if(!searchElem || typeof(searchElem) == 'undefined') searchElem = document.body;
    
    // Get the string to search for
    if(elem && elem.value) searchString = elem.value;
    else if(this && this.value) searchString = this.value;
	searchString = elem;
    
    // Get all the text nodes in the document
    textNodes = findTypeNodes(searchElem, 3);
    
    // Get the selection object
    if(window.getSelection) theSelection = window.getSelection(); // firefox
    else { // some other browser - doesn't support multiple selections at once
        alert("sorry this searching method isn't supported by your browser");
        return;
    }
    
    // Empty the selection
    theSelection.removeAllRanges(); // We want to empty the selection regardless of whether we're selecting anything
    
	var counter = 0;
	var rangeArray = [];
    if(searchString.length > 0) { // make sure the string isn't empty, or it'll crash.
        // Search all text nodes
        for(var i = 0; i < textNodes.length; i++) {
            // Create a regular expression object to do the searching
            var reSearch = new RegExp(searchString, 'gmi'); // Set it to 'g' - global (finds all instances), 'm' - multiline (searches more than one line), 'i' - case insensitive
			
            while (reSearch(stringToSearch)) { // While there are occurrences of the searchString
                // Add the new selection range
                var thisRange = document.createRange();
                thisRange.setStart(textNodes[i], reSearch.lastIndex - searchString.length); // Start node and index of the selection range
                thisRange.setEnd(textNodes[i], reSearch.lastIndex); //  End node and index of the selection
				rangeArray[counter] = thisRange;
				counter++;
            }
        }
    }

	for (var i = rangeArray.length - 1; i >= 0; i--) {
		var myLink = document.createElement('a'); 
		//var href = document.createAttribute('href'); 
		//myLink.setAttribute('href','http://www.google.com'); 
		myLink.setAttribute('onclick','helloThere();'); 
		myLink.innerText ="GO";
		rangeArray[i].insertNode(myLink);
	}
    
    return;
}

// Recursively find all text nodes within an element
function findTypeNodes(elem, type) {
    // Remove superfluous text nodes and merge adjacent text nodes
    elem.normalize();
    
    var typeNodes = new Array();
    // Search all children of this element to see which ones are the right type of node
    for(var nodeI = 0; nodeI < elem.childNodes.length; nodeI++) {
        if (elem.childNodes[nodeI].nodeType == type)
			typeNodes.push(elem.childNodes[nodeI]); // If it is a the right type of node, add it to the array
        else {
            // If not a the right type of node, search it in turn
            typeNodes = typeNodes.concat(findTypeNodes(elem.childNodes[nodeI],type));
        }
    }
    return typeNodes; // return the array
}*/