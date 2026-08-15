/**
 * build-projects.js
 * Generates static case-study pages from projects.js:
 *   - projects/<slug>/index.html  (25 static project pages)
 *   - projects/index.html         (portfolio listing)
 *
 * Run:  node build-projects.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PHONE = '917574996656';
const BASE = 'https://www.neunrg.online';

global.window = {};
eval(fs.readFileSync(path.join(ROOT, 'projects.js'), 'utf8'));
const projects = global.window.NEUNRG_PROJECTS;

if (!Array.isArray(projects) || projects.length === 0) {
  console.error('No projects found in projects.js');
  process.exit(1);
}

const SERVICE_LINK = {
  'Website Development': { url: 'web-development.html', name: 'Web Development' },
  'API Development': { url: 'api-development.html', name: 'API Development' },
  'Web Automation': { url: 'web-automation.html', name: 'Web Automation' },
  'UI/UX Design': { url: 'website-design.html', name: 'Website Design' },
  'SEO & Marketing': { url: 'seo.html', name: 'SEO Services' },
};

const NAV = (p) => `
            <nav>
                <a class="logo" href="${p}index.html" aria-label="Go to neunrg homepage">neu<span>nrg</span></a>
                <ul class="nav-links">
                    <li><a href="${p}index.html#services">Services</a></li>
                    <li><a href="${p}projects/index.html">Projects</a></li>
                    <li><a href="${p}about.html">About</a></li>
                    <li><a href="${p}blog/index.html">Blog</a></li>
                    <li><a href="${p}contact.html">Contact</a></li>
                </ul>
                <a
                    href="#"
                    class="nav-cta js-wa-cta"
                    data-wa-kind="default"
                    aria-label="Start your project on WhatsApp"
                    >Start Project</a
                >
                <div class="hamburger" onclick="toggleMenu()">
                    <span></span><span></span><span></span>
                </div>
            </nav>`;

const FOOTER = (p) => `
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="footer-logo">neu<span>nrg</span></div>
                    <p>
                        neunrg is a web development and digital solutions agency
                        in Rajkot, Gujarat. We build websites, web applications,
                        APIs, automation systems and growth marketing.
                    </p>
                    <p style="margin-top: 14px">
                        Rajkot, Gujarat, India<br />
                        <a
                            href="tel:+917574996656"
                            style="color: var(--text-muted); text-decoration: none"
                            >+91 75749 96656</a
                        >
                    </p>
                </div>
                <div>
                    <div class="footer-title">Services</div>
                    <div class="footer-links">
                        <a href="${p}web-development.html">Web Development</a>
                        <a href="${p}website-design.html">Website Design</a>
                        <a href="${p}api-development.html">API Development</a>
                        <a href="${p}web-automation.html">Web Automation</a>
                        <a href="${p}digital-marketing.html">Digital Marketing</a>
                        <a href="${p}seo.html">SEO Services</a>
                    </div>
                </div>
                <div>
                    <div class="footer-title">Company</div>
                    <div class="footer-links">
                        <a href="${p}projects/index.html">Projects</a>
                        <a href="${p}about.html">About</a>
                        <a href="${p}contact.html">Contact</a>
                        <a href="${p}blog/index.html">Blog</a>
                    </div>
                </div>
                <div>
                    <div class="footer-title">Start a Project</div>
                    <p
                        style="
                            color: var(--text-muted);
                            font-size: 0.88rem;
                            line-height: 1.8;
                            margin-bottom: 16px;
                        "
                    >
                        Message us on WhatsApp — we reply within 24 hours.
                    </p>
                    <a
                        href="#"
                        class="footer-contact-cta js-wa-cta"
                        data-wa-kind="default"
                        aria-label="Contact neunrg instantly on WhatsApp"
                        >Contact Us Instantly</a
                    >
                </div>
            </div>
            <div class="footer-bottom">
                <div>
                    © <span class="js-current-year">2025</span> neunrg. All
                    rights reserved.
                </div>
                <div>New Energy. High-Impact Execution.</div>
            </div>`;

const WHATSAPP_SVG = `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                    d="M20.52 3.48A11.8 11.8 0 0012.08 0C5.5 0 .16 5.34.16 11.92c0 2.1.55 4.15 1.6 5.97L0 24l6.29-1.65a11.88 11.88 0 005.79 1.48h.01c6.58 0 11.92-5.35 11.92-11.93 0-3.19-1.24-6.18-3.49-8.42zm-8.44 18.34h-.01a9.9 9.9 0 01-5.04-1.38l-.36-.22-3.73.98 1-3.64-.24-.38a9.9 9.9 0 01-1.52-5.26c0-5.48 4.46-9.93 9.94-9.93 2.65 0 5.14 1.03 7.01 2.91a9.86 9.86 0 012.9 7.02c0 5.48-4.46 9.93-9.95 9.93zm5.45-7.44c-.3-.15-1.78-.88-2.05-.98-.27-.1-.47-.15-.67.15-.2.3-.77.98-.95 1.18-.17.2-.35.22-.65.07-.3-.15-1.28-.47-2.43-1.5-.9-.8-1.5-1.8-1.68-2.1-.18-.3-.02-.47.13-.62.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.52s1.08 2.93 1.23 3.13c.15.2 2.12 3.23 5.13 4.53.72.31 1.28.5 1.72.64.72.23 1.37.2 1.89.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.42-.08-.12-.27-.2-.57-.35z"
                />
            </svg>`;

const SCRIPTS = (p) => `
        <script src="${p}whatsapp.js"></script>
        <script src="${p}js/site.js"></script>`;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function waLink(project) {
  const msg = `Hi, I saw your project '${project.name}' on neunrg. I want something similar.`;
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
}

function head(opts) {
  const { title, description, canonical, schema } = opts;
  return `<!doctype html>
<html lang="en-IN">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${escapeHtml(title)}</title>
        <meta name="description" content="${escapeHtml(description)}" />
        <link rel="canonical" href="${canonical}" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#050a12" />
        <meta property="og:title" content="${escapeHtml(title)}" />
        <meta property="og:description" content="${escapeHtml(description)}" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="${canonical}" />
        <meta property="og:image" content="${BASE}/assets/og-image.png" />
        <meta property="og:site_name" content="neunrg" />
        <meta property="og:locale" content="en_IN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${escapeHtml(title)}" />
        <meta name="twitter:description" content="${escapeHtml(description)}" />
        <meta name="twitter:image" content="${BASE}/assets/og-image.png" />
        <link rel="icon" type="image/svg+xml" href="${opts.icon}" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
            href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Exo+2:wght@300;400;600;700;900&family=Sora:wght@300;400;500;600&display=swap"
            rel="stylesheet"
        />
        <link rel="stylesheet" href="${opts.css}" />
        <script type="application/ld+json">
            ${JSON.stringify(schema, null, 4).replace(/</g, '\\u003c')}
        </script>
    </head>`;
}

function pageShell({ p, content, title, description, canonical, schema }) {
  return `${head({ title, description, canonical, schema, icon: `${p}assets/favicon.svg`, css: `${p}css/main.css` })}
    <body>
        <canvas id="particle-canvas"></canvas>
        <div class="page-shell">
${NAV(p)}
${content}
${FOOTER(p)}
        </div>

        <a
            href="#"
            class="floating-whatsapp js-wa-cta"
            data-wa-kind="default"
            aria-label="Open WhatsApp chat with neunrg"
        >${WHATSAPP_SVG}</a>

${SCRIPTS(p)}
    </body>
</html>
`;
}

// ─── PROJECT DETAIL PAGES ───
function renderProjectPage(project, allProjects, index) {
  const slug = project.slug;
  const canonical = `${BASE}/projects/${slug}/`;
  const service = SERVICE_LINK[project.category] || null;
  const related = allProjects
    .filter((item) => item.slug !== slug)
    .sort((a, b) => {
      const aScore = a.category === project.category ? 0 : 1;
      const bScore = b.category === project.category ? 0 : 1;
      return aScore - bScore;
    })
    .slice(0, 3);

  const relatedHtml = related
    .map(
      (item) => `
              <a class="case-link-card" href="../${item.slug}/">
                <div class="case-cat">${escapeHtml(item.category)}</div>
                <div class="case-name">${escapeHtml(item.name)}</div>
                <div class="case-result">${escapeHtml(item.result)}</div>
              </a>`,
    )
    .join('\n');

  const techHtml = project.techUsed
    .map((tech) => `<span class="tech-pill">${escapeHtml(tech)}</span>`)
    .join('');

  const serviceHtml = service
    ? `
            <p class="content-p">
              This project falls under our
              <a href="../../${service.url}" style="color: var(--cyan)"
                >${escapeHtml(service.name)} services</a
              >. Explore the other
              <a href="../../${service.url}" style="color: var(--cyan)"
                >${escapeHtml(service.name)} page</a
              >
              to see how we can help your business with the same
              approach.
            </p>`
    : '';

  const content = `
            <!-- HERO -->
            <header class="page-hero">
                <div class="page-breadcrumb">
                    <a href="../../index.html">Home</a>
                    <span>/</span>
                    <a href="../../projects/index.html">Projects</a>
                    <span>/</span>
                    <span>${escapeHtml(project.name)}</span>
                </div>
                <div class="eyebrow" style="justify-content: center; margin-bottom: 16px">${escapeHtml(project.category)}</div>
                <h1 class="page-title">${escapeHtml(project.name)}</h1>
                <p class="page-sub">${escapeHtml(project.tagline)}</p>
                <div class="meta-row">
                    <div class="meta-cell">
                        <div class="meta-label">Result</div>
                        <div class="meta-value">${escapeHtml(project.result)}</div>
                    </div>
                    <div class="meta-cell">
                        <div class="meta-label">Category</div>
                        <div class="meta-value">${escapeHtml(project.category)}</div>
                    </div>
                    <div class="meta-cell">
                        <div class="meta-label">Location</div>
                        <div class="meta-value">Rajkot, India</div>
                    </div>
                    <div class="meta-cell">
                        <div class="meta-label">Delivery</div>
                        <div class="meta-value">Outcome-Driven</div>
                    </div>
                </div>
                <div class="page-ctas">
                    <a
                        href="${waLink(project)}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="btn-primary"
                        aria-label="Start a similar project to ${escapeHtml(project.name)} on WhatsApp"
                        >Start Similar Project</a
                    >
                    <a href="../../projects/index.html" class="btn-secondary"
                        >All Projects</a
                    >
                </div>
            </header>

            <!-- DETAILS -->
            <section class="page-section">
                <div class="content-head reveal">
                    <div class="section-tag">Project Breakdown</div>
                    <h2 class="content-h2">Challenge, Solution,<br />Result.</h2>
                    <p class="content-p">
                        A quick look at the problem, what we built, the
                        technology behind it, and the outcome it created.
                    </p>
                </div>
                <div class="info-grid reveal">
                    <div class="info-card">
                        <div class="info-num">01</div>
                        <div class="info-title">Problem</div>
                        <div class="info-copy">${escapeHtml(project.problem)}</div>
                    </div>
                    <div class="info-card">
                        <div class="info-num">02</div>
                        <div class="info-title">Solution</div>
                        <div class="info-copy">${escapeHtml(project.solution)}</div>
                    </div>
                    <div class="info-card">
                        <div class="info-num">03</div>
                        <div class="info-title">Result</div>
                        <div class="info-copy">
                            ${escapeHtml(project.result)}. The final delivery
                            was designed to improve performance in a way that
                            business owners and teams could actually feel.
                        </div>
                    </div>
                </div>
                <div class="content-head reveal" style="margin-top: 56px">
                    <div class="section-tag">Tech Used</div>
                    <h2 class="content-h2">Built With the<br />Right Stack.</h2>
                </div>
                <div class="tech-stack reveal">${techHtml}</div>
                ${serviceHtml}
            </section>

            <!-- RELATED -->
            <section class="page-section page-section--alt">
                <div class="content-head reveal">
                    <div class="section-tag">Explore More</div>
                    <h2 class="content-h2">More Projects in the<br />neunrg Portfolio.</h2>
                    <p class="content-p">
                        If this project feels close to your needs, the rest of
                        the portfolio will help you see the breadth of what
                        neunrg can build.
                    </p>
                </div>
                <div class="case-links reveal">${relatedHtml}</div>
            </section>

            <!-- CTA -->
            <section class="page-section">
                <div class="cta-box reveal">
                    <div class="section-tag" style="justify-content: center">
                        Let's Build Together
                    </div>
                    <h2 class="section-title">
                        Want This Kind of<br /><span style="color: var(--cyan)"
                            >Result</span
                        >
                        for Your Business?
                    </h2>
                    <p class="section-sub">
                        Bring us the problem, the deadline, or the growth goal.
                        We'll help shape the right solution and build it with
                        clarity.
                    </p>
                    <div class="hero-ctas">
                        <a
                            href="${waLink(project)}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="btn-primary"
                            aria-label="Start a similar project to ${escapeHtml(project.name)} on WhatsApp"
                            >Start Similar Project</a
                        >
                        <a href="../../contact.html" class="btn-secondary"
                            >Contact Us</a
                        >
                    </div>
                </div>
            </section>`;

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${BASE}/#organization`,
        name: 'neunrg',
        url: `${BASE}/`,
        logo: `${BASE}/assets/logo.svg`,
      },
      {
        '@type': 'WebPage',
        '@id': canonical + '#webpage',
        url: canonical,
        name: `${project.name} | neunrg Case Study`,
        description: `${project.tagline}. ${project.result}.`,
        isPartOf: { '@id': `${BASE}/#website` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
          { '@type': 'ListItem', position: 2, name: 'Projects', item: `${BASE}/projects/` },
          { '@type': 'ListItem', position: 3, name: project.name, item: canonical },
        ],
      },
    ],
  };

  return pageShell({
    p: '../../',
    content,
    title: `${project.name} | neunrg Case Study`,
    description: `${project.name} by neunrg. ${project.tagline}. ${project.result}. A ${project.category.toLowerCase()} case study from Rajkot, Gujarat.`,
    canonical,
    schema,
  });
}

// ─── PORTFOLIO LISTING ───
function renderListing(allProjects) {
  const canonical = `${BASE}/projects/`;
  const cards = allProjects
    .map(
      (project) => `
                <a class="project-listing-card" href="${project.slug}/">
                    <div class="pl-cat">${escapeHtml(project.category)}</div>
                    <div class="pl-name">${escapeHtml(project.name)}</div>
                    <p class="pl-tagline">${escapeHtml(project.tagline)}</p>
                    <div class="pl-result">${escapeHtml(project.result)}</div>
                </a>`,
    )
    .join('\n');

  const categories = [...new Set(allProjects.map((p) => p.category))];

  const content = `
            <!-- HERO -->
            <header class="page-hero">
                <div class="page-breadcrumb">
                    <a href="../index.html">Home</a>
                    <span>/</span>
                    <span>Projects</span>
                </div>
                <h1 class="page-title">
                    Real Solutions.<br /><span class="glow">Real Impact.</span>
                </h1>
                <p class="page-sub">
                    A focused portfolio of websites, APIs, automations and
                    growth systems built to solve real business problems and
                    produce measurable outcomes.
                </p>
                <div class="stat-pills">
                    <div class="stat-pill">
                        <strong>${allProjects.length}</strong>
                        <span>Case Studies</span>
                    </div>
                    <div class="stat-pill">
                        <strong>${categories.length}</strong>
                        <span>Service Categories</span>
                    </div>
                    <div class="stat-pill">
                        <strong>10+</strong>
                        <span>Projects Delivered</span>
                    </div>
                </div>
            </header>

            <!-- LISTING -->
            <section class="page-section page-section--alt">
                <div class="content-head reveal">
                    <div class="section-tag">Portfolio</div>
                    <h2 class="content-h2">Every Project,<br />Every Outcome.</h2>
                    <p class="content-p">
                        ${allProjects.length} case studies across
                        ${categories.join(', ')}. Click any project for the
                        full breakdown.
                    </p>
                </div>
                <div class="projects-listing-grid reveal">
${cards}
                </div>
            </section>

            <!-- CTA -->
            <section class="page-section">
                <div class="cta-box reveal">
                    <div class="section-tag" style="justify-content: center">
                        Your Project Next
                    </div>
                    <h2 class="section-title">
                        Want Results Like<br /><span style="color: var(--cyan)"
                            >These</span
                        >
                        for Your Business?
                    </h2>
                    <p class="section-sub">
                        Tell us about your project and we'll get back to you
                        within 24 hours with a tailored strategy and
                        transparent pricing.
                    </p>
                    <div class="hero-ctas">
                        <a
                            href="#"
                            class="btn-primary js-wa-cta"
                            data-wa-kind="default"
                            aria-label="Start your project on WhatsApp"
                            >Start Your Project</a
                        >
                        <a href="../contact.html" class="btn-secondary"
                            >Contact Us</a
                        >
                    </div>
                </div>
            </section>`;

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${BASE}/#organization`,
        name: 'neunrg',
        url: `${BASE}/`,
        logo: `${BASE}/assets/logo.svg`,
      },
      {
        '@type': 'CollectionPage',
        name: 'neunrg Projects & Case Studies',
        url: canonical,
        description: `A portfolio of ${allProjects.length} case studies by neunrg, a web development and digital solutions agency in Rajkot.`,
        isPartOf: { '@id': `${BASE}/#website` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
          { '@type': 'ListItem', position: 2, name: 'Projects', item: canonical },
        ],
      },
    ],
  };

  return pageShell({
    p: '../',
    content,
    title: 'Projects & Case Studies | neunrg Web Development Agency Rajkot',
    description: `Explore ${allProjects.length} case studies by neunrg, a web development and digital solutions agency in Rajkot — websites, APIs, automation, design and marketing results.`,
    canonical,
    schema,
  });
}

// ─── WRITE FILES ───
const outDir = path.join(ROOT, 'projects');
fs.mkdirSync(outDir, { recursive: true });

projects.forEach((project, index) => {
  const dir = path.join(outDir, project.slug);
  fs.mkdirSync(dir, { recursive: true });
  const html = renderProjectPage(project, projects, index);
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`  projects/${project.slug}/index.html`);
});

fs.writeFileSync(path.join(outDir, 'index.html'), renderListing(projects));
console.log('  projects/index.html');
console.log(`Done. ${projects.length + 1} files generated.`);