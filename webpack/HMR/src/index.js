let inputEl = document.createElement("input");
document.body.appendChild(inputEl);

let divEl = document.createElement("div")
document.body.appendChild(divEl);

let pEl = document.createElement("div")
document.body.appendChild(pEl);

let render = () => {
    let content = require("./content").default;
    divEl.innerText = content;

    pEl.innerText = require("./content2").default;
}
render();

if (module.hot) {
    module.hot.accept(["./content.js"], render);
}