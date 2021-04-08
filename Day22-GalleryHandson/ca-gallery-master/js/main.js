'use strict';

$(document).ready(init);

function init() {
  renderProjects();
}

function renderProjects() {
  var projects = getProjects();
  var strHtmls = projects.map(function (project) {
    return `
    <div class="col-md-4 col-sm-6 portfolio-item">
        <a class="portfolio-link" data-toggle="modal" onclick="onRenderModal('${project.id}')" href="#portfolioModal">
          <div class="portfolio-hover">
            <div class="portfolio-hover-content">
              <i class="fa fa-plus fa-3x"></i>
            </div>
          </div>
          <img class="img-fluid" src="img/portfolio/0${project.id}-thumbnail.jpg" alt="">
        </a>
        <div class="portfolio-caption">
          <h4>${project.name}</h4>
          <p class="text-muted">Illustration</p>
        </div>
      </div>`;
  });

  $('#portfolio .row:nth-child(2)').html(strHtmls.join(''));
}

function onRenderModal(projectId) {
  var project = getProjectById(projectId);
  console.log(project);
  var strHtml = `
        <h2>${project.name}</h2> <hr>
        <p class="item-intro text-muted">${project.title}</p>
        <img class="img-fluid d-block mx-auto" src="img/portfolio/0${project.id}-full.jpg" alt="">
        <p>Use this area to describe your project. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est blanditiis
        dolorem culpa incidunt minus dignissimos deserunt repellat aperiam quasi sunt officia expedita beatae cupiditate,
        maiores repudiandae, nostrum, reiciendis facere nemo!</p>
        <ul class="list-inline">
        <li>Tags: ${project.labels}</li>
        <li>uploaded: ${project.currDate}</li>
        </ul>
        <a class="text-dark blockquote mt-8" href="projects/${project.id}/index.html" target="_blank">Try Live</a>`;

  $('.modal-body').html(strHtml);
}

function onSubmit() {
  var mailTo = $('input[name=email]').val();
  var mailSubject = $('input[name=subject]').val();
  var mailMessage = $('textarea[name=message]').val();
  window.open(
    `https://mail.google.com/mail/?view=cm&fs=1&to=${mailTo}&su=${mailSubject}&body=${mailMessage}`
  );
}
