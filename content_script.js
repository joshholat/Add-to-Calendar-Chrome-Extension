//chrome.extension.sendRequest( { actionType: "pageLoad" }, function(response) { }); //used in debugging oauth

document.body.onmouseup = getTextSelection; //a listener for text highlighting
document.body.onkeypress = closePopUp; //a listener for certain key presses

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
	if (evt.keyCode == 13) { //checks for the "Enter" key
		if (titleText.value == "") {
			alert("Please enter a title for your event.");
		} else if (dateText.value.length != 10 || dateText.value.indexOf("-") < 4 || dateText.value.indexOf("D") > -1) {
			alert("The date you entered is not correct. It should be in the form of YYYY-MM-DD.");
		} else {
			
			if (beginAMPM.value.toString().toLowerCase() == "pm") {
				hour = parseInt(beginHour.value.toString()) + 12;
			} else {
				hour = parseInt(beginHour.value.toString());
			}
			
			var beginningTime = hour + ":" + minutes + ":00.0000";
			
			var endTime = '';
			if (endHour.value == '' && endMinutes.value == '') {
				endTime = (hour + 1) + ":" + minutes + ":00.000";
			} else {			
				if (endAMPM.value == 'PM') {
					endTime = (parseInt(endHour.value) + 12) + ":" + endMinutes.value + ":00.000";
				} else {
					endTime = endHour.value + ":" + endMinutes.value + ":" + "00.000";
				}
			}
									
			chrome.extension.sendRequest( { actionType: "popOverCleared", eventTitle: titleText.value, eventDetails: detailText.value, eventLocation: locationText.value, eventDate: dateText.value, eventStartTime: beginningTime, eventEndTime: endTime}, function(response) { });
			$('#popOver').fadeOut('slow', function() { }); //hides the popover
		}
	}
}

var hour = ''; var minutes = ''; var day = ''; var month = ''; var year = ''; var theDate = '';

function getTextSelection() {
	var textSelection = window.getSelection();
	textSelection = textSelection.toString();
	var foundDate = false;
	
	var monthPattern = /(january|february|march|april|may|june|july|august|september|october|november|december)/gi; //any month
	var shortMonthPattern = /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/gi; //any short month
	var dashMonthPattern = /^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$/gi; //2004-04-30
	var timeDateStamp = /^(((((0[13578])|([13578])|(1[02]))[\-\/\s]?((0[1-9])|([1-9])|([1-2][0-9])|(3[01])))|((([469])|(11))[\-\/\s]?((0[1-9])|([1-9])|([1-2][0-9])|(30)))|((02|2)[\-\/\s]?((0[1-9])|([1-9])|([1-2][0-9]))))[\-\/\s]?\d{4})(\s(((0[1-9])|([1-9])|(1[0-2]))\:([0-5][0-9])((\s)|(\:([0-5][0-9])\s))([AM|PM|am|pm]{2,2})))?$/gi; //11/30/2003 10:12:24 am
	
	if (textSelection.match(monthPattern) || textSelection.match(shortMonthPattern) || textSelection.match(timeDateStamp) || textSelection.match(dashMonthPattern)) {
		foundDate = true;
		theDate = Date.parse(textSelection);
	}
	
	if (foundDate && theDate != null) {
		theDate = Date.parse(textSelection);
		theDate = theDate.toString();

		// issue with this - Oct 31 (THU) 7 PM -> formatting
		
		if (theDate.indexOf("Jan") > -1) month = "01";
		else if (theDate.indexOf("Feb") > -1) month = "02";
		else if (theDate.indexOf("Mar") > -1) month = "03";
		else if (theDate.indexOf("Apr") > -1) month = "04";
		else if (theDate.indexOf("May") > -1) month = "05";
		else if (theDate.indexOf("Jun") > -1) month = "06";
		else if (theDate.indexOf("Jul") > -1) month = "07";
		else if (theDate.indexOf("Aug") > -1) month = "08";
		else if (theDate.indexOf("Sep") > -1) month = "09";
		else if (theDate.indexOf("Oct") > -1) month = "10";
		else if (theDate.indexOf("Nov") > -1) month = "11";
		else if (theDate.indexOf("Dec") > -1) month = "12";
		
		theDate = theDate.substring(8);
		day = theDate.substring(0, 2);
		theDate = theDate.substring(3);
		year = theDate.substring(0, 4);
		
		dateTextBox.setAttribute('value', year + "-" + month + "-" + day);
		
		theDate = theDate.substring(5);
		hour = theDate.substring(0, 2);
		minutes = theDate.substring(3, 5);
		
		beginTimeHourTextBox.setAttribute('value', hour);
		beginMinutesTextBox.setAttribute('value', minutes);
		
		if (parseInt(theDate.substring(0, 2)) < 12) {
			beginAMPMTextBox.setAttribute('value', 'AM');
		} else {
			beginAMPMTextBox.setAttribute('value', 'PM');
		}
	} else {
		foundDate = false;
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







/* ------------------------------ OLD PARSING CODE -----------------

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
}*/