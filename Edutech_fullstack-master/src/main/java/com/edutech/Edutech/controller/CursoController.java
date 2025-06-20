package com.edutech.Edutech.controller;

// Importas modelos Curso y Estudiante, además de servicios para manejarlos
import com.edutech.Edutech.model.Curso;
import com.edutech.Edutech.model.Estudiante;
import com.edutech.Edutech.service.CursoService;
import com.edutech.Edutech.service.EstudianteService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

// Define que esta clase es un controlador REST y maneja solicitudes en /api/cursos
@RestController
@RequestMapping("/api/cursos")
public class CursoController {

    // Inyecta el servicio que gestiona lógica relacionada con cursos
    @Autowired
    private CursoService cursoService;

    // Inyecta el servicio que gestiona lógica relacionada con estudiantes (y docentes)
    @Autowired
    private EstudianteService estudianteService;

    // GET /api/cursos
    // Devuelve la lista completa de todos los cursos
    @GetMapping
    public List<Curso> listar() {
        return cursoService.listarTodos();
    }

    // GET /api/cursos/{id}
    // Busca un curso por su id y devuelve el curso si existe, o 404 si no
    @GetMapping("/{id}")
    public ResponseEntity<Curso> buscar(@PathVariable Long id) {
        return cursoService.buscarPorId(id)
                .map(ResponseEntity::ok) // si existe, devuelve 200 con el curso
                .orElse(ResponseEntity.notFound().build()); // si no, 404
    }

    // POST /api/cursos
    // Crea un nuevo curso con los datos que vienen en el cuerpo JSON
    @PostMapping
    public Curso crear(@RequestBody Curso curso) {
        return cursoService.guardar(curso);
    }

    // PUT /api/cursos/{id}
    // Actualiza un curso existente identificado por id con los datos del cuerpo JSON
    @PutMapping("/{id}")
    public ResponseEntity<Curso> actualizar(@PathVariable Long id, @RequestBody Curso curso) {
        return cursoService.actualizar(id, curso)
                .map(ResponseEntity::ok) // si actualizó, devuelve 200 con el curso actualizado
                .orElse(ResponseEntity.notFound().build()); // si no encontró el curso, 404
    }

    // DELETE /api/cursos/{id}
    // Elimina un curso por id, responde 204 (sin contenido) si se eliminó, o 404 si no existe
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (cursoService.eliminar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // GET /api/cursos/docente/{docenteId}
    // Lista los cursos asociados a un docente específico
    @GetMapping("/docente/{docenteId}")
    public ResponseEntity<List<Curso>> listarPorDocente(@PathVariable Long docenteId) {
        // Busca al docente por id
        Optional<Estudiante> docenteOpt = estudianteService.buscarPorId(docenteId);

        // Si no existe o su rol no es "DOCENTE", responde 403 Forbidden
        if (docenteOpt.isEmpty() || !"DOCENTE".equals(docenteOpt.get().getRol())) {
            return ResponseEntity.status(403).build();
        }

        // Obtiene la lista de cursos asociados a ese docente
        List<Curso> cursos = cursoService.listarPorDocente(docenteId);
        return ResponseEntity.ok(cursos);
    }

    // POST /api/cursos/docente/{docenteId}
    // Crea un curso nuevo asignado a un docente específico
    @PostMapping("/docente/{docenteId}")
    public ResponseEntity<?> crearCursoDocente(@PathVariable Long docenteId, @RequestBody Curso curso) {
        Optional<Estudiante> docenteOpt = estudianteService.buscarPorId(docenteId);

        // Verifica que el usuario exista y sea docente
        if (docenteOpt.isEmpty() || !"DOCENTE".equals(docenteOpt.get().getRol())) {
            return ResponseEntity.status(403).body("Solo docentes pueden crear cursos");
        }

        // Asocia el curso al docente encontrado
        curso.setDocente(docenteOpt.get());

        // Guarda el curso y lo devuelve en la respuesta
        Curso nuevoCurso = cursoService.guardar(curso);
        return ResponseEntity.ok(nuevoCurso);
    }
}
