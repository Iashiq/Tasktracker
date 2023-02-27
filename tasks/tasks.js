class Task {

    constructor(name, state) {
      this.name = name;
      this.state = state;
    }

  }
  
  var states=["active", "inactive", "done"];
  var tabs = ["all"].concat(states);
  var currentTab= "all";
  
  var form = document.getElementById("new-task-form");
  var input = document.getElementById("new-task-title");
  var taskList = document.getElementById("task-list");
  var tasks = JSON.parse(localStorage.getItem("tasks"));
  if (tasks === null) {
   tasks = [];
  }
  form.onsubmit = function(event) {
    event.preventDefault();
    if (input.value && input.value.length) {
      tasks.push(new Task(input.value, "active"));
      input.value = "";
      renderTasks();
  
      }
  };
  
  var buttons = [
    {action: "done", icon: "ok"},
    {action: "active", icon: "plus"},
    {action: "inactive", icon: "minus"},
    {action: "more important", icon: "chevron-up"},
    {action: "less important", icon: "chevron-down"},
    {action: "remove", icon: "trash"}
  ];
  
  const taskFilter = function (task){
    return task.state === currentTab || currentTab === "all";
  }
  
  const taskRender = function(task){
  
    var div1 = document.createElement("div");
    div1.className = "row";
  
    var div2 = document.createElement("div");
    div2.innerHTML =
      '<a class="list-group-item" href="#">' + task.name + "</a>";
    div2.className = "col-xs-6 col-sm-9 col-md-10";
  
    var div3 = document.createElement("div");
    div3.className = "col-xs-6 col-sm-3 col-md-2 btn-group text-right";
    buttons.forEach(function(button) {
      var btn = document.createElement("button");
      btn.className = "btn btn-default btn-xs";
      btn.innerHTML =
        '<i class="glyphicon glyphicon-' + button.icon + '"></i>';
      div3.appendChild(btn);
  
      if (button.action === task.state) {
        btn.disabled = true;
      }
  
      if (button.action === "remove") {
        btn.title = "Remove";
        btn.onclick = function() {
          if (
            confirm(
              "Are you sure you want to delete the item titled " + task.name
            )
          ) {
  
            tasks.splice(tasks.indexOf(task), 1);
            renderTasks();
          }
        };
      } 
      
      else {
        btn.title = "Mark as" + button.action;
            btn.onclick = function() {
                var index = tasks.indexOf(task);
                if(button.action == "more important" && index>0){
                    swap(index, index-1);
                } else if (button.action == "less important" && index < tasks.length-1)
                {
                    swap(index, index+1);
                }
                else{
                    task.state = button.action;
                }
                renderTasks();
        };
      }
    });  
    div1.appendChild(div2);
    div1.appendChild(div3);
  
    taskList.appendChild(div1);
  
    localStorage.setItem("tasks",JSON.stringify(tasks));
    
  };
  
  
  function renderTasks(){
    taskList.innerHTML = "";
    countTabItems();
    tasks
      .filter(taskFilter)
      .forEach(taskRender);
      
    localStorage.setItem("tasks",JSON.stringify(tasks));
  
  }
  renderTasks();
  
  function countTabItems(){
    document.querySelector(".task-tab[data-tab-name='all'] .badge").innerHTML = tasks.length || "";
      
    for (let state of states)
        document.querySelector(".task-tab[data-tab-name='" + state + "'] .badge")
        .innerHTML = tasks.filter(function (t){ return t.state === state; }).length || "";
  }
  
 
  function swap(index1, index2) {
     var forward = tasks[index1];
	   var backward = tasks[index2];

	   tasks[index2] = forward;
	   tasks[index1] = backward;
   
  }
  
  
  function selectTab(element) {
    var tabName = element.attributes["data-tab-name"].value;
    currentTab = tabName;
    var taskTabs = document.getElementsByClassName("task-tab");
    for (var i = 0; i < taskTabs.length; i++) {
      taskTabs[i].classList.remove("active");
    }
    element.classList.add("active");
    renderTasks();
  }
  