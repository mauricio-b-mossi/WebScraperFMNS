async function scroller(){
    console.log("Started")
    let scroll = 0;
    do{
        scroll = window.scrollY;
        window.scrollBy(0, window.innerHeight)
        await new Promise((res, rej) => {
            setTimeout(res, 1000)
        })
    } while(window.scrollY > scroll)
    console.log("Finsihed")
}

module.exports = scroller;
