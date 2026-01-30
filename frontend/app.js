const API_BASE = window.location.origin;

function showTab(tabName) {

    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));


    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(btn => btn.classList.remove('active'));

    const tabToShow = document.getElementById(tabName + 'Tab'); 
    if(tabToShow) {
        tabToShow.classList.add('active');
    }

    const btnToActivate = Array.from(buttons).find(btn => btn.getAttribute('onclick').includes(tabName));
    if(btnToActivate) btnToActivate.classList.add('active');
}




//////////////////////////////////////////////////////

const API_URL = `${API_BASE}/api/tasks`;
let selectedTaskId = null;





function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
        return;
    }

    document.getElementById("loginPanel").style.display = "none";
    document.getElementById("mainPanel").style.display = "block";
    document.getElementById("currentUser").innerText = username;

    loadTasks();
    loadProjects();
    fillCommentsTaskSelect();
}

function logout() {
    location.reload();
}


async function loadTasks() {
    try {
        const response = await fetch(API_URL);
        const tasks = await response.json();
        renderTaskTable(tasks);
        updateStats(tasks);
        fillCommentsTaskSelect();
    } catch (error) {
        console.error("Error loading tasks:", error);
    }
}


function renderTaskTable(tasks) {
    const tbody = document.getElementById("tasksTableBody");
    tbody.innerHTML = "";

    tasks.forEach(task => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${task._id}</td>
            <td>${task.title}</td>
            <td>${task.status}</td>
            <td>${task.priority}</td>
            <td>${task.projectName || "-"}</td>
            <td>${task.assignedTo || "-"}</td>
            <td>${task.dueDate ? task.dueDate.split("T")[0] : "-"}</td>
        `;

        tr.onclick = () => selectTask(task);
        tbody.appendChild(tr);
    });
}

function selectTask(task) {
    selectedTaskId = task._id;

    document.getElementById("taskTitle").value = task.title;
    document.getElementById("taskDescription").value = task.description || "";
    document.getElementById("taskStatus").value = task.status;
    document.getElementById("taskPriority").value = task.priority;
    document.getElementById("taskProject").value = task.projectId || "";
    document.getElementById("taskAssigned").value = task.assignedToId || "";
    document.getElementById("taskDueDate").value =
        task.dueDate ? task.dueDate.split("T")[0] : "";
    document.getElementById("taskHours").value =
        task.estimatedHours || "";
}


function getTaskFromForm() {
    const projectValue = document.getElementById("taskProject").value;

    return {
        title: document.getElementById("taskTitle").value,
        description: document.getElementById("taskDescription").value,
        status: document.getElementById("taskStatus").value,
        priority: document.getElementById("taskPriority").value,
        dueDate: document.getElementById("taskDueDate").value || null,
        estimatedHours: Number(document.getElementById("taskHours").value) || 0,
        project: projectValue !== "" ? projectValue : null, 
        assignedTo: "admin",   
    };
}

async function addTask() {
    const task = getTaskFromForm();

    if (!task.title) {
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task)
        });

        if (!response.ok) {
            const err = await response.json();
            console.error("Error adding task:", err);
            return;
        }

        const createdTask = await response.json();

 
        clearTaskForm();
        loadTasks();

        console.log("Task created successfully:", createdTask);
    } catch (error) {
        console.error("Error adding task:", error);
    }
}



async function updateTask() {
    if (!selectedTaskId) {
        return;
    }

    const task = getTaskFromForm();

    try {
        await fetch(`${API_URL}/${selectedTaskId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task)
        });

        clearTaskForm();
        loadTasks();
    } catch (error) {
        console.error("Error updating task:", error);
    }
}


async function deleteTask() {
    if (!selectedTaskId) {
        return;
    }

    if (!confirm("Delete this task?")) return;

    try {
        await fetch(`${API_URL}/${selectedTaskId}`, {
            method: "DELETE"
        });

        clearTaskForm();
        loadTasks();
    } catch (error) {
        console.error("Error deleting task:", error);
    }
}


function clearTaskForm() {
    selectedTaskId = null;

    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDescription").value = "";
    document.getElementById("taskStatus").value = "Pending";
    document.getElementById("taskPriority").value = "Medium";
    document.getElementById("taskDueDate").value = "";
    document.getElementById("taskHours").value = "";
}


function updateStats(tasks) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "Completed").length;
    const pending = tasks.filter(t => t.status === "Pending").length;

    document.getElementById("statsText").innerText =
        `Total: ${total} | Pending: ${pending} | Completed: ${completed}`;
}


document.addEventListener("DOMContentLoaded", () => {
    // Event listeners for advanced search
    const filterBtn = document.getElementById("filterBtn");
    const clearFilterBtn = document.getElementById("clearFilterBtn");
    
    if (filterBtn) {
        filterBtn.addEventListener("click", searchTasks);
    }
    
    if (clearFilterBtn) {
        clearFilterBtn.addEventListener("click", clearSearchFilters);
    }
});



const PROJECTS_API = `${API_BASE}/api/projects`;

let selectedProjectId = null;

/*************************
 * LOAD PROJECTS (GET)
 *************************/
async function loadProjects() {
    try {
        const response = await fetch(PROJECTS_API);
        const projects = await response.json();
        renderProjectsTable(projects);
        fillProjectsSelect(projects);
    } catch (error) {
        console.error("Error loading projects:", error);
    }
}

/*************************
 * RENDER PROJECTS TABLE
 *************************/
function renderProjectsTable(projects) {
    const tbody = document.getElementById("projectsTableBody");
    tbody.innerHTML = "";

    projects.forEach(project => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${project._id}</td>
            <td>${project.name}</td>
            <td>${project.description || "-"}</td>
        `;

        tr.onclick = () => selectProject(project);
        tbody.appendChild(tr);
    });
}

/*************************
 * SELECT PROJECT
 *************************/
function selectProject(project) {
    selectedProjectId = project._id;

    document.getElementById("projectName").value = project.name;
    document.getElementById("projectDescription").value = project.description || "";
}

/*************************
 * FORM → PROJECT OBJECT
 *************************/
function getProjectFromForm() {
    return {
        name: document.getElementById("projectName").value,
        description: document.getElementById("projectDescription").value
    };
}

/*************************
 * ADD PROJECT (POST)
 *************************/
async function addProject() {
    const project = getProjectFromForm();

    if (!project.name) {
        return;
    }

    try {
        await fetch(PROJECTS_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(project)
        });

        clearProjectForm();
        loadProjects();
    } catch (error) {
        console.error("Error adding project:", error);
    }
}

/*************************
 * UPDATE PROJECT (PUT)
 *************************/
async function updateProject() {
    if (!selectedProjectId) {
        return;
    }

    const project = getProjectFromForm();

    try {
        await fetch(`${PROJECTS_API}/${selectedProjectId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(project)
        });

        clearProjectForm();
        loadProjects();
    } catch (error) {
        console.error("Error updating project:", error);
    }
}

/*************************
 * DELETE PROJECT
 *************************/
async function deleteProject() {
    if (!selectedProjectId) {
        return;
    }

    if (!confirm("Delete this project?")) return;

    try {
        await fetch(`${PROJECTS_API}/${selectedProjectId}`, {
            method: "DELETE"
        });

        clearProjectForm();
        loadProjects();
    } catch (error) {
        console.error("Error deleting project:", error);
    }
}

/*************************
 * CLEAR PROJECT FORM
 *************************/
function clearProjectForm() {
    selectedProjectId = null;
    document.getElementById("projectName").value = "";
    document.getElementById("projectDescription").value = "";
}

/*************************
 * FILL SELECTS (Tasks/Search)
 *************************/
function fillProjectsSelect(projects) {
    const taskSelect = document.getElementById("taskProject");
    const searchSelect = document.getElementById("searchProject");

    if (taskSelect) {
        taskSelect.innerHTML = `<option value="">-- No Project --</option>`;
        projects.forEach(p => {
            taskSelect.innerHTML += `<option value="${p._id}">${p.name}</option>`;
        });
    }

    if (searchSelect) {
        searchSelect.innerHTML = `<option value="">All</option>`;
        projects.forEach(p => {
            searchSelect.innerHTML += `<option value="${p._id}">${p.name}</option>`;
        });
    }
}


////////////////////////////////////////////////////////////
const API_URL_COMMENTS = `${API_BASE}/api/comments`;

// Fill task dropdown in comments
async function fillCommentsTaskSelect() {
    try {
        const response = await fetch(API_URL);
        const tasks = await response.json();
        const select = document.getElementById("commentTaskSelect");
        
        select.innerHTML = `<option value="">-- Select a task --</option>`;
        tasks.forEach(task => {
            select.innerHTML += `<option value="${task._id}">${task.title}</option>`;
        });
    } catch (error) {
        console.error("Error loading tasks for comments:", error);
    }
}

// Select task from dropdown
function selectCommentTask() {
    const taskId = document.getElementById("commentTaskSelect").value;
    document.getElementById("commentTaskId").value = taskId;
    
    if (taskId) {
        loadComments(taskId);
    }
}

// Add a comment
async function addComment() {
    const taskId = document.getElementById("commentTaskId").value.trim();
    const text = document.getElementById("commentText").value.trim();

    if (!taskId || !text) {
        return;
    }

    try {
        const response = await fetch(API_URL_COMMENTS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task: taskId, comment: text })
        });

        if (!response.ok) throw new Error("Error adding comment");

        document.getElementById("commentText").value = "";
        loadComments(taskId);
    } catch (error) {
        console.error(error);
    }
}

// Load comments for a specific task
async function loadComments(specificTaskId = null) {
    let taskId = specificTaskId;

    if (!taskId) {
        taskId = document.getElementById("commentTaskId").value.trim();
    }

    if (!taskId) {
        return;
    }

    try {
        const response = await fetch(`${API_URL_COMMENTS}/${taskId}`);
        if (!response.ok) throw new Error("Error loading comments");

        const comments = await response.json();
        const commentsArea = document.getElementById("commentsArea");
        commentsArea.value = "";

        if (comments.length === 0) {
            commentsArea.value = "No comments for this task.";
        } else {
            comments.forEach(c => {
                commentsArea.value += `Comment ID: ${c._id}\nText: ${c.comment}\nDate: ${new Date(c.createdAt).toLocaleString()}\n---------------------\n`;
            });
        }
    } catch (error) {
        console.error(error);
    }
}

///////////////////////////////////////////////////////////////////////////
// // URL base para historial
// const API_URL_HISTORY = "http://localhost:7369/api/history";

// async function loadHistory() {
//     const taskId = document.getElementById("historyTaskId").value.trim();

//     if (!taskId) {
//         alert("Debes ingresar un ID de tarea válido");
//         return;
//     }

//     try {
//         // Ajuste aquí: quitar 'task/' si tu backend no lo requiere
//         const response = await fetch(`${API_URL_HISTORY}/${taskId}`);
//         if (!response.ok) throw new Error("Error al cargar historial");

//         const history = await response.json();
//         const historyArea = document.getElementById("historyArea");
//         historyArea.value = "";

//         if (history.length === 0) {
//             historyArea.value = "No hay historial para esta tarea.";
//         } else {
//             history.forEach(h => {
//                 historyArea.value += 
//                     `Acción: ${h.action}\n` +
//                     `Detalles: ${h.details}\n` +
//                     `Fecha: ${new Date(h.date).toLocaleString()}\n` +
//                     `---------------------\n`;
//             });
//         }
//     } catch (error) {
//         console.error(error);
//         alert("No se pudo cargar el historial");
//     }
// }

// // Cargar todo el historial
// async function loadAllHistory() {
//     try {
//         const response = await fetch(API_URL_HISTORY);
//         if (!response.ok) throw new Error("Error al cargar todo el historial");

//         const history = await response.json();
//         const historyArea = document.getElementById("historyArea");
//         historyArea.value = "";

//         if (history.length === 0) {
//             historyArea.value = "No hay historial registrado.";
//         } else {
//             history.forEach(h => {
//                 historyArea.value += 
//                     `Tarea: ${h.task}\n` +
//                     `Acción: ${h.action}\n` +
//                     `Detalles: ${h.details}\n` +
//                     `Fecha: ${new Date(h.date).toLocaleString()}\n` +
//                     `---------------------\n`;
//             });
//         }
//     } catch (error) {
//         console.error(error);
//         alert("No se pudo cargar todo el historial");
//     }
// }


////////////////////////////////////////////

const API_URL_REPORTS = `${API_BASE}/api/reports`;

// Generate report based on type
async function generateReport(type) {
    const reportsArea = document.getElementById("reportsArea");
    reportsArea.value = "Loading report...";

    let url = "";

    switch(type) {
        case "tasks":
            url = `${API_URL_REPORTS}/tasks`;
            break;
        case "projects":
            url = `${API_URL_REPORTS}/projects`;
            break;
        case "users":
            url = `${API_URL_REPORTS}/users`;
            break;
        default:
            reportsArea.value = "Invalid report type";
            return;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error generating report");

        const data = await response.json();
        reportsArea.value = formatReport(type, data);
    } catch (error) {
        console.error(error);
        reportsArea.value = "Could not generate the report";
    }
}

// Helper function to display the report in a readable format
function formatReport(type, data) {
    let output = "";

    switch(type) {
        case "tasks":
            output += `--- TASK REPORT ---\n`;
            output += `Total Tasks: ${data.totalTasks}\n`;
            output += `Completed Tasks: ${data.completedTasks}\n`;
            output += `Pending Tasks: ${data.pendingTasks}\n`;
            break;
        case "projects":
            output += `--- PROJECT REPORT ---\n`;
            output += `Total Projects: ${data.totalProjects}\n`;
            break;
        case "users":
            output += `--- USER REPORT ---\n`;
            output += `Active Users: ${data.activeUsers}\n`;
            break;
    }

    return output;
}

// Export to CSV
function exportCSV() {
    const text = document.getElementById("reportsArea").value;
    if (!text) {
        return;
    }

    const blob = new Blob([text], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "report.csv");
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


/////////////////////////////////////////////////////

// Function to clear search filters
function clearSearchFilters() {
    document.getElementById("searchText").value = "";
    document.getElementById("searchStatus").value = "";
    document.getElementById("searchPriority").value = "";
    document.getElementById("searchProject").value = "";
    
    // Clear results table
    const tbody = document.getElementById("searchTableBody");
    tbody.innerHTML = "";
}

// Function to search tasks based on filters
async function searchTasks() {
    try {
        const searchText = document.getElementById("searchText").value.trim();
        const searchStatus = document.getElementById("searchStatus").value;
        const searchPriority = document.getElementById("searchPriority").value;
        const searchProject = document.getElementById("searchProject").value;

        // Build search parameters
        const params = new URLSearchParams();

        if (searchText) params.append("text", searchText);
        if (searchStatus) params.append("status", searchStatus);
        if (searchPriority) params.append("priority", searchPriority);
        if (searchProject) params.append("project", searchProject);

        const url = `${API_BASE}/api/tasks/search?${params.toString()}`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error("Error searching tasks");

        const tasks = await response.json();

        // Clear the table
        const tbody = document.getElementById("searchTableBody");
        tbody.innerHTML = "";

        if (tasks.length === 0) {
            const row = document.createElement("tr");
            row.innerHTML = `<td colspan="5" class="text-center">No results found</td>`;
            tbody.appendChild(row);
            return;
        }

        // Fill the table with results
        tasks.forEach(task => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${task._id}</td>
                <td>${task.title}</td>
                <td>${task.status}</td>
                <td>${task.priority}</td>
                <td>${task.projectName || "-"}</td>
            `;
            tbody.appendChild(row);
        });

    } catch (error) {
        console.error(error);
    }
}
