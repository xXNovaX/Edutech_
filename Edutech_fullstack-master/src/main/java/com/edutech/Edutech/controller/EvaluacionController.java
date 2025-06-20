package com.edutech.Edutech.controller;

import com.edutech.Edutech.model.Evaluacion;
import com.edutech.Edutech.service.EvaluacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Indica que esta clase es un controlador REST que responde en la ruta /api/evaluaciones
@RestController
@RequestMapping("/api/evaluaciones")
public class EvaluacionController {


    @Autowired
    private EvaluacionService evaluacionService;

    @PostMapping("/lote")
    public ResponseEntity<?> guardarEvaluaciones(@RequestBody List<Evaluacion> evaluaciones) {
        try {
            service.guardarEvaluaciones(evaluaciones);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al guardar evaluaciones");
        }
    }


    // Inyecta el servicio que maneja la lógica y acceso a datos para evaluaciones
    @Autowired
    private EvaluacionService service;

    // GET /api/evaluaciones
    // Devuelve la lista de todas las evaluaciones
    @GetMapping
    public List<Evaluacion> listar() {
        return service.listarTodos();
    }

    // GET /api/evaluaciones/{id}
    // Busca una evaluación por su id y devuelve 200 con la evaluación o 404 si no existe
    @GetMapping("/{id}")
    public ResponseEntity<Evaluacion> buscar(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok) // si existe, devuelve OK con la evaluación
                .orElse(ResponseEntity.notFound().build()); // si no, responde 404 Not Found
    }

    // POST /api/evaluaciones
    // Crea una nueva evaluación con los datos enviados en el cuerpo JSON
    @PostMapping
    public Evaluacion crear(@RequestBody Evaluacion evaluacion) {
        return service.guardar(evaluacion);
    }

    // PUT /api/evaluaciones/{id}
    // Actualiza una evaluación existente identificado por id con los datos del cuerpo JSON
    @PutMapping("/{id}")
    public ResponseEntity<Evaluacion> actualizar(@PathVariable Long id, @RequestBody Evaluacion evaluacion) {
        return service.actualizar(id, evaluacion)
                .map(ResponseEntity::ok) // si actualiza correctamente, devuelve OK con la evaluación actualizada
                .orElse(ResponseEntity.notFound().build()); // si no encontró la evaluación, devuelve 404
    }

    // DELETE /api/evaluaciones/{id}
    // Elimina una evaluación por id, responde 204 No Content si fue eliminada, o 404 si no existe
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (service.eliminar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
