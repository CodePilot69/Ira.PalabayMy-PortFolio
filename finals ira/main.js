document.addEventListener('DOMContentLoaded', () => {

 
  const mobileToggle = document.querySelector('.mobile-toggle');
  const appShell = document.querySelector('.app-shell');
  const fileItems = document.querySelectorAll('.file-item');

  mobileToggle.addEventListener('click', () => {
    appShell.classList.toggle('sidebar-open');
  });

  fileItems.forEach(link => {
    link.addEventListener('click', () => {
      appShell.classList.remove('sidebar-open');
      fileItems.forEach(item => item.classList.remove('active'));
      link.classList.add('active');
    });
  });

  let allProjects = [];

 
  fetch('./data.json')
    .then(response => response.json())
    .then(data => {
      renderPersonalInfo(data.personalInfo);
      renderSkills(data.skills);

      allProjects = data.projects;
      renderProjectFilters(allProjects);
      renderProjects(allProjects);

      renderCertifications(data.certifications);
      renderEducation(data.education);
    })
    .catch(error => console.error('Data pipeline error:', error));


 

  function renderPersonalInfo(info) {
    document.getElementById('hero-name').textContent = info.name;
    document.getElementById('hero-role').textContent = info.role;
    document.getElementById('hero-tagline').textContent = info.tagline;
    document.querySelector('.logo-name').textContent = info.name;

    const socialHtml = `
      <a href="${info.github}" target="_blank" class="social-btn">GitHub ↗</a>
      <a href="mailto:${info.email}" class="social-btn">Email ✉</a>
    `;
    document.getElementById('hero-socials').innerHTML = socialHtml;
    document.getElementById('footer-socials').innerHTML = socialHtml;

    document.querySelector('.content-footer p').innerHTML = `&copy; ${new Date().getFullYear()} ${info.name}. Built for Web Development 1.`;
  }

  function renderSkills(skillsData) {
    const container = document.getElementById('skills-container');
    skillsData.forEach(group => {
      const items = group.items.map(i => `<li>${i}</li>`).join('');
      container.innerHTML += `<article class="skill-category"><h3>${group.category}</h3><ul>${items}</ul></article>`;
    });
  }

  function renderProjectFilters(projects) {
    const filterContainer = document.getElementById('project-filters');

    const uniqueTags = new Set();
    projects.forEach(p => p.tags.forEach(tag => uniqueTags.add(tag)));

    let filterHtml = `<button class="filter-btn active" data-filter="all">All</button>`;

    uniqueTags.forEach(tag => {
      filterHtml += `<button class="filter-btn" data-filter="${tag}">${tag}</button>`;
    });

    filterContainer.innerHTML = filterHtml;

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        const filterValue = e.target.getAttribute('data-filter');
        if (filterValue === 'all') {
          renderProjects(allProjects);
        } else {
          const filtered = allProjects.filter(p => p.tags.includes(filterValue));
          renderProjects(filtered);
        }
      });
    });
  }

  function renderProjects(projectsData) {
    const container = document.getElementById('projects-container');
    container.innerHTML = '';

    projectsData.forEach(project => {
      const tags = project.tags.map(t => `<span class="tag">${t}</span>`).join('');
      container.innerHTML += `
        <article class="project-card">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="project-tags">${tags}</div>
          <a href="${project.link}" target="_blank">View Code</a>
        </article>
      `;
    });
  }

  function renderCertifications(certsData) {
    const container = document.getElementById('certifications-container');
    if (!certsData) return;

    certsData.forEach(cert => {
      container.innerHTML += `
        <article class="timeline-item">
          <h3>${cert.title}</h3>
          <strong>${cert.issuer}</strong> | <span>${cert.date}</span>
          <p>${cert.description}</p>
        </article>
      `;
    });
  }

  function renderEducation(educationData) {
    const container = document.getElementById('education-container');
    educationData.forEach(edu => {
      container.innerHTML += `
        <article class="timeline-item">
          <h3>${edu.title}</h3>
          <strong>${edu.institution}</strong> | <span>${edu.period}</span>
          <p>${edu.description}</p>
        </article>
      `;
    });
  }

  // --- 4. SCROLL SPY (highlight active file in sidebar) ---
  const sections = document.querySelectorAll('.panel');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        fileItems.forEach(item => {
          item.classList.toggle('active', item.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(section => observer.observe(section));
});