function Issue(type, name = type + '-name', sprintId, userId, assigneeId, description = 'Created a new issue of type: ' + type, comments) {
   this.id = generateUniqueId(5);
   this.type = type; // FEATURE, BUG, TASK
   this.name = name;
   this.sprint = sprintId; // sprint.id
   this.createdBy = userId; // user.id
   this.assignee = assigneeId; // user.id
   this.description = description;
   this.status = statuss[0].id;
   this.tasks = [];
   this.comments = comments;
   this.updatedAt = new Date().toLocaleString();
   this.createdAt = new Date().toLocaleString();
}

// generates a random unique ID of a given length
function generateUniqueId(length) {
	 var timestamp = +new Date;

	 var _getRandomInt = function( min, max ) {
		   return Math.floor(Math.random() * (max - min + 1)) + min;
	 }

	 var ts = timestamp.toString();
	 var parts = ts.split("").reverse();
	 var id = "";

	 for (var i = 0; i < length; ++i) {
  		var index = _getRandomInt(0, parts.length - 1);
  		id += parts[index];
	 }

	 return id;

}
