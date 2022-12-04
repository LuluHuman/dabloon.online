
(async () => {
    const frags = document.getElementsByTagName("frag")
    for (const itemi in frags) {
        const item = frags[itemi]
        if (!item.attributes) continue
        const url = item.attributes.fragurl.value
        const data = await fetch(url).then((response) => response.text())
        item.innerHTML = data
        console.log(url + ".. Get Finished");
    }
})().then(() => {
    const frags = document.getElementsByTagName("frag")
    const fscript = frags[0].getElementsByTagName("script")
    for (const itemi in fscript) {   
        const item = fscript[itemi]
        const js = item.innerHTML
        if(!js) continue
        eval(js);
    }

})
