// Referencias al DOM
const nombreUsuario      = document.getElementById('nombreUsuario');
const cursosDisponibles  = document.getElementById('cursosDisponibles');
const tituloSeccion      = document.getElementById('tituloSeccion');

// Listener inicial
window.addEventListener('DOMContentLoaded', () => {
  const usuarioGuardado = localStorage.getItem('usuario');
  if (!usuarioGuardado) {
    window.location.href = 'login.html';
    return;
  }

  const usuario = JSON.parse(usuarioGuardado);
  nombreUsuario.textContent = usuario.nombre;

  // Al cargar, mostrar cursos disponibles y cerrar el dropdown
  cargarCursosDisponibles();
  document.querySelector('.dropdown-menu').classList.remove('show');
});

// Helpers para manejar dropdown (Bootstrap v5)  
function cerrarDropdown() {
  const dropdownEl = document.getElementById('toggleMenuBtn');
  const dropdown = bootstrap.Dropdown.getInstance(dropdownEl);
  if (dropdown) dropdown.hide();
}

// Enlaces del menú
document.getElementById('inscripcionCursos').addEventListener('click', e => {
  e.preventDefault();
  cargarCursosDisponibles();
  cerrarDropdown();
});

document.getElementById('misCursosInscritos').addEventListener('click', e => {
  e.preventDefault();
  cargarCursosInscritos();
  cerrarDropdown();
});

document.getElementById('gestionarCuenta').addEventListener('click', e => {
  e.preventDefault();
  tituloSeccion.textContent = 'Gestionar Cuenta';
  cursosDisponibles.innerHTML = `<p>Funcionalidad “Gestionar Cuenta” en construcción…</p>`;
  cerrarDropdown();
});

document.getElementById('evaluaciones').addEventListener('click', e => {
  e.preventDefault();
  tituloSeccion.textContent = 'Evaluaciones';
  cursosDisponibles.innerHTML = `<p>Funcionalidad “Evaluaciones” en construcción…</p>`;
  cerrarDropdown();
});

document.getElementById('cerrarSesion').addEventListener('click', e => {
  e.preventDefault();
  localStorage.removeItem('usuario');
  window.location.href = 'login.html';
});

// Cargar cursos disponibles
function cargarCursosDisponibles() {
  tituloSeccion.textContent = 'Cursos disponibles para inscripción';
  fetch('http://localhost:8080/api/cursos')
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(cursos => {
      if (cursos.length === 0) {
        cursosDisponibles.innerHTML = `<p>No hay cursos disponibles.</p>`;
        return;
      }
      let html = '<ul class="list-group">';
      cursos.forEach(c => {
        html += `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>${c.nombre}</strong><br>
              <small class="text-muted">${c.descripcion || ''}</small>
            </div>
            <button class="btn btn-gradient-purple btn-sm btn-inscribir" data-id="${c.id}">
              Inscribirse
            </button>
          </li>`;
      });
      html += '</ul>';
      cursosDisponibles.innerHTML = html;

      document.querySelectorAll('.btn-inscribir').forEach(btn => {
        btn.addEventListener('click', () => inscribirCurso(btn));
      });
    })
    .catch(() => {
      cursosDisponibles.innerHTML = `<p class="text-danger">Error cargando cursos.</p>`;
    });
}

// Inscribir usuario en curso
function inscribirCurso(btn) {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const cursoId = btn.dataset.id;
  fetch(`http://localhost:8080/api/inscripciones/estudiante/${usuario.id}/curso/${cursoId}`, {
    method: 'POST'
  })
    .then(res => {
      if (!res.ok) throw new Error();
      btn.textContent = 'Inscrito';
      btn.disabled = true;
      btn.classList.remove('btn-gradient-purple');
      btn.classList.add('btn-secondary');
    })
    .catch(() => {
      alert('No se pudo inscribir. Intenta nuevamente.');
    });
}

// Cargar cursos ya inscritos
function cargarCursosInscritos() {
  tituloSeccion.textContent = 'Mis cursos inscritos';
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  fetch(`http://localhost:8080/api/inscripciones/estudiante/${usuario.id}`)
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(list => {
      if (list.length === 0) {
        cursosDisponibles.innerHTML = `<p>No estás inscrito en ningún curso.</p>`;
        return;
      }
      let html = '<ul class="list-group">';
      list.forEach(c => {
        html += `
          <li class="list-group-item">
            <strong>${c.nombre}</strong><br>
            <small class="text-muted">${c.descripcion || ''}</small>
          </li>`;
      });
      html += '</ul>';
      cursosDisponibles.innerHTML = html;
    })
    .catch(() => {
      cursosDisponibles.innerHTML = `<p class="text-danger">Error cargando inscritos.</p>`;
    });
}
