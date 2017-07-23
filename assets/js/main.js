
// window.addEventListener('load', initialize);


/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
////////// Hello, I apologise for the messiness of the code, I had to make sure everything works
////////// and I didn't really have time for optimizations /////////////////////////////////////
//// SIDENOTE: Only used vanilla js, no jquery /////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
// initialize the app
var project = new Project();
var mainUser = new User("admin"); // the user that uses the app
var user1 = new User("teammate1"); // the rest of the teammates
var user2 = new User("teammate2");
var user3 = new User("teammate3");
var users = [];
var issues = [];
var allComments = [];
users.push(user1,user2,user3);
console.log("number of users (3): ", users.length, "| and admin: ", mainUser.name);

var sprint1 = new Sprint("initialSprint");
project.sprints.push(sprint1.id);
console.log("number of sprints initially: ", project.sprints.length);

console.log(project.id, users.length);

var issue1 = new Issue("Bug", "bugIssue1", sprint1.id, mainUser.id, user2.id, "some description for a bug", []);
var issue2 = new Issue("Bug", "bugIssue2", sprint1.id, mainUser.id, user1.id, "some description for a bug", []);
var issue3 = new Issue("Feature", "featureIssue1", sprint1.id, mainUser.id, user3.id, "some description for a feature", []);
var issue4 = new Issue("Task", "taskIssue1", sprint1.id, mainUser.id, user3.id, "some description for a task", []);
var issue5 = new Issue("Task", "taskIssue2", sprint1.id, mainUser.id, user2.id, "some description for a task", []);

issue1.status = statuss[1].id;
issue2.status = statuss[2].id;
issue3.status = statuss[3].id;
issue4.status = statuss[3].id;
issues.push(issue1, issue2, issue3, issue4, issue5);
console.log(issue1, issue2, issue3, issue4, issue5);
var currentIssueId;
showProjectOverview(); // call this when the page loads
///////////////////////////////////////////////////////////////////


//////////////////////////// event handler to show overview ////////////////////////
var overview = document.getElementById('overview').addEventListener("click", showProjectOverview);

///////////////////////// PROJECT OVERVIEW ////////////////////////
function showProjectOverview() {
  /*
  broken down per sprints, how many issues in each status, how many features, how many bugs, etc.
  */
  document.getElementById("add-issue").style.display = "none";
  document.getElementById("create-sprint").style.display = "none";
  var mainContainer = document.getElementsByClassName("main")[0];
  var projOverview = document.getElementById("proj-overview");
  projOverview.style.opacity = "0.9";
  projOverview.innerHTML = "Current project #" + project.id + " with " + project.sprints.length + " sprint(s)";

  // first clean up the main DIV
  var flexContainer = document.getElementsByClassName("flex-container")[0];
  var flexContainerStatus = document.getElementsByClassName("flex-container-status")[0];
  console.log(flexContainer, projOverview, flexContainerStatus);
  if (flexContainerStatus !== undefined) {
      flexContainerStatus.innerHTML = "";
  }
  if (flexContainer === undefined) {
    flexContainer = document.createElement('div');
    flexContainer.className = "flex-container";

    mainContainer.appendChild(projOverview);
    mainContainer.appendChild(flexContainer);
  }
  flexContainer.style.opacity = "0.9";
  flexContainer.innerHTML = "";

  for (let i = 0; i < project.sprints.length; i++) {
      var sprintDiv = document.createElement('div');
      sprintDiv.id = project.sprints[i];
      sprintDiv.className = "flex-item";
      sprintDiv.innerHTML = "<h3>Sprint #" + project.sprints[i] + "</h3>" + "<hr>";
      flexContainer.appendChild(sprintDiv);

      // total number of issues per sprint
      var issuesPerSprint = issues.filter(issue => issue.sprint === project.sprints[i]);
      console.log("issues per sprint: ", issuesPerSprint);
      sprintDiv.innerHTML += "<p>There are currently " + issuesPerSprint.length + " issues on this sprint, from which: </p>";

      // // issues in each status
      var issuesPerStatus = statuss.map(stat => countStatus(issuesPerSprint, stat.id));
      console.log("issues per status: ", issuesPerStatus);

      var div = document.createElement('div');
      div.className = "sprint-elem";

      issuesPerStatus.forEach(elem => {
        div.innerHTML += "<p>" + elem.count + " " + elem.status + "</p>";
      });
      sprintDiv.appendChild(div);

      // features, bugs, tasks
      var div2 = document.createElement('div');
      div2.className = "sprint-elem";
      var x = issueTypes.map(type => countType(issuesPerSprint, type));
      console.log("x: ", x);
      x.forEach(elem => {
        let str = elem.type.charAt(0).toLowerCase() + elem.type.slice(1);
        div2.innerHTML += "<p class='issue-types " + str + "'>" + elem.count + " " + elem.type + "</p>";
      });
      sprintDiv.appendChild(div2);
  }
}

////////////////////////////////////////////////////////////////////
////// event handler when clicking on GO TO SPRINT menu item ///////
///////////////////////////////////////////////////////////////////
var goToSprint = document.getElementById("goToSprintMenu");
goToSprint.addEventListener("click", function(){
    goToSprint.innerHTML = "go to sprint ▼";
    for (let i = 0; i < project.sprints.length; i++) {
      var li = document.createElement('li');
      var anchor = document.createElement('a');
      anchor.id = "menuitem" + project.sprints[i];
      anchor.className = "submenu";
      anchor.innerHTML = project.sprints[i];
      li.appendChild(anchor);

      goToSprint.appendChild(li);
    }
    var submenuElems = document.getElementsByClassName("submenu");
    Array.prototype.map.call(submenuElems, (elem) => {
      elem.style.display = "block";
    });

    goToSprint.addEventListener("click", callSprint, false);
});

//////////////////// handler func for clicking on a sprint menu item
function callSprint(e) {
  e.preventDefault();
  console.log(e.target, e.target.id);
  if (e.target.id !== "goToSprintMenu") {
    showIssuesForSprint(e.target.id);
  }
}

///////////// mouseleave event handler //////////////////////
goToSprint.addEventListener("mouseleave", function() {
  goToSprint.innerHTML = "go to sprint ►";
});

///////////////////////////////////////////////////////////////////////////
//////// event handler when clicking on filter by status menu item /////////
var showStatus = document.getElementById("filterByStatus");
showStatus.addEventListener("click", function(){
    showStatus.innerHTML = "filter by status ▼";
    for (let i = 0; i < statuss.length; i++) {
      var li = document.createElement('li');
      var anchor = document.createElement('a');
      anchor.id = "menuitem" + statuss[i].id;
      anchor.className = "submenu";
      anchor.innerHTML = statuss[i].name;
      li.appendChild(anchor);

      showStatus.appendChild(li);
    }
    var submenuElems = document.getElementsByClassName("submenu");
    Array.prototype.map.call(submenuElems, (elem) => {
      elem.style.display = "block";
    });

    showStatus.addEventListener("click", callFilter, false);
});

///////////// handler for the click event on filter by status menu items //////
function callFilter(e) {
  e.preventDefault();
  if (e.target.id !== "filterByStatus") { // make sure the submenu item is clicked
    filterByStatusFunc(e.target.id);
  }
}

///////// shows the issues from the given status, along with their details ////////
function filterByStatusFunc(status) {
  document.getElementById("add-issue").style.display = "none";
  document.getElementById("create-sprint").style.display = "none";
  var projOverview = document.getElementById("proj-overview");
  projOverview.style.opacity = "0.9";
  var onlyId = status.replace('menuitem', ''); // must make sure to get the exact id
  console.log("STATUS!!!", onlyId);
  var issuesForStatus = issues.filter(issue => issue.status == onlyId);
  var findStatusName = statuss.find(el => el.id == onlyId);
  console.log(findStatusName);
  projOverview.innerHTML = "There are currently " + issuesForStatus.length + " issues for status #" + onlyId + " " + findStatusName.name;
  var flexContainerStatus = document.getElementsByClassName("flex-container-status")[0];
  document.getElementsByClassName("flex-container")[0].innerHTML = "";
  // make sure the containers exist, and if not, create them
  if (flexContainerStatus === undefined) {
    var container = document.createElement('div');
    container.className = "flex-container-status";
    document.getElementsByClassName("main")[0].appendChild(container);
  }
  else {
    var container = flexContainerStatus;
    container.style.opacity = "0.9";
    container.innerHTML = "";
  }
  // then for each issue, create a DIV and show some info
  for (let i = 0; i < issuesForStatus.length; i++) {
    var div = document.createElement("div");
    let str = issuesForStatus[i].type.charAt(0).toLowerCase() + issuesForStatus[i].type.slice(1);
    div.className = "flex-item-sprint issue-types " + str;
    div.innerHTML = "<h3>#" + issuesForStatus[i].id + " with name: <strong>" + issuesForStatus[i].name + "</strong> part of sprint #" + issuesForStatus[i].sprint + " -- created by: #" + issuesForStatus[i].createdBy + "</h3><br><hr>";
    div.innerHTML += "<br><span>Details: " + issuesForStatus[i].description + "</span><br>";
    div.innerHTML += "<br><h3>Must be resolved by: #" + issuesForStatus[i].assignee + "</h3>";
    if (issuesForStatus[i].tasks.length > 0) {
      div.innerHTML += "<br><h3>Current subtasks: </h3>";
      issuesForStatus[i].tasks.forEach(el => div.innerHTML += "<br><p>#" + el + "</p>");
    }
    container.appendChild(div);
  }
}

///// mouseleave event for filter by status ////////////
showStatus.addEventListener("mouseleave", function() {
  showStatus.innerHTML = "filter by status ►";
});


///////////////////////////////////////////////////////////////////////////
/// basically filter by sprint, shows all the issues from a sprint with ///
/// all the details (allows update, adding subtasks, changing sprint) ///
function showIssuesForSprint(sprintId) {
  document.getElementById("add-issue").style.display = "none";
  document.getElementById("create-sprint").style.display = "none";
  var projOverview = document.getElementById("proj-overview");
  projOverview.style.opacity = "0.9";
  var onlyId = sprintId.replace('menuitem', '');
  var issuesForSprint = issues.filter(issue => issue.sprint === onlyId);
  projOverview.innerHTML = "Current sprint #" + onlyId + " with a total of " + issuesForSprint.length + " issues";
  var flexContainerStatus = document.getElementsByClassName("flex-container-status")[0];
  document.getElementsByClassName("flex-container")[0].innerHTML = "";
  if (flexContainerStatus === undefined) { // again, if container doesn't exist, must create
    var container = document.createElement('div');
    container.className = "flex-container-status";
    document.getElementsByClassName("main")[0].appendChild(container);
  }
  else {
    var container = flexContainerStatus;
    container.style.opacity = "0.9";
    container.innerHTML = "";
  }
  // for each status, create a DIV that contains all the corresponding issues and their info
    for (let i = 0; i < statuss.length; i++) {
      var div = document.createElement("div");
      var statusCount = countStatus(issuesForSprint, statuss[i].id);
      div.innerHTML = "<h3>" + statusCount.count + " " + statuss[i].name + "</h3>";
      div.className = "flex-item-sprint";
      var filterStatus = issuesForSprint.filter(elem => elem.status === statuss[i].id);
      filterStatus.map(elem => {
        let str = elem.type.charAt(0).toLowerCase() + elem.type.slice(1);
        var issueDiv = document.createElement("div");
        issueDiv.id = elem.id;
        issueDiv.className = "issue-types " + str;
        issueDiv.innerHTML = "<div id='move" + elem.id + "'class='button'>➥</div>"; // the button for moving to another sprint
        issueDiv.innerHTML += "<p>" + "#" + elem.id + " " + elem.name + "</p><hr>";
        issueDiv.innerHTML += "<hr><h3>" + elem.description + "</h3><br><hr>";
        if (elem.type === "Feature" || elem.type === "Bug") { // only FEATURES & BUGS can add subtasks
          issueDiv.innerHTML += "<div id='btn" + elem.id + "'class='button'>+</div>";
        }
        if (elem.tasks.length > 0) {
          issueDiv.innerHTML += "<p id='issue-subtasks'>subtasks</p>";
          for (var i = 0; i < elem.tasks.length; i++) {
            issueDiv.innerHTML += "<p>" + elem.tasks[i] + "</p>";
          }
        }
        div.appendChild(issueDiv);
      });
      container.appendChild(div);
    }
    container.addEventListener("click", handleEvent, false);
}

/*
    handler function for clicking the + button on a feature or bug;
    OR in case the issue DIV is clicked, it shows details/allows update
    OR if the arrow is clicked, allows moving the issue to a different sprint
*/
function handleEvent(e) {
  console.log(e.target);
  ////////////////////////// adding a subtask /////////////////////////
  if (e.target.className == "button" && e.target.id.includes('btn')) {
    currentIssueId = e.target.id.replace('btn', '');
    console.log("current issue id: ", currentIssueId);
    var txt = document.getElementById("proj-overview");
    var ind = txt.innerHTML.search('#');
    var id = txt.innerHTML.slice(ind+1, ind+6);
    console.log(txt.innerHTML, id);
    var issuesSprint = issues.filter(el => el.sprint === id);
    var tasks = issuesSprint.filter(el => el.type === "Task");
    console.log(tasks);
    var parent = document.getElementById("add-subtask");
    parent.style.display = "block";
    var form = document.getElementById("subtask-form");
    form.innerHTML = "";
    document.getElementsByClassName("flex-container-status")[0].style.display = "none";
    document.getElementById("proj-overview").style.opacity = "0.1";
    var currentIssue = issues.find(el => el.id === currentIssueId);
    for (let i = 0; i < tasks.length; i++) { // make sure we don't add a subtask that already exists
        var checkTask = currentIssue.tasks.find(el => el === tasks[i].id);
        if (checkTask === undefined) {
          var checkbox = document.createElement("input");
          checkbox.setAttribute("type", "checkbox");
          checkbox.setAttribute("name", "subtask");
          checkbox.setAttribute("value", tasks[i].id);
          var label = document.createElement("label");
          label.setAttribute("for", "subtask");
          label.innerHTML = tasks[i].id;
          form.appendChild(checkbox);
          form.appendChild(label);
        }
    }
  }
  ///////////////////////////   details / update part   //////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////
  // THIS ONE TRIGGERS WHEN CLICKING AN ISSUE DIV, MORE PRECISELY THE COLORED LEFT BORDER
  ////////////////////////////// OF THE ISSUE DIV ///////////////////////////////////////
  if (e.target.className.includes('issue-types')) {
    document.getElementsByClassName("flex-container-status")[0].style.display = "none";
    document.getElementById("proj-overview").style.opacity = "0.1";
    document.getElementById("update-issue").style.display = "block";
    currentIssueId = e.target.id;
    var currentIssue = issues.find(el => el.id === currentIssueId);
    document.getElementById("selectTypeUpdate").value = currentIssue.type;
    document.getElementById("nameUpdate").value = currentIssue.name;
    var selectAs = document.getElementById("selectAssigneeUpdate");
    selectAs.innerHTML = "";
    for (let i = 0; i < users.length; i++) {
      var opt = document.createElement('option');
        opt.value = users[i].id;
        opt.innerHTML = users[i].id;
        selectAs.appendChild(opt);
    }
    selectAs.value = currentIssue.assignee;
    document.getElementById("descrUpdate").value = currentIssue.description;
    var selectStatus = document.getElementById("selectStatusUpdate");
    selectStatus.innerHTML = "";
    for (let i = 0; i < statuss.length; i++) {
      var opt = document.createElement('option');
        opt.value = statuss[i].name;
        opt.innerHTML = statuss[i].name;
        selectStatus.appendChild(opt);
    }
    var currentStatusId = currentIssue.status;
    var currentStatus = statuss.find(el => el.id === currentStatusId);
    selectStatus.value = currentStatus.name;
    var comms = [];
    for (let i = 0; i < currentIssue.comments.length; i++) {
      var res = allComments.find(el => el.id === currentIssue.comments[i]);
      if (res !== undefined) {
        comms.push(res);
      }
    }
    document.getElementById("commUpdate").value = comms.join(";");
  }
  // show the popup for moving an issue to another sprint
  if (e.target.className == "button" && e.target.id.includes('move')) {
    currentIssueId = e.target.id.replace('move', '');
    var issueDiv = document.getElementById(currentIssueId);
    var check = document.getElementsByClassName("move-issue-div")[0];
    if (check === undefined) {
      var popupDiv = document.createElement('div');
      popupDiv.className = "move-issue-div";
      var selection = document.createElement("select");
      selection.id = "moveIssue";
      var issueSpan = document.createElement("span");
      issueSpan.innerHTML = "move to sprint: ";
      popupDiv.appendChild(issueSpan);
      for (let i = 0; i < project.sprints.length; i++) {
        var opt = document.createElement('option');
          opt.value = project.sprints[i];
          opt.innerHTML = project.sprints[i];
          selection.appendChild(opt);
      }
      popupDiv.appendChild(selection);
      popupDiv.innerHTML += "<div id='changeSprnt" + currentIssueId + "'class='move-button'>move</div>";
      issueDiv.appendChild(popupDiv);

    }
  }
  // change the sprint for the current issue and its subtasks if it has any
  if (e.target.className == "move-button") {
    var option = document.getElementById("moveIssue").value;
    var currIssueId = e.target.id.replace('changeSprnt', '');
    var currentIssue = issues.find(el => el.id === currIssueId);
    currentIssue.sprint = option;
    // since an issue (bug/feature) only contains the id of a task, must find all the corresponding subtasks
    ///// of a bug/feature and then change their sprint
    if ((currentIssue.type === "Feature" || currentIssue.type == "Bug") && currentIssue.tasks.length > 0) {
      var getTasks = [];
      for (let i = 0; i < currentIssue.tasks.length; i++) {
        var task = issues.find(el => el.id === currentIssue.tasks[i]);
        if (task !== undefined) {
          getTasks.push(task);
        }
      }
      if (getTasks.length === currentIssue.tasks.length) {
        getTasks.forEach(el => el.sprint = option);
      }
    }
    document.getElementsByClassName("move-issue-div")[0].outerHtml = "";
    showIssuesForSprint(option);
  }
}

//////////////////////// cancel button for the update option ////////////////////
var cancelBtn = document.getElementById("cancelBtn").addEventListener("click", function(){
  document.getElementById("update-issue").style.display = "none";
  document.getElementsByClassName("flex-container-status")[0].style.display = "flex";
  document.getElementById("proj-overview").style.opacity = "0.9";
});

////////////// update button inside update/details form  ///////////////
var updateBtn = document.getElementById("updateBtn").addEventListener("click", function() {
  var type = document.getElementById("selectTypeUpdate").value;
  var name = document.getElementById("nameUpdate").value;
  var assignee = document.getElementById("selectAssigneeUpdate").value;
  var descr = document.getElementById("descrUpdate").value;
  var status = document.getElementById("selectStatusUpdate").value;
  // need the status id, not name
  var statusId = statuss.find(el => el.name === status);
  var comms = document.getElementById("commUpdate").value;
  let comments = [];
  // comments are only stored in issues as an id, so must modify the initial input (string)
  if (comms.includes(";")) {
    var commnts = comms.split(";");
    for (let i = 0; i < commnts.length; i++) {
      let comment = new Comment(commnts[i]);
      comments.push(comment.id);
    }
  }
  else {
    let comment = new Comment(comms);
    comments.push(comment.id);
  }
  console.log(comments);
  comments.forEach(el => { allComments.push(el); });


  var currentIssue = issues.find(el => el.id === currentIssueId);
  currentIssue.type = type;
  currentIssue.name = name;
  currentIssue.assignee = assignee;
  currentIssue.description = descr;
  currentIssue.status = statusId.id;
  currentIssue.comments = comments;

// if Task, find its parents and change their status accordingly
// also, see if the parent is READY FOR TESTING aka all subtasks are RESOLVED
  if (currentIssue.type === "Task" && currentIssue.status !== statuss[0].id) {
    var issuesForSprint = issues.filter(el => el.sprint === currentIssue.sprint && el.tasks.length > 0);
    var parentsOfCurrTask = issuesForSprint.filter(el => el.tasks.includes(currentIssue.id));
    parentsOfCurrTask.forEach(el => el.status = currentIssue.status);

    if (currentIssue.status === statuss[4].id)  { // RESOLVED (part that does the ready 4 testing thingy)
      parentsOfCurrTask.forEach(el => {
        var getTasks = [];
          for (let i = 0; i < el.tasks.length; i++) {
            var task = issues.find(elem => elem.id === el.tasks[i]);
            if (task !== undefined && task.status === statuss[4].id) { // RESOLVED
              getTasks.push(task);
            }
          }
          if (getTasks.length === el.tasks.length) { // all the subtasks are RESOLVED
            statuss.push({id: 6, name: 'READY FOR TESTING'}); // add the new status
            el.status = statuss[5].id; // and modify
          }
      });
    }
  }
  // if the type is changed to TASK from Feature or Bug and the issue had subtasks,
  // they must be dropped
  if (currentIssue.type === "Task" && currentIssue.tasks.length > 0) {
    currentIssue.tasks = [];
  }

  currentIssue.updatedAt = new Date().toLocaleString(); // must change
  console.log(currentIssue, issues);

  document.getElementById("update-issue").style.display = "none";
  document.getElementsByClassName("flex-container-status")[0].style.display = "flex";
  // when done, show everything
  showIssuesForSprint(currentIssue.sprint);
});

/////////////////////////// add subtasks to a feature or bug //////////////////////////////
var subtaskBtn = document.getElementById("addSubTaskBtn").addEventListener("click", function() {
    var values = getCheckboxes('subtask');
    console.log(values);
    var zaIssue = issues.find(el => el.id === currentIssueId);
    values.forEach(el => zaIssue.tasks.push(el));
    zaIssue.updatedAt = new Date().toLocaleString();
    console.log(zaIssue, issues);
    var issueDiv = document.getElementById(zaIssue.id);
    issueDiv.innerHTML = "<div id='move" + zaIssue.id + "'class='button'>➥</div>";
    issueDiv.innerHTML += "<p>" + "#" + zaIssue.id + " " + zaIssue.name + "</p>";
    issueDiv.innerHTML += "<hr><h3>" + zaIssue.description + "</h3><br><hr>";
    issueDiv.innerHTML += "<div id='btn" + zaIssue.id + "'class='button'>+</div>";
    if (zaIssue.tasks.length > 0) {
      issueDiv.innerHTML += "<p id='issue-subtasks'>subtasks</p><hr>";
      for (var i = 0; i < zaIssue.tasks.length; i++) {
        issueDiv.innerHTML += "<p>" + zaIssue.tasks[i] + "</p>";
      }
    }
    document.getElementById("add-subtask").style.display = "none";
    document.getElementsByClassName("flex-container-status")[0].style.display = "flex";
    document.getElementById("proj-overview").style.opacity = "0.9";
});


//////////////////////////////////////////////////////////////////////
///////////// shows the form for adding a new issue /////////////////
var addIssue =  document.getElementById("addIssueMenu");
addIssue.addEventListener("click", displayAddIssueForm);

function displayAddIssueForm() {
  document.getElementById("create-sprint").style.display = "none";
  document.getElementById("add-issue").style.display = "block";
  document.getElementsByClassName("flex-container")[0].style.opacity = "0.1";
  document.getElementById("proj-overview").style.opacity = "0.1";
  var cont = document.getElementsByClassName("flex-container-status")[0]
  if (cont !== undefined) {
    cont.style.opacity = "0.1";
  }

// show project's sprints as dropdown
  var selectSprint = document.getElementById("selectSprint");
  selectSprint.innerHTML = "";
  for (let i = 0; i < project.sprints.length; i++) {
    var opt = document.createElement('option');
      opt.value = project.sprints[i];
      opt.innerHTML = project.sprints[i];
      selectSprint.appendChild(opt);
  }

// show the users as dropdown
  var selectAs = document.getElementById("selectAssignee");
  selectAs.innerHTML = "";
  for (let i = 0; i < users.length; i++) {
    var opt = document.createElement('option');
      opt.value = users[i].id;
      opt.innerHTML = users[i].id;
      selectAs.appendChild(opt);
  }
}

/// adds a new issue when clickin the add button inside form ///
var addIssueBtn = document.getElementById("addBtn");
addIssueBtn.addEventListener("click", addAnIssueFunc);
///// handler func for adding issue
function addAnIssueFunc() {
  var type = document.getElementById("selectType").value;
  var name = document.getElementById("name").value;
  var sprint = document.getElementById("selectSprint").value;
  var assignee = document.getElementById("selectAssignee").value;
  var descr = document.getElementById("descr").value;
  var comms = document.getElementById("comm").value;
  let comments = [];
  if (comms.includes(";")) {
    var commnts = comms.split(";");
    for (let i = 0; i < commnts.length; i++) {
      let comment = new Comment(commnts[i]);
      comments.push(comment.id);
    }
  }
  else {
    let comment = new Comment(comms);
    comments.push(comment.id);
  }
  console.log(comments);
  comments.forEach(el => { allComments.push(el); });

  // those fields have default values, can be empty
  if (name === "") { name = undefined;}
  if (descr === "") { descr = undefined;}

  let issue = new Issue(type, name, sprint, mainUser.id, assignee, descr, comments);
  console.log(issue);
  issues.push(issue);
  console.log(issues);

  // must clean everything when done
  document.getElementById("add-issue").style.display = "none";
  document.getElementsByClassName("flex-container")[0].style.opacity = "0.9";
  document.getElementById("proj-overview").style.opacity = "0.9";
  var cont = document.getElementsByClassName("flex-container-status")[0]
  if (cont !== undefined) {
    cont.style.opacity = "0.9";
  }
  // and then show what we've done
  showProjectOverview();
}
/////////////////////////////////////////////////////////////////////////////

// shows the form for creating a new sprint
var createSprint = document.getElementById("createSprintMenu").addEventListener("click", function() {
  document.getElementById("add-issue").style.display = "none";
  document.getElementById("create-sprint").style.display = "block";
  document.getElementsByClassName("flex-container")[0].style.opacity = "0.1";
  document.getElementById("proj-overview").style.opacity = "0.1";
  var cont = document.getElementsByClassName("flex-container-status")[0]
  if (cont !== undefined) {
    cont.style.opacity = "0.1";
  }
});

// creates a new sprint
var createSprntBtn = document.getElementById("createSprintBtn").addEventListener("click", function(){
  var value = document.getElementById("sprintName").value;
  console.log(value);
  var newSprint = new Sprint(value);
  project.sprints.push(newSprint.id); // add the sprint to the current project
  console.log("new length for sprints: ", project.sprints.length);

  // make everything look normal again
  document.getElementById("create-sprint").style.display = "none";
  document.getElementsByClassName("flex-container")[0].style.opacity = "0.9";
  document.getElementById("proj-overview").style.opacity = "0.9";
  var cont = document.getElementsByClassName("flex-container-status")[0]
  if (cont !== undefined) {
    cont.style.opacity = "0.9";
  }
  showProjectOverview();
});
