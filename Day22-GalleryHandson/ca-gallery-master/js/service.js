'use strict';

var gProjects = createProjects();

function createProjects() {
  return [
    {
      id: '1',
      name: 'Minesweeper',
      title: 'Minesweeper',
      desc: 'Minesweeper',
      url: 'link',
      publishedAt: new Date(),
      labels: ['Matrixes', 'keyboard events'],
    },
    {
      id: '2',
      name: 'Books Shop',
      title: 'Books Shop',
      desc: 'Books Shop',
      url: 'Link',
      publishedAt: new Date(2021),
      labels: ['Matrixes', 'keyboard events'],
    },
    {
      id: '3',
      name: 'Touch Nums',
      title: 'Touch Nums',
      desc: 'Touch Nums',
      url: 'Link',
      publishedAt: new Date(2021),
      labels: ['Matrixes', 'keyboard events'],
    },
    {
      id: '4',
      name: 'In-Picture Game',
      title: 'In-Picture Game',
      desc: 'In-Picture Game',
      url: 'Link',
      publishedAt: new Date(2021),
      labels: ['Matrixes', 'keyboard events'],
    },
  ];
}

function getProjects() {
  return gProjects;
}

function getProjectById(projectId) {
  var project = gProjects.find(function (project) {
    return project.id === projectId;
  });
  return project;
}
