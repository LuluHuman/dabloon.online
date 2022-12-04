function createPannel(dta, objectID, completeType, type) {
    const aadsf = document.getElementById("list-of-trades-smirk-lmao")
    var styleColor
    var buttons = `<span>${completeType}`
    if (completeType == "Accepted") {
        styleColor = `style="background-color:#00aa0080 ;"`
    } else if (completeType == "Declined") {
        styleColor = `style="background-color:#ff000080 ;"`
    } else {
        if (type == "to") {
            buttons = `<div class="conf" id=${objectID}-actions>
                    <span class="small-text"><input type="checkbox" id="conf"> I know that i might not get my items
                        back</span>
                    <div>
                        <button class="conf-button" onclick="window.acceptTrade('${objectID}')">Accept</button>
                        <button class="conf-button" onclick="window.declineTrade('${objectID}')">Decline</button>
                    </div>
                </div>`
        } else {
            buttons = `
            <div class="conf" id=${objectID}-actions>
                <span class="small-text"><input type="checkbox" id="conf"> I know this action cannot reverse one</span>
                <div>
                    <button class="conf-button" onclick="window.cancelTrade('${objectID}')">Cancel</button>
                </div>
            </div>`
        }
    }
    aadsf.innerHTML += `
     <div class="a-trade-request-lmao" id="${objectID}" ${styleColor}>
                <div>
                    <img src="${dta.avatar_url}">
                    <a href="/profile/${dta.open_id}">${dta.display_name}</a>
                </div>
                <div>
                    <div class="items-pannel">
                        <span>User's Offer</span>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div class="currency">
                            <span>?</span>
                            <img src="/images/currency.png">
                        </div>
                    </div>
                    <div class="arrow-trade">
                        <span>You</span>
                        <span class="material-symbols-outlined">
                            sync_alt
                        </span>
                        <span>User</span>
                    </div>
                    <div class="items-pannel">
                        <span>User's Request</span>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div class="currency">
                            <span>?</span>
                            <img src="/images/currency.png">
                        </div>
                    </div>
                </div>
                ${buttons}
            </div>`
    return objectID
}



async function getTrades(type) {
    const aadsf = document.getElementById("list-of-trades-smirk-lmao")
    aadsf.innerHTML = ''
    const getTradesTo = await fetch("/api/trade?type=" + type).then((res) => res.json())
    console.log(getTradesTo);

    getTradesTo.forEach(async element => {
        console.log(element);

        const who = await fetch("/api/getprofile?open_id=" + element.from_open_id).then((res) => res.json())
        createPannel(who, element._id, element.completeType, type)

        const offer = JSON.parse(element.offer)
        const request = JSON.parse(element.request)

        const mainCont = document.getElementById(element._id).children[1]

        const offerElement = mainCont.children[0]
        offerElement.children[1].innerText = offer.item1
        offerElement.children[2].innerText = offer.item2
        offerElement.children[3].innerText = offer.item3
        offerElement.children[4].innerText = offer.item5
        offerElement.children[5].children[0].innerText = offer.dabloons
        const reqElement = mainCont.children[2]
        reqElement.children[1].innerText = request.item1
        reqElement.children[2].innerText = request.item2
        reqElement.children[3].innerText = request.item3
        reqElement.children[4].innerText = request.item5
        reqElement.children[5].children[0].innerText = request.dabloons


    });

}
getTrades("to")

const tradesSelect = document.getElementById("trades-select")
tradesSelect.onchange = () => {
    getTrades(tradesSelect.value == "Inbound" ? "to" : "from")
}

window.acceptTrade = async function (objectId) {
    const actions = document.getElementById(objectId + "-actions")
    if (!actions.children[0].children[0].checked) {
        actions.children[0].style.color = "red"
        return
    }

    const resultAfterTradeLmaoLmao = await fetch("/api/tradeaction?action=accept&objectId=" + objectId).then((res) => res.json())

    console.log(resultAfterTradeLmaoLmao);
    window.location.href = window.location.href +  " "
}

window.declineTrade = async function (objectId) {
    const actions = document.getElementById(objectId + "-actions")
    if (!actions.children[0].children[0].checked) {
        actions.children[0].style.color = "red"
        return
    }

    const resultAfterTradeLmaoLmao = await fetch("/api/tradeaction?action=declined&objectId=" + objectId).then((res) => res.json())

    console.log(resultAfterTradeLmaoLmao);
    window.location.href = window.location.href + " "
}

window.cencelTrade = async function (objectId) {

}