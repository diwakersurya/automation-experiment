// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html
  var accessToken = "a76ff508d132417abb05eef394802942",
    baseUrl = "https://api.api.ai/v1/",
    $speechInput,
    $recBtn,
    recognition,
    messageRecording = "Recording...",
    messageCouldntHear = "I couldn't hear you, could you say that again?",
    messageInternalError = "Oh no, there has been an internal server error",
    messageSorry = "I'm sorry, I don't have the answer to that yet.";

$(function() {
 //--------------------- 

  var accessToken = "a76ff508d132417abb05eef394802942";
	var baseUrl = "https://api.api.ai/v1/";
  
		$(document).ready(function() {
			// $("#input").keypress(function(event) {
			// 	if (event.which == 13) {
			// 		event.preventDefault();
			// 		send();
			// 	}
			// });
			// $("#rec").click(function(event) {
			// 	switchRecognition();
			// });
		});
		var recognition;
		function startRecognition(clientId,context) {
      if(recognition){
        stopRecognition(context);
      }
			recognition = new webkitSpeechRecognition();
			recognition.onstart = function(event) {
				//updateRec(context);
			};
			recognition.onresult = function(event) {
				var text = "";
			    for (var i = event.resultIndex; i < event.results.length; ++i) {
			    	text += event.results[i][0].transcript;
			    }
       // console.log(clientId);
			    setInput(text,clientId);
				stopRecognition(context);
			};
			recognition.onend = function() {
				stopRecognition(context);
			};
			recognition.lang = "en-US";
			recognition.start();
		}
	
		function stopRecognition(context) {
			if (recognition) {
				recognition.stop();
				recognition = null;
			}
			//updateRec(context);
		}
		// function switchRecognition(clientId,context) {
		// 	if (recognition) {
		// 		stopRecognition(context);
		// 	} else {
		// 		startRecognition(clientId,context);
		// 	}
		// }
		function setInput(text,clientId) {
      console.log("+++++",text,$("#input-"+clientId).val())
      let selector='*[data-id="input-'+clientId+'"]';
      $(selector).val(text);
			//document.querySelector("#input-"+clientId);
			send(clientId);
		}
		// function updateRec(context) {
		// let selector='*[data-click="speak"]';
		// console.log("+_+__+_+_+",$(context).find(selector));
		// $(context).find(selector).html((recognition ? "mic" : "stop"));
		// 	//$("#rec").text(recognition ? "mic" : "Speak");
		// }
		function send(clientId) {
        let selector='*[data-id="input-'+clientId+'"]';
      	var text=$(selector).val();
			//var text = $("#input-"+clientId).val();
      console.log(">>>>>",text);
			$.ajax({
				type: "POST",
				url: baseUrl + "query?v=20150910",
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				headers: {
					"Authorization": "Bearer " + accessToken
				},
				data: JSON.stringify({ query: text, lang: "en", sessionId: "somerandomthing" }),
				success: function(data) {
					setResponse(JSON.stringify(data, undefined, 2));
				},
				error: function() {
					setResponse("Internal Server Error");
				}
			});
			setResponse("Loading...");
		}
		function setResponse(val) {
      try{
      console.log(JSON.parse(val).result.fullfillment.speech);
      }
      catch(ex){}
			//$("#response").text(val);
		}
  
 //---------------------
  
//global setting to send data as json  
var actionURL="/";
  $.ajaxSetup({
    contentType:"application/json" 
  })
var button='<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" data-click={{buttonText}}> {{buttonText}} </button>';
  
var fabButton='<button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored fab-btn-custom" data-click={{buttonText}}> <i class="material-icons" data-click={{buttonText}}>{{micon}}</i> </button>';
  
var input='<div class="mdl-textfield mdl-js-textfield"> <input disabled class="mdl-textfield__input" type="text" data-id="input-{{text}}"> <label class="mdl-textfield__label" for="input-{{text}}"></label> </div>';  
function getButton(text){
  return button.replace(/{{buttonText}}/g,text);
} 
function getFabButton(text,icon){
  return fabButton.replace(/{{buttonText}}/g,text).replace(/{{micon}}/g,icon);
} 
function getInput(text){
  return input.replace(/{{text}}/g,text);
}
function getClient(client){
  return '<span class="mdl-chip"> <span class="mdl-chip__text">'+client+'</span> </span>' 
}
function getEmptyMessage(){
  return '<span class="mdl-chip"> <span class="mdl-chip__text">'+"Currently there are no connected devices."+'</span> </span>' 
}
  
function getTableRow(client,button1,button2,button3){
  //return '<tr id="'+client+'">'+
      // '<td class="mdl-data-table__cell--non-numeric"> '+getClient(client)+' </td>'+
      // '<td class="mdl-data-table__cell--non-numeric">'+getFabButton(button1,"lock")+'</td>'+
      // '<td class="mdl-data-table__cell--non-numeric">'+getFabButton(button2,"snooze")+'</td>'+
      // '<td class="mdl-data-table__cell--non-numeric">'+getInput(client)+'</td>'+
      // '<td class="mdl-data-table__cell--non-numeric">'+getFabButton(button3,"mic")+'</td>'+

    return '<div class="demo-card-wide mdl-card mdl-shadow--2dp" id="'+client+'">'+
 ' <div class="mdl-card__title">'+
   ' <h2 class="mdl-card__title-text">'+
  getClient(client)+ (typeof(webkitSpeechRecognition) !=="undefined" ?getInput(client):"")+
  '</h2>'+
 ' </div>'+
  '<div class="mdl-card__supporting-text">'+
    'The ip represents the unique id of the connected device.'+

 ' </div>'+
  '<div class="mdl-card__actions mdl-card--border">'+
    getFabButton(button1,"lock")+
    getFabButton(button2,"snooze")+
    (typeof(webkitSpeechRecognition) !=="undefined" ?getFabButton(button3,"mic"):"")+
  '</div>'+
  '<div class="mdl-card__menu">'+
    '<button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">'+
     ' <i class="material-icons">share</i>'+
    '</button>'+
  '</div>'+
'</div>'
       // '</tr>'
    ;
}
  
  function sendCommand(command,client){
    var url=actionURL+command;
    $.post(url,JSON.stringify({clientId:client}),function(resp){
      console.log(resp);
    },"application/json")
  }

  function rowClickHandler(e){
    console.log(this.id)
    console.log(e.target);
    var clickAttribute=e.target.getAttribute("data-click");
    if(clickAttribute){
      switch(clickAttribute){
        case "lock":
          sendCommand(clickAttribute,this.id);
          break;
        case "sleep":
          sendCommand(clickAttribute,this.id);
          break;
        case "speak":
          startRecognition(this.id,this);
          break;
      }
      
    }
  }
$.get('/clients', function(clients) {
    console.log(clients);
  if(clients.length===0){
     $("#clients").append($(getEmptyMessage()));
    return;
    
  }
    clients.forEach(function(client) {
     // console.log(getTableRow(client,"lock","sleep","speak"))
      $("#clients").append($(getTableRow(client.trim(),"lock","sleep","speak")))
      //now add Event listeners
      //console.log(client)
      document.getElementById(client).addEventListener("click",rowClickHandler);
      });
  });
  


});
