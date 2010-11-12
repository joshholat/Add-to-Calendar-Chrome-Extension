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

function setupTextBoxes(whichBox, id, size, placeholder) {
	whichBox.setAttribute('id', id);
	whichBox.setAttribute('type', 'text');
	whichBox.setAttribute('size', size);
	whichBox.setAttribute('value', '');
	whichBox.setAttribute('placeholder', placeholder);
	whichBox.setAttribute('maxlength', size);
	whichBox.style.float = "right";	
}

function init() {
	newDiv.setAttribute('id', 'popOver');
	newDiv.style.width = "475px";
	newDiv.style.height = "350px";
	newDiv.style.position = "absolute";
	newDiv.style.zIndex = "9999";
	newDiv.style.display = "none";
	newDiv.style.background = "#C9C8C5";
	newDiv.style.border = "4px solid #000";
	newDiv.style.borderRadius = "7px";
	newDiv.style.padding = "5px 5px 5px 5px";
	newDiv.style.left = "300px";
	newDiv.innerHTML = "";
	document.body.appendChild(newDiv);

	setupTextBoxes(titleTextBox, "titleText", "40", "Event Title");
	setupTextBoxes(detailTextBox, "detailText", "40", "Event Details (Optional)");
	setupTextBoxes(locationTextBox, "locationText", "40", "Event Location");
	setupTextBoxes(dateTextBox, "dateText", "12", "Date");
	setupTextBoxes(beginTimeHourTextBox, "beginHour", "2", "");
	setupTextBoxes(beginMinutesTextBox, "beginMinutes", "2", "");
	setupTextBoxes(beginAMPMTextBox, "beginAMPM", "2", "PM");
	setupTextBoxes(endTimeHourTextBox, "endHour", "2", "");
	setupTextBoxes(endMinutesTextBox, "endMinutes", "2", "");
	setupTextBoxes(endAMPMTextBox, "endAMPM", "2", "PM");
}

function closePopUp(evt) {
	if (evt.keyCode == 124) { //checks for Shift + |
		$('#popOver').fadeOut('slow', function() { }); //hides the popover
	} else if (evt.keyCode == 13) { //checks for the "Enter" key
		if (titleText.value == "") {
			alert("Please enter a title for your event.");
		} else if (dateText.value.length != 10 || dateText.value.indexOf("-") < 4 || dateText.value.indexOf("D") > -1) {
			alert("The date you entered is not correct. It should be in the form of YYYY-MM-DD.");
		} else {
			
			if (beginAMPM.value.toString().toLowerCase() == "pm" && beginHour.value.toString() != "12") {
				hour = parseInt(beginHour.value.toString()) + 12;
			} else if (beginAMPM.value.toString().toLowerCase() == "am" && beginHour.value.toString() == "12") {
				hour = "00";
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

	if (foundDate && theDate != null && textSelection.length > 1 && textSelection.length < 40) {
		init();
		theDate = theDate.toString();
		
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
		
		if (parseInt(hour) > 12) {
			hour = String(hour - 12);
		}
		
		if (hour.length == 1) {
			hour = "0" + hour;
		}
		
		beginTimeHourTextBox.setAttribute('value', hour);
		beginMinutesTextBox.setAttribute('value', minutes);
		
		if (parseInt(theDate.substring(0, 2)) < 12) {
			beginAMPMTextBox.setAttribute('value', 'AM');
		} else {
			beginAMPMTextBox.setAttribute('value', 'PM');
		}

		$("#popOver").fadeIn("slow");
		newDiv.style.top = window.pageYOffset + 20 + "px";
		newDiv.innerHTML = "<div style='color: black; text-align: center; margin-left: auto; margin-right: auto; font-size: 14px;  font-family: \"Times New Roman\";'>\
							<u>Highlighted Text</u><br/>" + textSelection.toString() + "</div><br/><br/>";

		newDiv.innerHTML += "<div style='width:425px; float:right;'>";		
		document.getElementById("popOver").appendChild(titleTextBox);
		newDiv.innerHTML += "</div>";		

		newDiv.innerHTML += "<div style='width:425px; float:right;'>";
		document.getElementById("popOver").appendChild(detailTextBox);
		newDiv.innerHTML += "</div>";
		
		newDiv.innerHTML += "<div style='width:425px; float:right;'>";
		document.getElementById("popOver").appendChild(locationTextBox);
		newDiv.innerHTML += "</div>";		

		newDiv.innerHTML += "<div style='width:425px; float:right;'>";
		document.getElementById("popOver").appendChild(dateTextBox);	
		newDiv.innerHTML += "</div>";		
		
		newDiv.innerHTML += "<div style='width:425px; float:right;'>";		
		document.getElementById("popOver").appendChild(beginAMPMTextBox);
		document.getElementById("popOver").appendChild(beginMinutesTextBox);
		newDiv.innerHTML += "<div style='float:right;'>:</div>";		
		document.getElementById("popOver").appendChild(beginTimeHourTextBox);
		newDiv.innerHTML += "</div>";	
		
		newDiv.innerHTML += "<div style='width:425px; float:right;'>";		
		document.getElementById("popOver").appendChild(endAMPMTextBox);
		document.getElementById("popOver").appendChild(endMinutesTextBox);
		newDiv.innerHTML += "<div style='float:right;'>:</div>";		
		document.getElementById("popOver").appendChild(endTimeHourTextBox);
		newDiv.innerHTML += "</div>";	
		
		newDiv.innerHTML += "<div style='color: black; font-size: 14px; font-family: \"Times New Roman\";'>\
							<div style='padding-bottom:8px;'>Event Title:</div>\
							<div style='padding-bottom:8px;'>Event Details:</div>\
							<div style='padding-bottom:8px;'>Event Location:</div>\
							<div style='padding-bottom:8px;'>Event Date:</div>\
							<div style='padding-bottom:8px;'>Event Begin Time:</div>\
							<div style='padding-bottom:8px;'>Event End Time:</div>\
							<br/><br/><center>When you're finished, tap 'Enter' to have your event added.\
							<br/><br/>To close the popup and cancel the entry, tap 'Shift' + '\\'.</center></div>";
		
		chrome.extension.sendRequest( { actionType: "popover" }, function(response) { });
	}
}