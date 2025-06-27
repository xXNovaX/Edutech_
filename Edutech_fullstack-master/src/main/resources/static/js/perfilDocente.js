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

document.getElementById('evaluarAlumnos').addEventListener('click', async (e) => {
  e.preventDefault();
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  // Obtener los cursos del docente
  const res = await fetch(`http://localhost:8080/api/cursos/docente/${usuario.id}`);
  if (!res.ok) {
    contenidoPrincipal.innerHTML = `<p>Error cargando cursos para evaluación.</p>`;
    return;
  }

  const cursos = await res.json();

  // Mostrar lista para seleccionar curso
  if (cursos.length === 0) {
    contenidoPrincipal.innerHTML = `<p>No tienes cursos asignados para evaluar.</p>`;
    return;
  }

  let html = `<h3>Selecciona un curso para evaluar</h3><select id="cursoSeleccionado"><option disabled selected>Selecciona...</option>`;
  cursos.forEach(curso => {
    html += `<option value="${curso.id}">${curso.nombre}</option>`;
  });
  html += `</select>
  <button id="irAEvaluacion" class="btn-ir">Ir</button>
  <button id="verNotasCurso" class="btn-ir" style="margin-left: 8px;">Ver Notas</button>`;

  document.getElementById("irAEvaluacion").addEventListener("click", () => {
  const cursoId = select.value;
  if (cursoId) mostrarFormularioEvaluacion(cursoId);
});

document.getElementById("verNotasCurso").addEventListener("click", () => {
  const cursoId = select.value;
  if (cursoId) mostrarNotasCurso(cursoId);
});

  contenidoPrincipal.innerHTML = html;

  // Escuchar click en "Ir"
  document.getElementById('irAEvaluacion').addEventListener('click', () => {
    const cursoId = document.getElementById('cursoSeleccionado').value;
    if (cursoId) {
      mostrarFormularioEvaluacion(cursoId);
    }
  });
});


document.getElementById('evaluarAlumnos').addEventListener('click', (e) => {
  e.preventDefault();
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  // Mostrar select y botones
  fetch(`http://localhost:8080/api/cursos/docente/${usuario.id}`)
    .then(res => res.json())
    .then(cursos => {
      if (cursos.length === 0) {
        contenidoPrincipal.innerHTML = `<p>No tienes cursos asignados.</p>`;
        return;
      }

      let html = `
        <h3>Bienvenido, docente</h3>
        <p><strong>Selecciona un curso para evaluar</strong></p>
        <select id="selectCursoEvaluar">
          <option value="">Selecciona...</option>
      `;

      cursos.forEach(c => {
        html += `<option value="${c.id}">${c.nombre}</option>`;
      });

      html += `</select>
        <button id="btnIrEvaluar" style="margin-left: 10px;">Ir</button>
        <button id="btnVerNotas" style="margin-left: 5px;">Ver Evaluaciones</button>
      `;

      contenidoPrincipal.innerHTML = html;

      // Evento para ir a evaluar
      document.getElementById('btnIrEvaluar').addEventListener('click', () => {
        const cursoId = document.getElementById("selectCursoEvaluar").value;
        if (!cursoId) return alert("Selecciona un curso primero.");
        mostrarFormularioEvaluacion(cursoId);
      });

      // Evento para ver evaluaciones existentes
      document.getElementById('btnVerNotas').addEventListener('click', () => {
        const cursoId = document.getElementById("selectCursoEvaluar").value;
        if (!cursoId) return alert("Selecciona un curso primero.");
        verEvaluacionesRegistradas(cursoId);
      });
    });
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
            <div class="curso-card" style="--bar-color: ${curso.colorHex || '#4CC8E8'};">
              <div class="card-color-bar"></div>

              <div class="card-content">
                <div class="card-meta">
                  <small>${curso.periodo || ''}</small>
                  <small>${curso.codigo || ''}</small>
                </div>
                <h3 class="card-titulo">${curso.nombre}</h3>

                <!-- DESCRIPCIÓN ADICIONADA -->
                <p class="card-desc">${curso.descripcion || ''}</p>

                <div class="card-info">
                  <span class="card-estado">${curso.estado || 'Abierto'}</span> |
                  <span>${curso.docenteNombre || ''}</span>
                </div>
              </div>

              <div class="button-group">
                <button class="btnEliminar" data-id="${curso.id}">Eliminar</button>
                <button class="btnVerEstudiantes" data-id="${curso.id}">Ver estudiantes</button>
                <button class="btnEvaluar" data-id="${curso.id}">Evaluar</button>
              </div>

              <div class="crear-seccion">
                <input type="text" id="input-seccion-${curso.id}" placeholder="Título de sección">
                <button class="btnCrearSeccion" data-id="${curso.id}">Crear sección</button>
              </div>

              <div id="lista-secciones-${curso.id}"></div>
            </div>
          `;
        });
        html += `</div>`;
      }

      html += `<button id="btnNuevoCurso" class="btn-primary" style="margin-top:20px;">Crear Nuevo Curso</button>`;
      contenidoPrincipal.innerHTML = html;

      // Listeners
      document.querySelectorAll('.btnVerEstudiantes').forEach(btn =>
        btn.addEventListener('click', () => verEstudiantes(btn.dataset.id))
      );
      document.getElementById('btnNuevoCurso').addEventListener('click', mostrarFormularioNuevoCurso);
      document.querySelectorAll('.btnEliminar').forEach(btn =>
        btn.addEventListener('click', () => {
          if (confirm('¿Estás seguro que quieres eliminar este curso?')) {
            eliminarCurso(btn.dataset.id, docenteId);
          }
        })
      );
      document.querySelectorAll('.btnEvaluar').forEach(btn =>
        btn.addEventListener('click', () => mostrarFormularioEvaluacion(btn.dataset.id))
      );

      document.querySelectorAll('.btnCrearSeccion').forEach(btn =>
        btn.addEventListener('click', () => {
          const cursoId = btn.dataset.id;
          const input = document.getElementById(`input-seccion-${cursoId}`);
          if (!input.value.trim()) return alert("El título de la sección no puede estar vacío.");
          fetch("http://localhost:8080/api/secciones", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ titulo: input.value.trim(), curso: { id: +cursoId } })
          })
          .then(res => {
            if (!res.ok) throw new Error();
            return res.json();
          })
          .then(() => {
            alert("Sección creada correctamente");
            input.value = "";
            cargarSeccionesPorCurso(cursoId);
          })
          .catch(() => alert("Error al crear la sección"));
        })
      );

      cursos.forEach(curso => cargarSeccionesPorCurso(curso.id));
    })
    .catch(() => {
      contenidoPrincipal.innerHTML = `<p>Error cargando cursos. Intenta de nuevo.</p>`;
    });
}





// =====================================================
// Función principal: carga el dropdown y prepara el detalle
// =====================================================
function cargarSeccionesPorCurso(cursoId) {
  fetch(`http://localhost:8080/api/secciones/curso/${cursoId}`)
    .then(res => res.json())
    .then(secciones => {
      const contenedor = document.getElementById(`lista-secciones-${cursoId}`);
      if (!contenedor) return;

      if (secciones.length === 0) {
        contenedor.innerHTML = "<p style='color: gray;'>No hay secciones todavía.</p>";
        return;
      }

      // 1️⃣ Inyectamos el <select> y el placeholder de detalle
      contenedor.innerHTML = `
        <label for="select-seccion-${cursoId}">Selecciona sección:</label><br>
        <select id="select-seccion-${cursoId}" style="margin:5px 0; padding:4px;">
          <option value="">-- Elige sección --</option>
        </select>
        <div id="detalle-seccion-${cursoId}" style="margin-top:1rem;"></div>
      `;

      // 2️⃣ Rellenamos las opciones
      const sel = document.getElementById(`select-seccion-${cursoId}`);
      secciones.forEach(sec => {
        const opt = document.createElement("option");
        opt.value = sec.id;
        opt.textContent = sec.titulo;
        sel.appendChild(opt);
      });

      // 3️⃣ Al cambiar, mostramos el detalle
      sel.addEventListener("change", e => {
        const secId = e.target.value;
        mostrarDetalleSeccion(secId, cursoId);
      });
    })
    .catch(err => {
      console.error("Error al cargar secciones:", err);
    });
}

// =====================================================
// Función secundaria: muestra descripción, archivos, etc.
// =====================================================
function mostrarDetalleSeccion(seccionId, cursoId) {
  const cont = document.getElementById(`detalle-seccion-${cursoId}`);
  if (!cont) return;

  if (!seccionId) {
    cont.innerHTML = "";
    return;
  }

  fetch(`http://localhost:8080/api/secciones/${seccionId}`)
    .then(res => {
      if (!res.ok) throw new Error("Error al cargar sección");
      return res.json();
    })
    .then(sec => {
      cont.innerHTML = `
        <div class="detail-card">
          <h4 class="detail-title">${sec.titulo}</h4>
          <textarea id="desc-${sec.id}" class="detail-textarea">${sec.descripcion || ""}</textarea>
          <div class="detail-btns">
            <button class="btn btn-save" onclick="guardarDescripcion(${sec.id})">Guardar</button>
            <button class="btn btn-delete" onclick="eliminarSeccion(${sec.id})">Eliminar sección</button>
          </div>
          <div id="archivos-seccion-${sec.id}" class="detail-archivos"></div>
          <form id="formArchivo-${sec.id}" class="detail-form" enctype="multipart/form-data">
            <input type="file" name="archivo" class="detail-file" required />
            <button type="button" class="btn btn-primary" onclick="subirArchivo(${sec.id})">Subir archivo</button>
          </form>
        </div>
      `;
      cargarArchivosPorSeccion(sec.id);
    })
    .catch(err => {
      cont.innerHTML = `<p class="error-text">Error cargando sección.</p>`;
      console.error(err);
    });
}






function subirArchivo(seccionId) { 
  const form = document.getElementById(`formArchivo-${seccionId}`);
  const formData = new FormData(form);
  formData.append("seccionId", seccionId);

  fetch("http://localhost:8080/api/archivos/subir", {
    method: "POST",
    body: formData
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al subir archivo");

      return res.json(); // ✅ usa .text() si la respuesta no es JSON
    })
    .then(json => {
      console.log("Respuesta del servidor:", json);
      alert("Archivo subido correctamente");
      cargarArchivosDeSeccion(seccionId);
    })
    .catch(err => {
  console.warn("Ocurrió un error, pero no se notificará al usuario:", err);
});

    
}








function cargarArchivosPorSeccion(seccionId) {
  fetch(`http://localhost:8080/api/archivos/seccion/${seccionId}`)
    .then(res => res.json())
    .then(archivos => {
      const contenedor = document.getElementById(`archivos-seccion-${seccionId}`);
      if (!contenedor) return;

      if (archivos.length === 0) {
        contenedor.innerHTML = "<p style='color: gray;'>No hay archivos subidos.</p>";
      } else {
        let html = "<ul>";
        archivos.forEach(archivo => {
          html += `
            <li>
              📎 <a href="http://localhost:8080/api/archivos/descargar/${archivo.id}" target="_blank">${archivo.nombre}</a>
              <button onclick="eliminarArchivo(${archivo.id}, ${seccionId})" style="margin-left:10px;">Eliminar</button>
            </li>`;
        });
        html += "</ul>";
        contenedor.innerHTML = html;
      }
    })
    .catch(err => {
      console.error("Error al cargar archivos:", err);
    });
}




function eliminarArchivo(archivoId, seccionId) {
  if (!confirm("¿Estás seguro de que quieres eliminar este archivo?")) return;

  fetch(`http://localhost:8080/api/archivos/${archivoId}`, {
    method: "DELETE"
  })
    .then(res => {
      if (!res.ok) throw new Error("No se pudo eliminar el archivo.");
      return res.text();
    })
    .then(() => {
      alert("Archivo eliminado correctamente.");
      cargarArchivosPorSeccion(seccionId);
    })
    .catch(err => {
      console.error("Error al eliminar archivo:", err);
      alert("Error al eliminar archivo.");
    });
}





function guardarDescripcion(seccionId) {
  const textarea = document.getElementById(`desc-${seccionId}`);
  const nuevaDescripcion = textarea.value;

  fetch(`http://localhost:8080/api/secciones/${seccionId}/descripcion`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(nuevaDescripcion)
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al guardar descripción");
      alert("Descripción actualizada correctamente");
    })
    .catch(err => {
      console.error(err);
      alert("Error al actualizar descripción");
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

       // Generar inputs de título y ponderación por cada nota
      for (let i = 0; i < cantidad; i++) {
      html += `
      <label for="titulo-${i}">Título Evaluación ${i + 1}</label>
      <input type="text" name="titulo-${i}" id="titulo-${i}" required />


      <label for="pond-${i}">Ponderación Nota ${i + 1} (%)</label>
      <input type="number" name="ponderaciones" id="pond-${i}" min="1" max="100" required /><br/><br/>
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
          html += `<td><input type="number" step="0.1" min="1" max="7" name="nota-${est.id}-${i}" /></td>`;
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
            const input = document.querySelector(`[name="nota-${est.id}-${i}"]`);
            const notaStr = input.value.trim();
            if (notaStr === "") return; // 👉 ignorar si está vacío

            const nota = parseFloat(notaStr);
            const titulo = document.querySelector(`[name="titulo-${i}"]`).value;

            evaluaciones.push({
              estudiante: { id: est.id },
              curso: { id: cursoId },
              nota: nota,
              ponderacion: pond,
              fecha: new Date().toISOString().split('T')[0],
              titulo: titulo
            });
          });

            // Muestra nota final en consola (opcional, útil para pruebas)
            console.log(`Nota final para ${est.nombre}: ${notaFinal.toFixed(2)}`);
          });
          console.log("Evaluaciones a enviar:");
          console.table(evaluaciones);
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

function mostrarNotasCurso(cursoId) {
  fetch(`http://localhost:8080/api/evaluaciones/curso/${cursoId}`)
    .then(res => res.json())
    .then(evaluaciones => {
      if (evaluaciones.length === 0) {
        contenidoPrincipal.innerHTML = `<p>No hay evaluaciones registradas aún para este curso.</p>`;
        return;
      }



        let html = `<h3>Notas registradas</h3><table border="1">
        <tr>
          <th>ID Estudiante</th>
          <th>Nombre</th>
          <th>Nota</th>
          <th>Ponderación (%)</th>
          <th>Fecha</th>
          <th>Título</th>
        </tr>`;


 

      evaluaciones.forEach(ev => {
      html += `<tr>
      <td>${ev.estudiante?.id || '-'}</td>
      <td>${ev.estudiante?.nombre || 'Desconocido'}</td>
      <td><input type="number" step="0.1" min="1" max="7" value="${ev.nota}" data-id="${ev.id}" class="notaInput" /></td>
      <td><input type="number" min="1" max="100" value="${ev.ponderacion}" data-id="${ev.id}" class="pondInput" /></td>
      <td>${ev.fecha || '-'}</td>
      <td><input type="text" class="tituloInput" value="${ev.titulo || ''}" data-id="${ev.id}" /></td>
      <td><input type="hidden" class="evalId" value="${ev.id}" /></td>
    </tr>`;
  });


      html += `</table>`;
      html += `<button id="btnGuardarCambios" class="btn-primary">Guardar Cambios</button>`;
      contenidoPrincipal.innerHTML = html;

    })
    .catch(() => {
      contenidoPrincipal.innerHTML = `<p>Error al cargar las evaluaciones.</p>`;
    });
}




    function verEvaluacionesRegistradas(cursoId) {
      // Guarda el cursoId para futuras acciones como eliminar
      localStorage.setItem("cursoSeleccionado", cursoId);

      fetch(`http://localhost:8080/api/evaluaciones/curso/${cursoId}`)
        .then(res => res.json())
        .then(evaluaciones => {
          if (evaluaciones.length === 0) {
            contenidoPrincipal.innerHTML = `<p>No hay evaluaciones registradas para este curso.</p>`;
            return;
          }


          //cambie esto ojo es para poder seleccionar un alumno de un menu seleccionable
          let html = `<h3>Evaluaciones Registradas</h3>`;

          // Paso 1: Agregar selector de alumno y div para nota final
          html += `
            <label for="selectAlumno">Filtrar por alumno:</label>
            <select id="selectAlumno">
              <option value="">Todos</option>
            </select>
            <div id="notaFinalBox" style="margin-top: 10px; font-weight: bold;"></div>
          `;

          // Luego sigue con la tabla
          html += `<table border="1"><tr>
            <th style="display:none;">ID</th>
            <th>Estudiante</th>
            <th>Nota</th>
            <th>Ponderación (%)</th>
            <th>Fecha</th>
            <th>Título</th>
            <th>Eliminar</th>
          </tr>`;




          evaluaciones.sort((a, b) => {
          const nombreA = (a.estudianteNombre || "").toLowerCase();
          const nombreB = (b.estudianteNombre || "").toLowerCase();
          return nombreA.localeCompare(nombreB);
        });


          evaluaciones.forEach(ev => {
          html += `<tr
            data-id="${ev.id}"
            data-curso-id="${cursoId}"
            data-estudiante-id="${ev.estudianteId}">
            <td>${ev.estudianteNombre || 'Desconocido'}</td>
            <td><input type="number" step="0.1" min="1" max="7" value="${ev.nota}" data-id="${ev.id}" class="notaInput" /></td>
            <td><input type="number" min="1" max="100" value="${ev.ponderacion}" data-id="${ev.id}" class="pondInput" /></td>
            <td>${ev.fecha || '-'}</td>
            <td><input type="text" class="tituloInput" value="${ev.titulo || ''}" data-id="${ev.id}" /></td>
            <td><button onclick="eliminarEvaluacion(${ev.id})" style="color:red;">❌</button></td>
          </tr>`;
        });





          // ✅ Este cierre debe ir FUERA del forEach
          html += `</table><br/>
          <button id="btnGuardarCambios" class="btn-primary">Guardar Cambios</button>
          <div id="resultadoNotaFinal" style="margin-top: 15px;">
            <strong>Nota Final Alumno Seleccionado: <span id="notaFinal">-</span></strong>
          </div>`;

          contenidoPrincipal.innerHTML = html;


          // Paso 2: Llenar el selector con estudiantes únicos
          const selectAlumno = document.getElementById("selectAlumno");
          const estudiantesUnicos = [...new Set(evaluaciones.map(ev => `${ev.estudianteId}|${ev.estudianteNombre}`))];

          estudiantesUnicos.forEach(est => {
            const [id, nombre] = est.split("|");
            const option = document.createElement("option");
            option.value = id;
            option.textContent = nombre || "Desconocido";
            selectAlumno.appendChild(option);
          });



          // Paso 3: Evento para filtrar por estudiante
          selectAlumno.addEventListener("change", () => {
            const idSeleccionado = selectAlumno.value;
            const filas = document.querySelectorAll("table tr[data-estudiante-id]");

            // Mostrar u ocultar filas según el alumno seleccionado
            filas.forEach(fila => {
              const idEst = fila.getAttribute("data-estudiante-id");
              fila.style.display = idSeleccionado === "" || idEst === idSeleccionado ? "" : "none";
            });

            // Si se seleccionó "Todos", no calculamos nota final
            if (idSeleccionado === "") {
              document.getElementById("notaFinal").textContent = "-";
              return;
            }

            // Calcular y mostrar la nota final del alumno seleccionado
            const evaluacionesFiltradas = evaluaciones.filter(ev => ev.estudianteId == idSeleccionado);
            let suma = 0;
            let totalPonderacion = 0;
            evaluacionesFiltradas.forEach(ev => {
              suma += ev.nota * (ev.ponderacion / 100);
              totalPonderacion += ev.ponderacion;
            });

            const notaFinal = totalPonderacion > 0 ? suma.toFixed(2) : "-";
            document.getElementById("notaFinal").textContent = notaFinal;
          });




          // Evento botón
          document.getElementById("btnGuardarCambios").addEventListener("click", guardarCambiosEvaluaciones);
        })
        .catch(() => {
          contenidoPrincipal.innerHTML = `<p>Error al cargar evaluaciones.</p>`;
        });
    }

    




function eliminarEvaluacion(id) {
  if (confirm("¿Estás seguro de que quieres eliminar esta evaluación?")) {
    fetch(`http://localhost:8080/api/evaluaciones/${id}`, {
      method: "DELETE"
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al eliminar");
        alert("Evaluación eliminada correctamente.");
        const cursoId = parseInt(localStorage.getItem("cursoSeleccionado"));
        verEvaluacionesRegistradas(cursoId);
      })
      .catch(() => alert("No se pudo eliminar la evaluación."));
  }
}





function guardarCambiosEvaluaciones() {
  const cursoId = localStorage.getItem("cursoSeleccionado");
  const filas = document.querySelectorAll("table tr[data-estudiante-id]");
  const actualizaciones = [];

  filas.forEach(fila => {
    const idEvaluacion = fila.querySelector(".notaInput")?.getAttribute("data-id");
    const nota = parseFloat(fila.querySelector(".notaInput")?.value.replace(",", "."));
    const ponderacion = parseFloat(fila.querySelector(".pondInput")?.value);
    const titulo = fila.querySelector(".tituloInput")?.value;
    const estudianteId = fila.getAttribute("data-estudiante-id");

    console.log("Fila:", {
      idEvaluacion,
      nota,
      ponderacion,
      titulo,
      estudianteId,
      cursoId
    });

    if (idEvaluacion && !isNaN(nota) && !isNaN(ponderacion)) {
      actualizaciones.push({
        id: idEvaluacion,
        nota,
        ponderacion,
        titulo,
        estudiante: { id: estudianteId },
        curso: { id: cursoId }
      });
    }
  });

  console.log("📤 Enviando actualizaciones:");
  console.table(actualizaciones);

  fetch("http://localhost:8080/api/evaluaciones/actualizar", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(actualizaciones)
  })
  .then(res => {
    if (!res.ok) throw new Error("Error al actualizar");
    alert("Evaluaciones actualizadas correctamente.");
    verEvaluacionesRegistradas(localStorage.getItem("cursoSeleccionado"));
  })
  .catch(err => {
    console.error("❌ Error en fetch:", err);
    alert("No se pudo actualizar.");
  });
}


window.addEventListener("DOMContentLoaded", () => {
  // Aquí puedes ponerlo sin problemas:
  document.getElementById("misCursos").addEventListener("click", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario && usuario.id) {
      mostrarMisCursos(usuario.id);
    } else {
      alert("Error: No se pudo obtener el ID del usuario.");
    }
  });
});


function eliminarSeccion(seccionId) {
  if (!confirm("¿Estás seguro de que deseas eliminar esta sección?")) return;

  fetch(`http://localhost:8080/api/secciones/${seccionId}`, {
    method: "DELETE"
  })
    .then(res => {
      if (res.status === 200 || res.status === 204) {
        alert("Sección eliminada correctamente");
        const elemento = document.getElementById(`seccion-${seccionId}`);
        if (elemento) {
          elemento.remove(); // Elimina del DOM si existe
        }
      } else {
        throw new Error("Respuesta no exitosa al eliminar sección");
      }
    })
    .catch(err => {
      console.error("Error real:", err);
      alert("No se pudo eliminar la sección");
    });
}


