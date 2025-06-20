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
              <button class="btnEvaluar" data-id="${curso.id}">Evaluar</button>

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
      document.querySelectorAll('.btnEvaluar').forEach(btn => {
        btn.addEventListener('click', () => {
          const cursoId = btn.getAttribute('data-id');
            mostrarFormularioEvaluacion(cursoId);
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

function mostrarFormularioEvaluacion(cursoId) {
  let cantidad = 0;

  fetch(`http://localhost:8080/api/inscripciones/curso/${cursoId}/estudiantes`)
    .then(res => res.json())
    .then(estudiantes => {
      if (estudiantes.length === 0) {
        contenidoPrincipal.innerHTML = `<p>No hay estudiantes inscritos en este curso.</p>`;
        return;
      }

      // Paso 1: pedir al docente cuántas notas va a poner
      contenidoPrincipal.innerHTML = `
        <h3>Evaluar Estudiantes</h3>
        <label for="cantidadNotas">¿Cuántas notas desea ingresar?</label>
        <input type="number" id="cantidadNotas" min="1" max="10" value="1" />
        <button id="generarNotas">Generar Formulario</button>
        <div id="formEvaluacion"></div>
      `;

      document.getElementById('generarNotas').addEventListener('click', () => {
        const cantidad = parseInt(document.getElementById('cantidadNotas').value);
        if (isNaN(cantidad) || cantidad < 1) return;

        const formDiv = document.getElementById('formEvaluacion');
        let html = `<form id="evaluacionForm">`;

        // Generar inputs de porcentaje por cada nota
        for (let i = 0; i < cantidad; i++) {
          html += `
            <label>Ponderación Nota ${i + 1} (%)</label>
            <input type="number" name="ponderaciones" min="1" max="100" required /><br/>
          `;
        }

        // Tabla de estudiantes
        // Tabla de estudiantes
        html += `<table border="1"><tr><th>Estudiante</th>`;
        for (let i = 0; i < cantidad; i++) html += `<th>Nota ${i + 1}</th>`;
        html += `<th>Nota Final</th></tr>`;

        estudiantes.forEach(est => {
        html += `<tr><td>${est.nombre}</td>`;
        for (let i = 0; i < cantidad; i++) {
          html += `<td><input type="number" step="0.1" min="1" max="7" name="nota-${est.id}-${i}" required /></td>`;
        }
        html += `<td><span id="notaFinal-${est.id}">-</span></td></tr>`;
      });


        html += `</table><br/>
          <button type="submit" class="btn-primary">Guardar Evaluaciones</button>
        </form>`;

        
        
        
        
        formDiv.innerHTML = html;
        // Activar el cálculo dinámico de nota final
          estudiantes.forEach(est => {
            for (let i = 0; i < cantidad; i++) {
              const input = document.querySelector(`[name="nota-${est.id}-${i}"]`);
              input.addEventListener("input", () => calcularNotaFinal(est.id, cantidad));
            }
          });


        // Evento para enviar las evaluaciones
        document.getElementById('evaluacionForm').addEventListener('submit', e => {
          e.preventDefault();

          const ponderaciones = [...document.getElementsByName('ponderaciones')].map(input => parseFloat(input.value));
          const suma = ponderaciones.reduce((a, b) => a + b, 0);

          if (suma !== 100) {
            alert("Las ponderaciones deben sumar 100%");
            return;
          }

          const evaluaciones = [];
          estudiantes.forEach(est => {
            let notaFinal = 0;
            ponderaciones.forEach((pond, i) => {
              const nota = parseFloat(document.querySelector(`[name="nota-${est.id}-${i}"]`).value);
              evaluaciones.push({
              estudiante: { id: est.id },
              curso: { id: cursoId },
              nota: nota,
              ponderacion: pond,
              fecha: new Date().toISOString().split('T')[0]
            });

            });
            // Muestra nota final en consola (opcional, útil para pruebas)
            console.log(`Nota final para ${est.nombre}: ${notaFinal.toFixed(2)}`);
          });

          // POST al backend
          fetch("http://localhost:8080/api/evaluaciones/lote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(evaluaciones)
          })
          .then(res => {
            if (!res.ok) throw new Error("Error guardando evaluaciones");
            alert("Notas guardadas correctamente");
            mostrarMisCursos(JSON.parse(localStorage.getItem('usuario')).id);
          })
          .catch(() => alert("Error al guardar las evaluaciones."));
        });
      });
    });



}

function calcularNotaFinal(estudianteId, cantidadNotas) {
    const ponderacionesInputs = document.getElementsByName("ponderaciones");
    const ponderaciones = [...ponderacionesInputs].map(i => parseFloat(i.value) || 0);

    let total = 0;
    for (let i = 0; i < cantidadNotas; i++) {
      const notaInput = document.querySelector(`[name="nota-${estudianteId}-${i}"]`);
      const nota = parseFloat(notaInput.value) || 0;
      total += nota * (ponderaciones[i] / 100);
    }

    const finalSpan = document.getElementById(`notaFinal-${estudianteId}`);
    finalSpan.textContent = total.toFixed(2);
}

