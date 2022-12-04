//resizer

function checkWidth() {
    const cont = document.getElementById("cont").children
    const windowRatio = window.innerWidth / window.innerHeight
    if (windowRatio < 1.5) {
        const newsCont = document.getElementsByClassName("news-cont")
        for (const element of cont) {
            element.style.width = "90vw"
        }
        for (const element of newsCont) {
            element.style.flexDirection = "column-reverse"
        }
        return
    }


    const newsCont = document.getElementsByClassName("news-cont")
    for (const element of cont) {
        element.style.width = "40vw"
    }
    for (const element of newsCont) {
        element.style.flexDirection = "row"
    }
}

async function getNews(){
    const newsjson = await fetch("/_backend/news.json").then((data) => data.json())
    return newsjson
}

const cont = document.getElementById("cont")
getNews().then((news) => {
    news.forEach(newsJson => {
        const imreact = 
        `<div id="top-stories">
            <div class="news-cont">
                <div>
                    <strong class="title">${newsJson.title}</strong>
                    <a href="${newsJson.src}" class="src">Source</a>   
                </div>
                <img src="${newsJson.thumb}" alt="">
            </div>
            <span class="summ">${newsJson.summ}</span>
        </div>`
        cont.innerHTML += imreact
    });
    checkWidth()
    window.addEventListener("resize", checkWidth);

})
