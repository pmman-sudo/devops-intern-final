/* =========================================================
   CATEGORY REGISTRY
   Single source of truth for all category IDs
   ========================================================= */

const CATEGORY = {
    FILE_PERMISSIONS: "file-permissions",
    USER_MANAGEMENT: "user-management",
    NETWORK_TOOLS: "network-tools",
    SYSTEM_INFO: "system-info",
    PROCESS_MANAGEMENT: "process-management",
    SYSTEM_ADMIN: "system-admin",
    SYSTEM_CONFIG: "system-config",
    DISK_MANAGEMENT: "disk-management",
    DIAGNOSTICS: "diagnostics",
    DNS_TOOLS: "dns-tools",
    CONNECTIVITY: "connectivity",
    PORT_SCANNING: "port-scanning",
    SSL_TLS: "ssl-tls",
    VULNERABILITY: "vulnerability",
    REPOSITORY: "repository",
    BRANCHING: "branching",
    COLLABORATION: "collaboration",
    CONTAINERS: "containers",
    IMAGES: "images",
    NETWORKING: "networking",
    DATABASE: "database",
    QUERIES: "queries",
    USER_MGMT: "user-mgmt",
    BACKUP: "backup"
};


/* =========================================================
   COMMAND DATABASE
   ========================================================= */

const commands = {

    /* ===================== WINDOWS ====================== */

    windows: {
        title: "Windows Commands",
        description: "Essential Windows command-line utilities and PowerShell commands.",

        categoryTags: [
            { id: CATEGORY.FILE_PERMISSIONS, name: "File Permissions" },
            { id: CATEGORY.USER_MANAGEMENT, name: "User & Group Management" },
            { id: CATEGORY.NETWORK_TOOLS, name: "Network Tools" },
            { id: CATEGORY.SYSTEM_INFO, name: "System Information" }
        ],

        steps: [
            {
                name: "Setting Up File Permissions",
                description: "Complete workflow for configuring NTFS permissions.",
                category: CATEGORY.FILE_PERMISSIONS,
                stepsContent: [
                    { step: "1", title: "Check Current Permissions", command: "icacls C:\\Project", explanation: "View existing permissions." },
                    { step: "2", title: "Grant User Access", command: "icacls C:\\Project /grant Administrator:F", explanation: "Grant full control." },
                    { step: "3", title: "Apply Recursively", command: "icacls C:\\Project /grant Administrator:F /t", explanation: "Apply to subfolders." },
                    { step: "4", title: "Verify", command: "icacls C:\\Project", explanation: "Confirm changes." }
                ]
            }
        ],

        commands: [
            {
                name: "icacls",
                description: "Display or modify access control lists (ACLs).",
                syntax: "icacls <File/Folder> /grant <User>:<Permissions>",
                category: CATEGORY.FILE_PERMISSIONS,
                flags: [
                    { name: "/grant", desc: "Grant permissions." },
                    { name: "/deny", desc: "Deny permissions." },
                    { name: "/remove", desc: "Remove permissions." },
                    { name: "/t", desc: "Apply recursively." }
                ],
                example: "icacls C:\\Project /grant Administrator:F /t",
                explanation: "Gives Administrator full control recursively."
            },
            {
                name: "net user",
                description: "Manage local user accounts.",
                syntax: "net user [username] [password] /add",
                category: CATEGORY.USER_MANAGEMENT,
                flags: [
                    { name: "/add", desc: "Add a user." },
                    { name: "/delete", desc: "Delete a user." }
                ],
                example: "net user john Pass123! /add",
                explanation: "Creates a new user account."
            }
        ]
    },

    /* ===================== LINUX ====================== */

    linux: {
        title: "Linux Commands",
        description: "Common Linux/Unix commands for system administration.",

        categoryTags: [
            { id: CATEGORY.FILE_PERMISSIONS, name: "File Permissions" },
            { id: CATEGORY.USER_MANAGEMENT, name: "User & Group Management" },
            { id: CATEGORY.PROCESS_MANAGEMENT, name: "Process Management" },
            { id: CATEGORY.SYSTEM_ADMIN, name: "System Administration" }
        ],

        commands: [
            {
                name: "chmod",
                description: "Change file permissions.",
                syntax: "chmod [options] mode file",
                category: CATEGORY.FILE_PERMISSIONS,
                flags: [
                    { name: "-R", desc: "Recursive." },
                    { name: "-v", desc: "Verbose." }
                ],
                example: "chmod 755 script.sh",
                explanation: "Sets rwx for owner, rx for others."
            },
            {
                name: "ps",
                description: "Process status.",
                syntax: "ps aux",
                category: CATEGORY.PROCESS_MANAGEMENT,
                flags: [
                    { name: "aux", desc: "All processes." }
                ],
                example: "ps aux | grep nginx",
                explanation: "Shows nginx processes."
            }
        ]
    },

    /* ===================== DOCKER ====================== */

    docker: {
        title: "Docker Commands",
        description: "Container management with Docker.",

        categoryTags: [
            { id: CATEGORY.CONTAINERS, name: "Containers" },
            { id: CATEGORY.IMAGES, name: "Images" },
            { id: CATEGORY.NETWORKING, name: "Networking" }
        ],

        commands: [
            {
                name: "docker run",
                description: "Run a container.",
                syntax: "docker run [options] image",
                category: CATEGORY.CONTAINERS,
                flags: [
                    { name: "-d", desc: "Detached mode." },
                    { name: "-p", desc: "Port mapping." }
                ],
                example: "docker run -d -p 8080:80 nginx",
                explanation: "Runs nginx container."
            }
        ]
    }

    // 👉 You can safely add more sections here (git, mysql, k8s, aws, etc.)
};


/* =========================================================
   DATA VALIDATION (DEV SAFETY NET)
   Warns you if category IDs are wrong
   ========================================================= */

(function validateCommands() {
    Object.entries(commands).forEach(([sectionName, section]) => {
        const validCategories = new Set(
            (section.categoryTags || []).map(tag => tag.id)
        );

        section.commands?.forEach(cmd => {
            if (!validCategories.has(cmd.category)) {
                console.warn(
                    `[commands.js] Invalid category "${cmd.category}" in command "${cmd.name}" (${sectionName})`
                );
            }
        });

        section.steps?.forEach(step => {
            if (!validCategories.has(step.category)) {
                console.warn(
                    `[commands.js] Invalid category "${step.category}" in steps "${step.name}" (${sectionName})`
                );
            }
        });
    });
})();
