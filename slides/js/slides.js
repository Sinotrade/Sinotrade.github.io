

fetch("https://api.github.com/repos/Sinotrade/Sinotrade.github.io/git/trees/master?recursive=1").then(res=> res.json()).then(json => {console.log(json["tree"])})