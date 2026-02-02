// URL Base de la API
const API_URL = '/api';

// --- Funciones de Autenticación ---

// Función para enviar los datos de login al servidor
async function manejarLogin(e) {
    e.preventDefault(); // Evitar que el formulario recargue la página
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');

    try {
        // Enviar petición POST con fetch
        const respuesta = await fetch(`${API_URL}/auth/iniciarSesion`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const datos = await respuesta.json(); // Convertir respuesta a JSON

        if (respuesta.ok) {
            // Si el login es correcto, ir al dashboard
            window.location.href = 'dashboard.html';
        } else {
            // Si falla, mostrar error
            errorMsg.textContent = datos.error || 'Error al iniciar sesión';
            errorMsg.style.display = 'block';
        }
    } catch (err) {
        console.error(err);
        errorMsg.textContent = 'Error de conexión';
        errorMsg.style.display = 'block';
    }
}

// Función para cerrar la sesión actual
async function manejarLogout() {
    try {
        await fetch(`${API_URL}/auth/cerrarSesion`, { method: 'POST' });
        window.location.href = 'index.html'; // Volver al login
    } catch (err) {
        console.error(err);
    }
}

// Verificar si el usuario ya está logueado al cargar la página
async function verificarSesion() {
    try {
        const respuesta = await fetch(`${API_URL}/auth/sesion`);
        const datos = await respuesta.json();
        return datos.autenticado ? datos.usuario : null;
    } catch (err) {
        return null;
    }
}

// --- Funciones del Panel (Dashboard) ---

// Cargar la lista de incidencias desde el servidor
async function cargarIncidencias() {
    const grid = document.getElementById('incidentsGrid');
    grid.innerHTML = '<p>Cargando...</p>';

    try {
        const respuesta = await fetch(`${API_URL}/incidencias`);
        if (!respuesta.ok) throw new Error('Error cargando incidencias');

        const incidencias = await respuesta.json();
        renderizarIncidencias(incidencias); // Mostrar en pantalla
    } catch (err) {
        grid.innerHTML = `<p style="color:red">Error: ${err.message}</p>`;
    }
}

// Dibujar las incidencias en el HTML
async function renderizarIncidencias(incidencias) {
    const grid = document.getElementById('incidentsGrid');
    grid.innerHTML = '';

    const usuario = await verificarSesion();
    if (!usuario) return;

    if (incidencias.length === 0) {
        grid.innerHTML = '<p>No hay incidencias registradas.</p>';
        return;
    }

    incidencias.forEach(incidencia => {
        const tarjeta = document.createElement('div');
        tarjeta.className = `incident-card ${incidencia.estado}`;

        // Verificar si el usuario actual es el dueño de la incidencia
        const esPropietario = incidencia.usuario_id === usuario.id;

        let htmlAcciones = '';

        // Botón Resolver (si está abierta)
        if (incidencia.estado === 'abierta') {
            htmlAcciones += `<button onclick="resolverIncidencia(${incidencia.id})" class="btn btn-success">Resolver</button>`;
        }

        // Botón Borrar (si es propietario)
        if (esPropietario) {
            htmlAcciones += `<button onclick="borrarIncidencia(${incidencia.id})" class="btn btn-danger">Borrar</button>`;
        }

        tarjeta.innerHTML = `
            <span class="incident-status ${incidencia.estado}">${incidencia.estado}</span>
            <h3>${incidencia.titulo}</h3>
            <p>${incidencia.descripcion}</p>
            <div class="incident-meta">
                Reportado por: <strong>${incidencia.autor || 'ID: ' + incidencia.usuario_id}</strong>
            </div>
            <div class="incident-actions">
                ${htmlAcciones}
            </div>
        `;
        grid.appendChild(tarjeta);
    });
}

// Crear una nueva incidencia
async function manejarCrearIncidencia(e) {
    e.preventDefault();
    const titulo = document.getElementById('incTitle').value;
    const descripcion = document.getElementById('incDesc').value;

    try {
        const respuesta = await fetch(`${API_URL}/incidencias`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo, descripcion })
        });

        if (respuesta.ok) {
            // Limpiar formulario y recargar lista
            document.getElementById('newIncidentForm').reset();
            document.getElementById('createIncidentForm').classList.add('hidden');
            cargarIncidencias();
        } else {
            alert('Error al crear incidencia');
        }
    } catch (err) {
        console.error(err);
    }
}

// Marcar incidencia como resuelta
async function resolverIncidencia(id) {
    if (!confirm('¿Marcar como resuelta?')) return;
    try {
        const respuesta = await fetch(`${API_URL}/incidencias/${id}/resolver`, { method: 'POST' });
        if (respuesta.ok) cargarIncidencias();
        else alert('Error al resolver');
    } catch (err) { console.error(err); }
}

// Borrar incidencia
async function borrarIncidencia(id) {
    if (!confirm('¿Eliminar incidencia?')) return;
    try {
        const respuesta = await fetch(`${API_URL}/incidencias/${id}`, { method: 'DELETE' });
        if (respuesta.ok) cargarIncidencias();
        else {
            const datos = await respuesta.json();
            alert(datos.error || 'Error al eliminar');
        }
    } catch (err) { console.error(err); }
}

// --- Inicialización de la Página (Event Listeners) ---

document.addEventListener('DOMContentLoaded', () => {
    // Si estamos en la página de Login (index.html)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', manejarLogin);
    }

    // Si estamos en el Dashboard (dashboard.html)
    const dashboardContainer = document.querySelector('.dashboard-container');
    if (dashboardContainer) {
        // Verificar sesión al entrar
        verificarSesion().then(user => {
            if (!user) {
                // Si no hay usuario, volver al login
                window.location.href = 'index.html';
            } else {
                // Si hay usuario, mostrar nombre y cargar datos
                const userNameSpan = document.getElementById('userName');
                if (userNameSpan) userNameSpan.textContent = user.nombre;
                cargarIncidencias();
            }
        });

        // Event listener para Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) logoutBtn.addEventListener('click', manejarLogout);

        // Lógica para mostrar/ocultar formulario de creación
        const showCreateFormBtn = document.getElementById('showCreateFormBtn');
        const createIncidentForm = document.getElementById('createIncidentForm');
        const cancelCreateBtn = document.getElementById('cancelCreateBtn');

        if (showCreateFormBtn && createIncidentForm) {
            showCreateFormBtn.addEventListener('click', () => {
                createIncidentForm.classList.remove('hidden');
            });
        }

        if (cancelCreateBtn && createIncidentForm) {
            cancelCreateBtn.addEventListener('click', () => {
                createIncidentForm.classList.add('hidden');
            });
        }

        // Event listener para crear incidencia
        const newIncidentForm = document.getElementById('newIncidentForm');
        if (newIncidentForm) {
            newIncidentForm.addEventListener('submit', manejarCrearIncidencia);
        }
    }
});
