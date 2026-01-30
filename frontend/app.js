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
        alert("Usuario y contraseña requeridos");
        return;
    }

    document.getElementById("loginPanel").style.display = "none";
    document.getElementById("mainPanel").style.display = "block";
    document.getElementById("currentUser").innerText = username;

    loadTasks();
    loadProjects();
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
    } catch (error) {
        console.error("Error al cargar tareas:", error);
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
            <td>-</td>
            <td>-</td>
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
    document.getElementById("taskDueDate").value =
        task.dueDate ? task.dueDate.split("T")[0] : "";
    document.getElementById("taskHours").value =
        task.estimatedHours || "";
}


function getTaskFromForm() {
    const projectValue = document.getElementById("taskProject").value; // select de proyecto

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
        alert("El título es obligatorio");
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
            console.error("Error al agregar tarea:", err);
            alert("Error al agregar tarea: " + (err.message || "Revisa la consola"));
            return;
        }

        const createdTask = await response.json();

 
        clearTaskForm();
        loadTasks();

        console.log("Tarea creada correctamente:", createdTask);
    } catch (error) {
        console.error("Error al agregar tarea:", error);
        alert("Error al agregar tarea: revisa la consola");
    }
}



async function updateTask() {
    if (!selectedTaskId) {
        alert("Selecciona una tarea");
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
        console.error("Error al actualizar tarea:", error);
    }
}


async function deleteTask() {
    if (!selectedTaskId) {
        alert("Selecciona una tarea");
        return;
    }

    if (!confirm("¿Eliminar esta tarea?")) return;

    try {
        await fetch(`${API_URL}/${selectedTaskId}`, {
            method: "DELETE"
        });

        clearTaskForm();
        loadTasks();
    } catch (error) {
        console.error("Error al eliminar tarea:", error);
    }
}


function clearTaskForm() {
    selectedTaskId = null;

    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDescription").value = "";
    document.getElementById("taskStatus").value = "Pendiente";
    document.getElementById("taskPriority").value = "Media";
    document.getElementById("taskDueDate").value = "";
    document.getElementById("taskHours").value = "";
}


function updateStats(tasks) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "Completada").length;
    const pending = tasks.filter(t => t.status === "Pendiente").length;

    document.getElementById("statsText").innerText =
        `Total: ${total} | Pendientes: ${pending} | Completadas: ${completed}`;
}


document.addEventListener("DOMContentLoaded", () => {
    // No auto-load, espera login
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
        console.error("Error al cargar proyectos:", error);
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
        alert("El nombre del proyecto es obligatorio");
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
        console.error("Error al agregar proyecto:", error);
    }
}

/*************************
 * UPDATE PROJECT (PUT)
 *************************/
async function updateProject() {
    if (!selectedProjectId) {
        alert("Selecciona un proyecto");
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
        console.error("Error al actualizar proyecto:", error);
    }
}

/*************************
 * DELETE PROJECT
 *************************/
async function deleteProject() {
    if (!selectedProjectId) {
        alert("Selecciona un proyecto");
        return;
    }

    if (!confirm("¿Eliminar este proyecto?")) return;

    try {
        await fetch(`${PROJECTS_API}/${selectedProjectId}`, {
            method: "DELETE"
        });

        clearProjectForm();
        loadProjects();
    } catch (error) {
        console.error("Error al eliminar proyecto:", error);
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
        taskSelect.innerHTML = `<option value="">-- Sin proyecto --</option>`;
        projects.forEach(p => {
            taskSelect.innerHTML += `<option value="${p._id}">${p.name}</option>`;
        });
    }

    if (searchSelect) {
        searchSelect.innerHTML = `<option value="">Todos</option>`;
        projects.forEach(p => {
            searchSelect.innerHTML += `<option value="${p._id}">${p.name}</option>`;
        });
    }
}


////////////////////////////////////////////////////////////
const API_URL_COMMENTS = `${API_BASE}/api/comments`;

// Agregar un comentario
async function addComment() {
    const taskId = document.getElementById("commentTaskId").value.trim();
    const text = document.getElementById("commentText").value.trim();

    if (!taskId || !text) {
        alert("Debes ingresar ID de tarea y comentario");
        return;
    }

    try {
        const response = await fetch(API_URL_COMMENTS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task: taskId, comment: text })
        });

        if (!response.ok) throw new Error("Error al agregar comentario");

        alert("Comentario agregado exitosamente");
        document.getElementById("commentText").value = "";
        loadComments(taskId);
    } catch (error) {
        console.error(error);
        alert("No se pudo agregar el comentario");
    }
}

// Cargar comentarios de una tarea específica
async function loadComments(specificTaskId = null) {
    let taskId = specificTaskId;

    if (!taskId) {
        taskId = document.getElementById("commentTaskId").value.trim();
    }

    if (!taskId) {
        alert("Debes ingresar un ID de tarea válido para cargar comentarios");
        return;
    }

    try {
        const response = await fetch(`${API_URL_COMMENTS}/${taskId}`);
        if (!response.ok) throw new Error("Error al cargar comentarios");

        const comments = await response.json();
        const commentsArea = document.getElementById("commentsArea");
        commentsArea.value = "";

        if (comments.length === 0) {
            commentsArea.value = "No hay comentarios para esta tarea.";
        } else {
            comments.forEach(c => {
                commentsArea.value += `ID Comentario: ${c._id}\nTexto: ${c.comment}\nFecha: ${new Date(c.createdAt).toLocaleString()}\n---------------------\n`;
            });
        }
    } catch (error) {
        console.error(error);
        alert("No se pudieron cargar los comentarios");
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

// Generar reporte según tipo
async function generateReport(type) {
    const reportsArea = document.getElementById("reportsArea");
    reportsArea.value = "Cargando reporte...";

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
            reportsArea.value = "Tipo de reporte no válido";
            return;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error al generar reporte");

        const data = await response.json();
        reportsArea.value = formatReport(type, data);
    } catch (error) {
        console.error(error);
        reportsArea.value = "No se pudo generar el reporte";
    }
}

// Función auxiliar para mostrar el reporte de forma legible
function formatReport(type, data) {
    let output = "";

    switch(type) {
        case "tasks":
            output += `--- REPORTE DE TAREAS ---\n`;
            output += `Total de Tareas: ${data.totalTasks}\n`;
            output += `Tareas Completadas: ${data.completedTasks}\n`;
            output += `Tareas Pendientes: ${data.pendingTasks}\n`;
            break;
        case "projects":
            output += `--- REPORTE DE PROYECTOS ---\n`;
            output += `Total de Proyectos: ${data.totalProjects}\n`;
            break;
        case "users":
            output += `--- REPORTE DE USUARIOS ---\n`;
            output += `Usuarios Activos: ${data.activeUsers}\n`;
            break;
    }

    return output;
}

// Exportar a CSV opcional
function exportCSV() {
    const text = document.getElementById("reportsArea").value;
    if (!text) {
        alert("Primero genera un reporte para exportar");
        return;
    }

    const blob = new Blob([text], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "reporte.csv");
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


/////////////////////////////////////////////////////

// Función para buscar tareas según los filtros
async function searchTasks() {
    try {
        const searchText = document.getElementById("searchText").value.trim();
        const searchStatus = document.getElementById("searchStatus").value;
        const searchPriority = document.getElementById("searchPriority").value;
        const searchProject = document.getElementById("searchProject").value;

        // Construimos los parámetros de búsqueda
        const params = new URLSearchParams();

        if (searchText) params.append("text", searchText);
        if (searchStatus) params.append("status", searchStatus);
        if (searchPriority) params.append("priority", searchPriority);
        if (searchProject && searchProject !== "0") params.append("project", searchProject);

        const response = await fetch( `${API_BASE}/api/tasks/search?${params.toString()}`);
        
        if (!response.ok) throw new Error("Error al buscar tareas");

        const tasks = await response.json();

        // Limpiamos la tabla
        const tbody = document.getElementById("searchTableBody");
        tbody.innerHTML = "";

        // Llenamos la tabla con los resultados
        tasks.forEach(task => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${task._id}</td>
                <td>${task.title}</td>
                <td>${task.status}</td>
                <td>${task.priority}</td>
                <td>${task.projectName || ""}</td>
            `;
            tbody.appendChild(row);
        });

    } catch (error) {
        alert(error.message);
        console.error(error);
    }
}
