var statuss = [
  { id: 1, name: 'NEW'},
	{ id: 2, name: 'IN PROGRESS'},
	{ id: 3, name: 'FEEDBACK'},
	{ id: 4, name: 'REWORK'},
	{ id: 5, name: 'RESOLVED'}
];

var issueTypes = ["Feature", "Bug", "Task"];

function User(name = 'user') {
  this.id = generateUniqueId(3);
  this.name = name;
}

function Comment(name) {
  this.id = generateUniqueId(3);
  this.name = name;
}

function Project() {
  this.id = generateUniqueId(3);
  this.sprints = []; // sprint.ids
}

function Sprint(name) {
  this.id = generateUniqueId(5);
  this.name = name;
}

function countType(issueArr, prop) {
  console.log(issueArr, prop);
  var filterProps = issueArr.filter(elem => elem.type === prop);
  return { type : prop,
    count : filterProps.length
  };
}

function countStatus(issueArr, prop) {
  console.log(issueArr, prop);
  var filterProps = issueArr.filter(elem => elem.status === prop);
  var findStatus = statuss.find(elem => elem.id === prop);
  return { status : findStatus.name,
    count : filterProps.length
  };
}

function getCheckboxes(name) {
    var checkboxes = document.querySelectorAll('input[name="' + name + '"]:checked'), values = [];
    Array.prototype.forEach.call(checkboxes, function(el) {
        values.push(el.value);
    });
    return values;
}
