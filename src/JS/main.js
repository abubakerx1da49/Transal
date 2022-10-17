let { ipcRenderer, shell, BrowserWindow, screen } = require('electron');

let msgs = document.querySelector("#msgs")

let fromText = document.querySelector("#ta1")
let toText = document.querySelector("#ta2")
selectTag = document.querySelectorAll("select")

selectTag.forEach((tag, id) => {
    for (let country_code in countries) {
        let selected = id == 0 ? country_code == "en-GB" ? "selected" : "" : country_code == "ta-LK" ? "selected" : "";
        let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
});

let text, translateFrom, translateTo;

let translate = () => {
    text = fromText.value.trim();
    translateFrom = selectTag[0].value;
    translateTo = selectTag[1].value;
    // if (!text) return;
    toText.setAttribute("placeholder", "Translating...");
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    fetch(apiUrl).then(res => res.json()).then(data => {
        if (data.responseData.translatedText == "NO QUERY SPECIFIED. EXAMPLE REQUEST: GET?Q=HELLO&LANGPAIR=EN|IT") {
            toText.setAttribute("placeholder", "Translation");
            toText.value = 'Translation'
        } else {
            toText.value = data.responseData.translatedText;
        }
        // data.matches.forEach(data => {
        //     if (data.id === 0) {
        //         toText.value = data.translation;
        //     }
        // });
        toText.setAttribute("placeholder", "Translation");
    });
}

fromText.addEventListener("input", () => {
    translate()
});

document.getElementById("s1").addEventListener("change", () => {
    translate()
})

document.getElementById("s2").addEventListener("change", () => {
    translate()
})


setInterval(() => {
    if (fromText.value == "") {
        document.getElementById("copy_from").disabled = true
        document.getElementById("copy_to").disabled = true
        document.getElementById("mail_from").disabled = true
        document.getElementById("mail_to").disabled = true
    } else {
        document.getElementById("copy_from").disabled = false
        document.getElementById("copy_to").disabled = false
        document.getElementById("mail_from").disabled = false
        document.getElementById("mail_to").disabled = false
    }

}, 500);

// Copy Values
document.getElementById("copy_from").addEventListener("click", () => {

    // fromText.select();
    fromText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(fromText.value);

    msgs.innerHTML = "Copied !"
    setTimeout(() => {
        msgs.innerHTML = ""
    }, 1000);

})

document.getElementById("copy_to").addEventListener("click", () => {

    // fromText.select();
    toText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(toText.value);

    msgs.innerHTML = "Copied !"
    setTimeout(() => {
        msgs.innerHTML = ""
    }, 1000);

})

// Handling Mail Functions
document.getElementById("mail_from").addEventListener("click", () => {

    shell.openExternal(`mailto:?body=${fromText.value}`)

    msgs.innerHTML = "Mailing..."
    setTimeout(() => {
        msgs.innerHTML = ""
    }, 1000);
})
document.getElementById("mail_to").addEventListener("click", () => {

    shell.openExternal(`mailto:?body=${toText.value}`)

    msgs.innerHTML = "Mailing..."
    setTimeout(() => {
        msgs.innerHTML = ""
    }, 1000);
})


// icons.forEach(icon => {
//     icon.addEventListener("click", ({target}) => {
//         if(!fromText.value || !toText.value) return;
//         if(target.classList.contains("fa-copy")) {
//             if(target.id == "from") {
//                 navigator.clipboard.writeText(fromText.value);
//             } else {
//                 navigator.clipboard.writeText(toText.value);
//             }
//         } else {
//             let utterance;
//             if(target.id == "from") {
//                 utterance = new SpeechSynthesisUtterance(fromText.value);
//                 utterance.lang = selectTag[0].value;
//             } else {
//                 utterance = new SpeechSynthesisUtterance(toText.value);
//                 utterance.lang = selectTag[1].value;
//             }
//             speechSynthesis.speak(utterance);
//         }
//     });
// });

// Title Bar JS
document.getElementById("quit-button").addEventListener("click", () => {
    ipcRenderer.send('quit-app')
})

document.getElementById("minimize-button").addEventListener("click", () => {
    ipcRenderer.send('minimize-app')
})