# Project Management Tool

The application will handle a single project (at this step), but that project has more than 1 versions/milestones (called sprints).
A user can create 3 types of issues for a project: features, bugs, and tasks. Each of these issues belongs to a certain sprint inside the project. Features and bugs can have multiple tasks (called subtasks), which are basically the breakdown of the bigger issues - features and bugs.

Each issue has multiple possible states, which are described below:
* New
* In progress
* Feedback
* Rework
* Resolved


Checkout the breakdown of fields for each big component of the project.

| User | #
| ------ | :----:|
| **id** | numeric - unique |
| **name** | text|

| Issue | #
| ------ | :----: |
| **id** | numeric - unique |
| **type** | string |
| **name** | text|
| **sprint** | sprint.id |
| **createdBy** | user.id |
| **assignee** | user.id |
| **description** | text |
| **status** | status.id |
| **tasks** | issue.ids |
| **comments** | comment.ids |
| **updatedAt** | date |
| **createdAt** | date |

| Project | #
| ------ | :----:|
| **id** | numeric - unique |
| **sprints** | sprint.ids |

| Sprint | #
| ------ | :----:|
| **id** | numeric - unique |
| **name** | text |

| Comments | #
| ------ | :----:|
| **id** | numeric - unique |
| **name** | text |


**The ID is generated when the issue is created, is unique and cannot be changed.**

**CreatedBy will be filled on creation with the ID of the user that created that issue**

**The fields UpdatedAt and CreatedAt are updated automatically on issue creation or change.**

**Only issues of type BUG or FEATURE can have subtasks.**


### Functionality needed:

A user needs to be able to create any kind of issue with some initial values. All newly created issues will have the status __New__.

The user needs to see an overview of the current project, broken down per sprints, how many issues in each status, how many features, how many bugs, etc.

Apart for the fields mentioned above, the user can change any field of an issue through an __UPDATE__ action.

If the user moves the bug or feature in a different sprint, the subtasks will have to be moved as well.

Completing all the tasks of a __bug__ or __feature__ will change the status of that issue to Ready For Testing.

As soon as a task changes its status from __New__ to any other, it's corresponding issue will change it's status as well to it's parent status.

A user can create sprints to which the issues will be assigned.

A user can filter the issues by sprint or status.

