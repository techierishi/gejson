

(function(){
    var button = document.createElement("button")

    button.innerText = "This is the inserted button, click on me!"
    button['id'] = 'inserted'
    button['data-name'] = 'name1'
    button.classList.add("btn");
    button.classList.add("d-none");
    button.classList.add("d-md-inline-block");
    button.onclick = function() {
        alert('clicked!')
    }
    button.fun = function() {
        alert('fun!')
    }
    
    document.body.appendChild(button)
})()
