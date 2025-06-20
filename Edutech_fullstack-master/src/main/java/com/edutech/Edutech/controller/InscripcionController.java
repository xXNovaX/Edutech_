package com.edutech.Edutech.controller;

import com.edutech.Edutech.model.Curso;
import com.edutech.Edutech.model.Estudiante;
import com.edutech.Edutech.model.Inscripcion;
import com.edutech.Edutech.service.InscripcionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/inscripciones")
public class InscripcionController {

    @Autowired
    private InscripcionService service;

    // Lista todas las inscripciones
    @GetMapping
    public List<Inscripcion> listar() {
        return service.listarTodos();
    }

    // Buscar una inscripción por ID
    @GetMapping("/{id}")
    public ResponseEntity<Inscripcion> buscar(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Inscribir estudiante por URL con IDs
    @PostMapping("/estudiante/{idEstudiante}/curso/{idCurso}")
    public ResponseEntity<?> inscribir(@PathVariable Long idEstudiante, @PathVariable Long idCurso) {
        Optional<Inscripcion> resultado = service.inscribirEstudiante(idEstudiante, idCurso);

        if (resultado.isPresent()) {
            return ResponseEntity.ok(resultado.get());
        } else {
            return ResponseEntity.status(409).body("El estudiante ya está inscrito en este curso.");
        }
    }

    // Inscripción usando objeto Inscripcion con estudiante y curso embebidos
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Inscripcion inscripcion) {
        Long idEstudiante = inscripcion.getEstudiante().getId();
        Long idCurso = inscripcion.getCurso().getId();

        Optional<Inscripcion> resultado = service.inscribirEstudiante(idEstudiante, idCurso);

        if (resultado.isPresent()) {
            return ResponseEntity.ok(resultado.get());
        } else {
            return ResponseEntity.status(409).body("El estudiante ya está inscrito en este curso.");
        }
    }

    // Actualizar inscripción por ID
    @PutMapping("/{id}")
    public ResponseEntity<Inscripcion> actualizar(@PathVariable Long id, @RequestBody Inscripcion inscripcion) {
        return service.actualizar(id, inscripcion)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Eliminar inscripción
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (service.eliminar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Listar cursos por estudiante
    @GetMapping("/estudiante/{idEstudiante}")
    public ResponseEntity<List<Curso>> listarCursosPorEstudiante(@PathVariable Long idEstudiante) {
        List<Curso> cursos = service.listarCursosPorEstudiante(idEstudiante);
        return ResponseEntity.ok(cursos);
    }

    // Listar estudiantes por curso
    @GetMapping("/curso/{idCurso}/estudiantes")
    public ResponseEntity<List<Estudiante>> obtenerEstudiantesPorCurso(@PathVariable Long idCurso) {
        List<Estudiante> estudiantes = service.obtenerEstudiantesPorCursoId(idCurso);
        return ResponseEntity.ok(estudiantes);
    }
}
