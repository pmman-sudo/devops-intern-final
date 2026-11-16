/* =========================================================
   GLOBAL STATE
   ========================================================= */

let currentFilter = 'commands';      // 'commands' | 'steps'
let currentCategory = 'windows';     // current sidebar category
let selectedTag = 'all';             // category tag filter


/* =========================================================
   MAIN CONTENT LOADER
   ========================================================= */

function loadContent(category, resetTag = false) {

    if (resetTag) {
        selectedTag = 'all';
    }

    currentCategory = category;
    const contentArea = document.getElementById('contentArea');

    // ❗ SAFETY: Category not implemented yet
    if (!commands[category]) {
        renderComingSoon(category);
        return;
    }

    const data = commands[category];

    // Close filter dropdown if open
    const dropdown = document.getElementById('filterOptions');
    if (dropdown) dropdown.classList.remove('show');

    let html = `
        <div class="content-header">
            <div class="content-header-left">
                <h1>${data.title}</h1>
                <p>${data.description}</p>
    `;

    /* ================= CATEGORY TAGS ================= */

    if (data.categoryTags?.length) {
        html += `
            <div class="category-tags">
                <div class="category-tag ${selectedTag === 'all' ? 'active' : ''}"
                     data-tag="all"
                     onclick="filterByTag('all', '${category}')">
                    All
                </div>
        `;

        data.categoryTags.forEach(tag => {
            html += `
                <div class="category-tag ${selectedTag === tag.id ? 'active' : ''}"
                     data-tag="${tag.id}"
                     onclick="filterByTag('${tag.id}', '${category}')">
                    ${tag.name}
                </div>
            `;
        });

        html += `</div>`;
    }

    /* ================= FILTER DROPDOWN ================= */

    html += `
            </div>
            <div class="filter-dropdown">
                <button class="filter-btn" onclick="toggleFilter()">
                    Filter by:
                    <strong>${currentFilter === 'commands' ? 'Commands' : 'Steps/Flow'}</strong> ▼
                </button>
                <div class="filter-options" id="filterOptions">
                    <div class="filter-option ${currentFilter === 'commands' ? 'active' : ''}"
                         onclick="changeFilter('commands', '${category}')">Commands</div>
                    <div class="filter-option ${currentFilter === 'steps' ? 'active' : ''}"
                         onclick="changeFilter('steps', '${category}')">Steps/Flow</div>
                </div>
            </div>
        </div>
        <div class="commands-grid">
    `;

    /* ================= COMMAND VIEW ================= */

    if (currentFilter === 'commands') {

        const filteredCommands =
            selectedTag === 'all'
                ? data.commands
                : data.commands.filter(cmd => cmd.category === selectedTag);

        if (!filteredCommands.length) {
            html += renderEmptyCard("No Commands Found", "No commands available for this category.");
        } else {
            filteredCommands.forEach(cmd => {
                html += `
                    <div class="command-card">
                        <div class="command-header">
                            <div class="command-name">${cmd.name}</div>
                            <div class="command-description">${cmd.description}</div>
                        </div>

                        <pre class="command-syntax">
<code>${cmd.syntax}</code>
<button class="copy-btn"
 onclick="copyToClipboard('${cmd.syntax.replace(/'/g, "\\'")}', this)">Copy</button>
                        </pre>

                        <div class="flags-section">
                            <div class="section-title">Essential Flags / Options</div>
                            <div class="flags-grid">
                `;

                cmd.flags.forEach(flag => {
                    html += `
                        <div class="flag-item">
                            <div class="flag-name">${flag.name}</div>
                            <div class="flag-description">${flag.desc}</div>
                        </div>
                    `;
                });

                html += `
                            </div>
                        </div>

                        <div class="example-section">
                            <div class="example-title">Example Usage</div>
                            <div class="example-code"><code>${cmd.example}</code></div>
                            <div class="example-explanation">
                                <strong>Explanation:</strong> ${cmd.explanation}
                            </div>
                        </div>
                    </div>
                `;
            });
        }

    /* ================= STEP VIEW ================= */

    } else {

        const filteredSteps =
            selectedTag === 'all'
                ? data.steps || []
                : (data.steps || []).filter(step => step.category === selectedTag);

        if (!filteredSteps.length) {
            html += renderEmptyCard(
                "No Step-by-Step Guides Found",
                "Switch to Commands view to explore commands."
            );
        } else {
            filteredSteps.forEach(flow => {
                html += `
                    <div class="command-card">
                        <div class="command-header">
                            <div class="command-name">${flow.name}</div>
                            <div class="command-description">${flow.description}</div>
                        </div>
                        <div class="flags-section">
                `;

                flow.stepsContent.forEach(step => {
                    html += `
                        <div class="flag-item">
                            <div class="flag-name">Step ${step.step}: ${step.title}</div>
                            <div class="example-code"><code>${step.command}</code></div>
                            <div class="flag-description">${step.explanation}</div>
                        </div>
                    `;
                });

                html += `
                        </div>
                    </div>
                `;
            });
        }
    }

    html += `</div>`;

    // 🔥 Animated content swap
    contentArea.classList.remove('fade-in');
    void contentArea.offsetWidth;
    contentArea.innerHTML = html;
    contentArea.classList.add('fade-in');
}


/* =========================================================
   EMPTY / COMING SOON UI
   ========================================================= */

function renderComingSoon(category) {
    const contentArea = document.getElementById('contentArea');

    contentArea.innerHTML = `
        <div class="empty-state fade-in">
            <div class="empty-icon">🚧</div>
            <h1>${category.toUpperCase()} – Coming Soon</h1>
            <p>This section hasn’t been added yet.</p>
            <div class="empty-hint">💡 Select another topic from the sidebar</div>
        </div>
    `;
}


/* =========================================================
   HELPERS
   ========================================================= */

function renderEmptyCard(title, desc) {
    return `
        <div class="command-card">
            <div class="command-header">
                <div class="command-name">${title}</div>
                <div class="command-description">${desc}</div>
            </div>
        </div>
    `;
}


/* =========================================================
   FILTERS
   ========================================================= */

function filterByTag(tagId, category) {
    selectedTag = tagId;
    loadContent(category, false);
}

function toggleFilter() {
    document.getElementById('filterOptions')?.classList.toggle('show');
}

function changeFilter(type, category) {
    currentFilter = type;
    document.getElementById('filterOptions')?.classList.remove('show');
    loadContent(category, false);
}

window.addEventListener('click', e => {
    if (!e.target.closest('.filter-dropdown')) {
        document.getElementById('filterOptions')?.classList.remove('show');
    }
});


/* =========================================================
   COPY
   ========================================================= */

function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const original = button.textContent;
        button.textContent = 'Copied!';
        setTimeout(() => button.textContent = original, 1200);
    });
}


/* =========================================================
   SEARCH
   ========================================================= */

document.getElementById('searchInput')?.addEventListener('input', e => {
    const term = e.target.value.toLowerCase().trim();
    document.querySelectorAll('.command-card').forEach(card => {
        card.style.display = card.textContent.toLowerCase().includes(term)
            ? 'block'
            : 'none';
    });
});


/* =========================================================
   SIDEBAR
   ========================================================= */

const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleSidebar');
const container = document.querySelector('.container');

toggleBtn.addEventListener('click', e => {
    e.stopPropagation();
    sidebar.classList.toggle('hidden');
    container.classList.toggle('sidebar-collapsed');
});

document.addEventListener('click', e => {
    if (window.innerWidth <= 1024 &&
        !sidebar.contains(e.target) &&
        !toggleBtn.contains(e.target)) {

        sidebar.classList.add('hidden');
        container.classList.add('sidebar-collapsed');
    }
});


/* =========================================================
   SIDEBAR MENU
   ========================================================= */

document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.menu-item')
            .forEach(i => i.classList.remove('active'));

        item.classList.add('active');
        currentFilter = 'commands';

        loadContent(item.dataset.category, true);

        if (window.innerWidth <= 1024) {
            sidebar.classList.add('hidden');
            container.classList.add('sidebar-collapsed');
        }
    });
});

/* =========================================================
   ABOUT & CONTACT SECTIONS
   ========================================================= */

function clearActiveMenu() {
    document.querySelectorAll('.menu-item')
        .forEach(item => item.classList.remove('active'));
}

function openAbout() {
    clearActiveMenu();
    currentCategory = null;

    const content = document.getElementById('contentArea');
    content.classList.remove('fade-in');
    void content.offsetWidth;

    content.innerHTML = `
        <div class="empty-state fade-in">
            <h1>About This Project</h1>
            <p>
                Command Cheat Sheet is a personal documentation project
                designed for quick, practical reference across
                system administration, networking, security,
                and development workflows.
            </p>
            <p>
                The focus is on clarity, real-world usage,
                and structured understanding — not memorization.
            </p>
        </div>
    `;
}

function openContact() {
    clearActiveMenu();
    currentCategory = null;

    const content = document.getElementById('contentArea');
    content.classList.remove('fade-in');
    void content.offsetWidth;

    content.innerHTML = `
        <div class="empty-state fade-in">
            <h1>Contact</h1>
            <p>
                Have suggestions, feedback, or ideas to improve this project?
            </p>
            <p>
                📧 Email: <strong>yourname@email.com</strong><br>
                💼 GitHub: <strong>github.com/yourprofile</strong>
            </p>
        </div>
    `;
}


/* =========================================================
   INITIAL LOAD
   ========================================================= */

loadContent('windows', true);
