(async() => {
    const savedProfile = await fetch("/api/getprofile").then((response) => response.json())
    console.log(savedProfile);


    const dabloonsInt = document.getElementById("dabloonsInt")
    const itemso = JSON.parse(savedProfile.items)
    for (const name in itemso) {
            const quanint = itemso[name];


        const items = document.getElementById("items")
        const div = document.createElement("div"); items.append(div)
        const quan = document.createElement("input"); quan.type = "number"; quan.style.width = "40px"; quan.value = quanint; div.appendChild(quan)
        const selectChild = document.createElement("input"); selectChild.value = name; div.appendChild(selectChild)
        const remove = document.createElement("button"); remove.innerText = "-"; remove.onclick = () => { div.remove() }; div.appendChild(remove)
    }
    dabloonsInt.value = savedProfile.dabloons
})()

window.onItemList = () => {
    const items = document.getElementById("items")
    const div = document.createElement("div"); items.append(div)
    const quan = document.createElement("input"); quan.type = "number"; quan.style.width = "40px";quan.value = 1; div.appendChild(quan)
    const selectChild = document.createElement("input"); div.appendChild(selectChild)
    const remove = document.createElement("button") ; remove.innerText = "-"; remove.onclick = () => {div.remove()}; div.appendChild(remove)
}

window.save = async () => {
    if(document.getElementById("avatar").children[1].style.display == "none"){
        window.location.href = "/login"
        return
    }

    const dabloonsInt = document.getElementById("dabloonsInt")
    const items = document.getElementById("items").children 

    const itemsJson = {}
    for (const itemElement of items) {
        const quan = itemElement.children[0].value
        const item = itemElement.children[1].value
        
        itemsJson[item] = quan
    }
    const toSave = {
        "dabloons": dabloonsInt.value,
        "items": JSON.stringify(itemsJson)
    }

    const arg = { method: 'PUT', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify(toSave) }
    const post = await fetch('/api/updateprofile', arg).then((response) => response.json()).catch((error) => { console.error(error) })

    console.log('Success:', post)
}