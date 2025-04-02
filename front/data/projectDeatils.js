const { title } = require("process");

const projectDetails = [
  {
    title: "Project 1",
    totalTasks: 5,
    tasksCompleted: 2,
    tasksPending: 1,
    tasks: [
      {
        id: "task-D-01",
        title: "task1",
        module: "Dev",
        status: "In Progress",
      },
      {
        id: "task-D-02",
        title: "task 2",
        module: "Dev",
        status: "Completed",
        completedAt: "2025-01-15",
      },
      {
        id: "task-Media-01",
        title: "task3",
        module: "Media",
        status: "In Progress",
      },
      {
        id: "task-RH-01",
        title: "task4",
        module: "RH",
        status: "Completed",
        completedAt: "2025-01-04",
      },
    ],
    description:
      "This is a test Description maybeeeeeeee it will workkkkkkkkkkkkkkk",
    TeamMembersWork: [
      {
        name: "seif",
        totalTask: 8,
      },
      {
        name: "bensa",
        totalTask: 1,
      },
      {
        name: "hoss",
        totalTask: 10,
      },
      {
        name: "abdelehlib",
        totalTask: 0,
      },
      {
        name: "hind",
        totalTask: 4,
      },
    ],
  },
];
