

document.querySelectorAll(".gallery").forEach((ele, idx) => {
    ele.addEventListener('click', (event)=>{
        node = event.currentTarget
        console.log(node.getAttribute('target'))
        window.open(node.getAttribute('target'), '_blank')
        console.log(node.childNodes)
    })
});

fetch("https://api.github.com/repos/Sinotrade/Sinotrade.github.io/git/trees/master?recursive=1").then(res=> res.json()).then(json => {console.log(json["tree"])})