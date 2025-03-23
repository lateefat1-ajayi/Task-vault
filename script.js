const saveTask = document.getElementById("save-task")
const exportTask = document.getElementById("export-task")
const lightMode = document.getElementById("light-mode")
const textArea = document.getElementById("text-area")
const unordered = document.getElementById("unordered")



document.addEventListener("DOMContentLoaded", loadTask);
saveTask.addEventListener("click", function (){
    let  taskText = textArea.value.trim();

    if (taskText !== ""){
        const task = JSON.parse(localStorage.getItem("task")) || [];

        let newTask = {
            text : taskText,
            timestamp : new Date().toISOString(),
        };
        task.push(newTask);
        localStorage.setItem("task", JSON.stringify(task));
        displayTask();
        textArea.value = "";
    }

})

function loadTask(){
    displayTask();
}

function displayTask(){
    unordered.innerHTML = "";
    const task = JSON.parse(localStorage.getItem("task")) || [];
    task.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
    task.forEach(addTask);
}
function addTask(task) {
    let list = document.createElement("li");

    list.innerHTML = `
    <h4>${task.text}</h4> <br>
    <small> ${formatDate (task.timestamp)}</small>
    `;

    let dltBtn = document.createElement("button");
    dltBtn.innerHTML = "cancel";

    dltBtn.addEventListener("click", function (){
        deleteTask(task.text)
    })

    let checkBttn = document.createElement("button");
    checkBttn.innerHTML = "✔️";
    checkBttn.addEventListener("click", function (){
         list.style.textDecoration = "line-through"
    })
    
    list.appendChild(dltBtn);
    list.appendChild(checkBttn);

    unordered.appendChild(list);
}


function deleteTask(taskText) {
    let task = JSON.parse(localStorage.getItem("task")) || [];

    task = task.filter((task) => task.text !== taskText)
    localStorage.setItem("task", JSON.stringify(task));
    displayTask();
}

exportTask.addEventListener("click", function () {
    let task = JSON.parse(localStorage.getItem("task")) || [];

    let jsonStr = JSON.stringify(task, null, 2);
    let blob = new Blob([jsonStr], {type: "application/json"});

    let url = URL.createObjectURL(blob);

    let a = document.createElement("a")
    a.href = url;
    a.download = "task.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a)
    
})

lightMode.addEventListener("click", function(){
    document.body.classList.toggle("light-mode")
})

function formatDate(timestamp) {
    let date = new Date(timestamp);
    return date.toLocaleString();
}