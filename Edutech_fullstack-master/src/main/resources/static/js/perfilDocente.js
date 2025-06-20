const nombreUsuario = document.getElementById('nombreUsuario');
const nombreDocente = document.getElementById('nombreDocente');
const welcomeMenu = document.getElementById('welcomeMenu');
const toggleMenuBtn = document.getElementById('toggleMenuBtn');
const welcomeContent = document.getElementById('welcomeContent');
const contenidoPrincipal = document.getElementById('contenidoPrincipal');

window.addEventListener('DOMContentLoaded', () => {
  const usuarioGuardado = localStorage.getItem('usuario');
  if (!usuarioGuardado) {
    window.location.href = 'login.html';
    return;
  }

  const usuario = JSON.parse(usuarioGuardado);

  if (usuario.rol !== 'DOCENTE') {
    alert('No tienes permisos para acceder aquí');
    window.location.href = 'login.html';
    return;
  }

  welcomeMenu.style.display = 'flex';
  nombreUsuario.textContent = usuario.nombre;
  nombreDocente.textContent = usuario.nombre;

  mostrarMisCursos(usuario.id);
});

toggleMenuBtn.addEventListener('click', () => {
  welcomeContent.classList.toggle('show');
  toggleMenuBtn.classList.toggle('active');
});

document.getElementById('misCursos').addEventListener('click', (e) => {
  e.preventDefault();
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  mostrarMisCursos(usuario.id);
});

document.getElementById('evaluarAlumnos').addEventListener('click', (e) => {
  e.preventDefault();
  contenidoPrincipal.innerHTML = `<p>Funcionalidad Evaluar Alumnos en construcción...</p>`;
});

document.getElementById('cerrarSesion').addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('usuario');
  window.location.href = 'login.html';
});

function mostrarMisCursos(docenteId) {
  fetch(`http://localhost:8080/api/cursos/docente/${docenteId}`)
    .then(res => {
      if (!res.ok) throw new Error('Error al cargar cursos');
      return res.json();
    })
    .then(cursos => {
      let html = `<h3>Mis Cursos</h3>`;

      if (cursos.length === 0) {
        html += `<p>No tienes cursos creados aún.</p>`;
      } else {
        html += `<div>`;
        cursos.forEach(curso => {
          html += `
            <div class="curso-card">
              <h4>${curso.nombre}</h4>
              <p>${curso.descripcion}</p>
              <button class="btnEliminar" data-id="${curso.id}">Eliminar</button>
              <button class="btnVerEstudiantes" data-id="${curso.id}">Ver estudiantes</button>
            </div>`;
        });
        html += `</div>`;
      }

      html += `<button id="btnNuevoCurso" class="btn-primary" style="margin-top:20px;">Crear Nuevo Curso</button>`;
      contenidoPrincipal.innerHTML = html;

      document.querySelectorAll('.btnVerEstudiantes').forEach(btn => {
        btn.addEventListener('click', () => {
          const cursoId = btn.getAttribute('data-id');
          verEstudiantes(cursoId);
        });
      });

      document.getElementById('btnNuevoCurso').addEventListener('click', mostrarFormularioNuevoCurso);

      document.querySelectorAll('.btnEliminar').forEach(btn => {
        btn.addEventListener('click', () => {
          const idCurso = btn.getAttribute('data-id');
          if (confirm('¿Estás seguro que quieres eliminar este curso?')) {
            eliminarCurso(idCurso, docenteId);
          }
        });
      });
    })
    .catch(() => {
      contenidoPrincipal.innerHTML = `<p>Error cargando cursos. Intenta de nuevo.</p>`;
    });
}

function mostrarFormularioNuevoCurso() {
  contenidoPrincipal.innerHTML = `
    <div class="formulario-grande">
      <h3>Crear Nuevo Curso</h3>
      <form id="formNuevoCurso">
        <label for="nombreCurso">Nombre:</label><br/>
        <input type="text" id="nombreCurso" name="nombreCurso" required /><br/><br/>
        <label for="descCurso">Descripción:</label><br/>
        <textarea id="descCurso" name="descCurso" rows="4" required></textarea><br/><br/>
        <button type="submit" class="btn-primary">Crear Curso</button>
        <button type="button" id="btnCancelar" style="margin-left: 12px;">Cancelar</button>
      </form>
      <div id="mensajeCurso" style="color: red; margin-top: 10px;"></div>
    </div>
  `;

  document.getElementById('formNuevoCurso').addEventListener('submit', (e) => {
    e.preventDefault();
    crearCurso();
  });

  document.getElementById('btnCancelar').addEventListener('click', () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    mostrarMisCursos(usuario.id);
  });
}

function crearCurso() {
  const nombre = document.getElementById('nombreCurso').value.trim();
  const descripcion = document.getElementById('descCurso').value.trim();
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!nombre || !descripcion) {
    document.getElementById('mensajeCurso').textContent = 'Todos los campos son obligatorios';
    return;
  }

  fetch(`http://localhost:8080/api/cursos/docente/${usuario.id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, descripcion })
  })
    .then(res => {
      if (!res.ok) throw new Error('Error creando curso');
      return res.json();
    })
    .then(() => {
      mostrarMisCursos(usuario.id);
    })
    .catch(() => {
      document.getElementById('mensajeCurso').textContent = 'No se pudo crear el curso, intenta nuevamente.';
    });
}

function eliminarCurso(idCurso, docenteId) {
  fetch(`http://localhost:8080/api/cursos/${idCurso}`, {
    method: 'DELETE'
  })
    .then(res => {
      if (!res.ok) throw new Error('Error eliminando curso');
      mostrarMisCursos(docenteId);
    })
    .catch(() => {
      alert('No se pudo eliminar el curso, intenta nuevamente.');
    });
}

function verEstudiantes(cursoId) {
  fetch(`http://localhost:8080/api/inscripciones/curso/${cursoId}/estudiantes`)
    .then(res => {
      if (!res.ok) throw new Error('Error al cargar los estudiantes');
      return res.json();
    })
    .then(estudiantes => {
      let html = `<h3>Estudiantes Inscritos</h3>`;
      if (estudiantes.length === 0) {
        html += `<p>No hay estudiantes inscritos aún.</p>`;
      } else {
        html += `<ul>`;
        estudiantes.forEach(estudiante => {
          html += `<li>${estudiante.nombre} - ${estudiante.correo}</li>`;
        });
        html += `</ul>`;
      }
      contenidoPrincipal.innerHTML = html;
    })
    .catch(() => {
      contenidoPrincipal.innerHTML = `<p>Error al cargar estudiantes, intenta nuevamente.</p>`;
    });
}
