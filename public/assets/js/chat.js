// Collapsible
var coll = document.getElementsByClassName("chat_collapsible");

for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.add("active");
        $("#chat-button").hide();

        var content = this.nextElementSibling;

        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }

    });
    $(".chat_content").mouseleave(function () {
        coll[i].classList.remove("active");
        $("#chat-button").slideDown();

        var content = coll[i].nextElementSibling;
    
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
}

function getTime() {
    let today = new Date();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var weekday = today.getDay() + 1;

    if (hours < 10) {
        hours = "0" + hours;
    }

    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    if (weekday == "1") {
        weekday = "CN";
    } else {
        weekday = "T" + weekday;
    }

    let time = weekday + " " + hours + ":" + minutes;
    return time;
}

// Gets the first message
function firstBotMessage() {
    let firstMessage = "Bạn có thắc mắc gì không?"
    document.getElementById("botStarterMessage").innerHTML = '<p class="botText"><span>' + firstMessage + '</span></p>';

    let time = getTime();
    $("#chat-timestamp").append(time);
    
    document.getElementById("userInput").scrollIntoView(false);
}

firstBotMessage();

// Retrieves the response
function getHardResponse(userText) {
    let botResponse = getBotResponse(userText);
    let botHtml = '<p class="botText"><span>' + botResponse + '</span></p>';
    $("#chatbox").append(botHtml);

    document.getElementById("chat-bar-bottom").scrollIntoView(true);
}

//Gets the text text from the input box and processes it
function getResponse() {
    // giờ khi chat
    // let time = getTime();
    // let botHtml = '<h5 id="chat-timestamp">' + time + '</h5>';
    // $("#chatbox").append(botHtml);
    

    let userText = $("#textInput").val();

    if (userText == "") {
        userText = "Bạn đã gửi tin trống!";
    }

    let userHtml = '<p class="userText"><span>' + userText + '</span></p>';

    $("#textInput").val("");
    $("#chatbox").append(userHtml);
    document.getElementById("chat-bar-bottom").scrollIntoView(true);

    setTimeout(() => {
        getHardResponse(userText);
    }, 1000)

}

// Handles sending text via button clicks
function buttonSendText(sampleText) {
    let userHtml = '<p class="userText"><span>' + sampleText + '</span></p>';

    $("#textInput").val("");
    $("#chatbox").append(userHtml);
    document.getElementById("chat-bar-bottom").scrollIntoView(true);

    //Uncomment this if you want the bot to respond to this buttonSendText event
    // setTimeout(() => {
    //     getHardResponse(sampleText);
    // }, 1000)
}

function sendButton() {
    getResponse();
}

function heartButton() {
    buttonSendText("<i id='chat-icon' style='color: crimson;'' class='fa fa-fw fa-heart'></i>")
}

// Press enter to send a message
$("#textInput").keypress(function (e) {
    if (e.which == 13) {
        getResponse();
    }
});