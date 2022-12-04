(async () => {
    const path = window.location.pathname
    const open_id = path.split("/")[2]
    const url = open_id ? "/api/getprofile?open_id=" + open_id : "/api/getprofile"
    var data = await fetch(url)

    const mainProfile = document.getElementById("mainprofile")

    if (data.status == 400) return window.location.href = "/login"
    if (data.status == 404) return mainProfile.parentElement.innerHTML = "The profile you are looking for is not avalable or not in our database"
    data = await data.json()

    const itemso = JSON.parse(data.items)
    for (const name in itemso) {
        const quanint = itemso[name];

        const itemsOl = document.getElementById("items-ol")
        const li = document.createElement("li")
        const strong = document.createElement("strong")
        const span = document.createElement("span")

        strong.innerText = name
        span.innerText = " --x" + quanint

        itemsOl.appendChild(li)
        li.appendChild(strong)
        li.appendChild(span)
    }

    mainProfile.children[0].children[0].src = data.avatar_url
    mainProfile.children[1].children[0].children[0].innerText = data["display_name"]
    mainProfile.children[1].children[1].children[0].innerText = data["following_count"]
    mainProfile.children[1].children[1].children[2].innerText = data["follower_count"]
    mainProfile.children[1].children[1].children[4].innerText = data["likes_count"]
    mainProfile.children[1].children[3].children[0].href = data["profile_deep_link"]
    mainProfile.children[1].children[4].children[0].innerText = data["bio_description"]
    mainProfile.children[1].children[5].onclick = async () => {
        this.button = mainProfile.children[1].children[5]
        const loadingDiv = `
<div class="loader">
  <svg class="circular">
    <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
  </svg>
</div>
`
        this.button.innerHTML = loadingDiv
        if (this.button.attributes.task.value == "copy") {
            navigator.clipboard.writeText("https://dabloon.online/profile/" + data.open_id);
            this.button.innerHTML = "Copied!"

            setTimeout(() => {
                this.button.innerHTML = "Copy Profile Link"
            }, 500);
        }
        if (this.button.attributes.task.value == "trade") {
            const avatarImage = document.querySelector("#avatar > img")
            if (avatarImage.style.display == "none") return window.location.href = "/login"

            this.button.setAttribute("task", "")

            const tradeMenu = document.getElementById("tradeMenu").children[1]
            var dataU = await fetch("/api/getprofile")
            dataU = await dataU.json()
            const itemsYou = await JSON.parse(dataU.items)

            tradeMenu.parentElement.style.display = "flex"

            tradeMenu.children[0].innerText = `Trade with ${data["display_name"]}`
            tradeMenu.children[2].children[0].children[0].innerText = `${data["display_name"]}'s Items`
            for (const name in itemsYou) {
                const quanint = itemsYou[name];

                const itemsOl = tradeMenu.children[1].children[0].children[1]
                const li = document.createElement("li")
                const strong = document.createElement("strong")
                const span = document.createElement("span")

                li.style.cursor = "pointer"
                li.onclick = () => {
                    const itemsOffer = tradeMenu.children[1].children[1].children[1]
                    if (!itemsOffer.children[3].innerText == "") return itemsOffer.children[5].innerText = "Max Items 4"
                    if (Number(span.innerText.replace(" --x", "")) > 1) {
                        const subtract = Number(span.innerText.replace(" --x", "")) - 1
                        span.innerText = " --x" + subtract
                    } else {
                        const subtract = Number(span.innerText.replace(" --x", "")) - 1
                        span.innerText = " --x" + subtract
                        li.style.display = "none"
                    }

                    var state = 0
                    function loop() {
                        if (!itemsOffer.children[state].innerText == "") {
                            state++
                            loop()
                        } else {
                            itemsOffer.children[state].innerText = name
                            itemsOffer.children[state].onclick = () => {
                                itemsOffer.children[state].innerText = ""
                                li.style.display = "list-item"
                                const add = Number(span.innerText.replace(" --x", "")) + 1
                                span.innerText = " --x" + add
                            }
                        }
                    }
                    loop()
                }

                strong.innerText = name
                span.innerText = " --x" + quanint

                itemsOl.appendChild(li)
                li.appendChild(strong)
                li.appendChild(span)
            }
            for (const name in itemso) {
                const quanint = itemso[name];

                const itemsOl = tradeMenu.children[2].children[0].children[1]
                const li = document.createElement("li")
                const strong = document.createElement("strong")
                const span = document.createElement("span")

                li.onclick = () => {
                    const itemsOffer = tradeMenu.children[2].children[1].children[1]
                    if (!itemsOffer.children[3].innerText == "") return itemsOffer.children[5].innerText = "Max Items 4"
                    if (Number(span.innerText.replace(" --x", "")) > 1) {
                        const subtract = Number(span.innerText.replace(" --x", "")) - 1
                        span.innerText = " --x" + subtract
                    } else {
                        li.style.display = "none"
                    }
                    var state = 0
                    function loop() {
                        if (!itemsOffer.children[state].innerText == "") {
                            state++
                            loop()
                        } else {
                            itemsOffer.children[state].innerText = name
                            itemsOffer.children[state].onclick = () => {
                                itemsOffer.children[state].innerText = ""
                                li.style.display = "list-item"
                                const add = Number(span.innerText.replace(" --x", "")) + 1
                                span.innerText = " --x" + add
                            }
                        }
                    }
                    loop()
                }

                strong.innerText = name
                span.innerText = " --x" + quanint

                itemsOl.appendChild(li)
                li.appendChild(strong)
                li.appendChild(span)
            }
        }
    }


    var toShow = data.dabloons
    if (data.dabloons > 1000) { toShow = data.dabloons / 1000; toShow = Math.round((toShow + Number.EPSILON) * 100) / 100; toShow += "K" }
    if (data.dabloons > 1000000) { toShow = data.dabloons / 1000000; toShow = Math.round((toShow + Number.EPSILON) * 100) / 100; toShow += " M" }
    if (data.dabloons > 1000000000) { toShow = data.dabloons / 1000000000; toShow = Math.round((toShow + Number.EPSILON) * 100) / 100; toShow += " B" }
    if (data.dabloons > 1000000000000) { toShow = (data.dabloons / 1000000000000); toShow = Math.round((toShow + Number.EPSILON) * 100) / 100; toShow += " T" }
    mainProfile.children[1].children[2].children[0].innerText = toShow


    var c = document.getElementById("card");
    var ctx = c.getContext('2d');
    var img = new Image;
    img.onload = function () {
        ctx.drawImage(img, 0, 0);
        ctx.font = '25px Calibri';
        ctx.fillStyle = 'white';
        ctx.fillText(data["display_name"], 45, 260);


        ctx.font = '25px Calibri';
        ctx.fillStyle = 'white';
        ctx.fillText(toShow, 210, 100);
    };
    img.src = 'https://dabloon.online/images/card.png'


    const btn = document.getElementById('share');
    btn.addEventListener('click', async () => {
        const dataUrl = c.toDataURL();
        const blob = await (await fetch(dataUrl)).blob();
        const filesArray = [
            new File(
                [blob],
                'card.png',
                {
                    type: blob.type,
                    lastModified: new Date().getTime()
                }
            )
        ];

        const shareData = {
            files: filesArray,
            title: 'Dabloon Balance',
            text: 'Heres my Dabloon ballance. Check yours today https://dabloon.online'
        }
        navigator.share(shareData)
    });
})()

function checkWidth() {
    const mainBody = document.getElementById("mainprofile").parentElement
    const mainprofile = document.getElementById("mainprofile")
    const tradeMenu = document.querySelector("#tradeMenu > div")

    const windowRatio = window.innerWidth / window.innerHeight

    if (windowRatio < 1.5) {
        if (tradeMenu) {
            tradeMenu.parentElement.style.flexDirection = "column"
            tradeMenu.children[1].style.flexDirection = "column"
            tradeMenu.children[2].style.flexDirection = "column"
            tradeMenu.children[1].style.margin = "5vh 0px"
            tradeMenu.children[2].style.margin = "5vh 0px"
            tradeMenu.children[1].style.borderBottom = '1px black solid'
            tradeMenu.children[2].style.borderBottom = '1px black solid'

            tradeMenu.children[1].children[0].style.width = "100%"
            tradeMenu.children[1].children[1].style.width = "100%"
            tradeMenu.children[2].children[0].style.width = "100%"
            tradeMenu.children[2].children[1].style.width = "100%"

            tradeMenu.children[1].children[0].style.border = "black dotted"
            tradeMenu.children[1].children[1].style.border = "black dotted"
            tradeMenu.children[2].children[0].style.border = "black dotted"
            tradeMenu.children[2].children[1].style.border = "black dotted"


            tradeMenu.children[1].children[0].style.padding = "10px"
            tradeMenu.children[1].children[1].style.padding = "10px"
            tradeMenu.children[2].children[0].style.padding = "10px"
            tradeMenu.children[2].children[1].style.padding = "10px"
        }

        mainBody.style.width = "90vw"
        mainprofile.style.flexDirection = "column"
        mainprofile.style.alignItems = "center"
        mainprofile.children[0].children[0].style.width = "30vw"
        return
    }

    if (tradeMenu) {
        tradeMenu.parentElement.style.flexDirection = "row"
        tradeMenu.children[1].style.flexDirection = "row"
        tradeMenu.children[2].style.flexDirection = "row"
        tradeMenu.children[1].style.margin = "0px"
        tradeMenu.children[2].style.margin = "0px"
        tradeMenu.children[1].style.borderBottom = 'none'
        tradeMenu.children[2].style.borderBottom = 'none'

        tradeMenu.children[1].children[0].style.width = "20vw"
        tradeMenu.children[1].children[1].style.width = "20vw"
        tradeMenu.children[2].children[0].style.width = "20vw"
        tradeMenu.children[2].children[1].style.width = "20vw"

        tradeMenu.children[1].children[0].style.border = "none"
        tradeMenu.children[1].children[1].style.border = "none"
        tradeMenu.children[2].children[0].style.border = "none"
        tradeMenu.children[2].children[1].style.border = "none"


        tradeMenu.children[1].children[0].style.padding = "0"
        tradeMenu.children[1].children[1].style.padding = "0"
        tradeMenu.children[2].children[0].style.padding = "0"
        tradeMenu.children[2].children[1].style.padding = "0"

        tradeMenu.style.width = "unset"
    }
    mainBody.style.width = "50vw"
    mainprofile.style.flexDirection = "row"
    mainprofile.style.alignItems = "normal"
    mainprofile.children[0].children[0].style.width = "10vw"
}

window.createoffer = async function () {
    const conf = document.getElementById("conf")
    if (conf.checked == false) return
    const path = window.location.pathname
    const open_id = path.split("/")[2]

    var toSend = {}
    const tradeMenu = document.getElementById("tradeMenu").children[1]
    const offer = tradeMenu.children[1].children[1].children[1]
    const req = tradeMenu.children[2].children[1].children[1]
    if (
        Number(offer.children[4].value) == "" &&
        Number(req.children[4].value) == "" &&
        offer.children[0].innerText == "" &&
        offer.children[1].innerText == "" &&
        offer.children[2].innerText == "" &&
        offer.children[3].innerText == "" &&
        req.children[0].innerText == "" &&
        req.children[1].innerText == "" &&
        req.children[2].innerText == "" &&
        req.children[3].innerText == ""
    ) {
        tradeMenu.children[2].children[1].children[1].children[5].innerText = "Why trading your dad suddenly add something"
    }

    toSend = {
        "to_open_id": open_id,
        "from_open_id": "Rendered in server",
        "offer": {
            "dabloons": Number(offer.children[4].value),
            "item1": offer.children[0].innerText,
            "item2": offer.children[1].innerText,
            "item3": offer.children[2].innerText,
            "item5": offer.children[3].innerText,
        },
        "request": {
            "dabloons": Number(req.children[4].value),
            "item1": req.children[0].innerText,
            "item2": req.children[1].innerText,
            "item3": req.children[2].innerText,
            "item5": req.children[3].innerText,
        },
    }

    const arg = { method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify(toSend) }
    const post = await fetch('/api/trade', arg).then((response) => response.json()).catch((error) => { console.error(error) })

    window.close()
    if (post) {
        const toast = document.getElementById("toast")
        toast.style.top = "0"
        setTimeout(() => {
            toast.style.top = "-10vh"
        }, 2000);
    }
}

window.close = function () {
    const tradeMenu = document.getElementById("tradeMenu").children[1]
    const offer = tradeMenu.children[1].children[1].children[1]
    const req = tradeMenu.children[2].children[1].children[1]
    offer.children[4].value = ""
    offer.children[0].innerText = ""
    offer.children[1].innerText = ""
    offer.children[2].innerText = ""
    offer.children[3].innerText = ""
    req.children[4].value = ""
    req.children[0].innerText = ""
    req.children[1].innerText = ""
    req.children[2].innerText = ""
    req.children[3].innerText = ""
    tradeMenu.children[1].children[0].children[1].innerHTML = ""
    tradeMenu.children[2].children[0].children[1].innerHTML = ""
    tradeMenu.parentElement.style.display = "none"
    document.getElementById("mainprofile").children[1].children[5].innerHTML = "Trade"
    document.getElementById("mainprofile").children[1].children[5].setAttribute("task", "trade")
}


window.addEventListener("load", checkWidth)
window.addEventListener("resize", checkWidth);