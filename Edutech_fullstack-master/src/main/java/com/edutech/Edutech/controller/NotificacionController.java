package com.edutech.Edutech.controller;

import com.edutech.Edutech.model.Notificacion;
import com.edutech.Edutech.service.NotificacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Controlador REST para manejar solicitudes relacionadas con notificaciones
@RestController
@RequestMapping("/api/notificaciones")
public class NotificacionController {

    // Inyección del servicio que maneja la lógica y datos de notificaciones
    @Autowired
    private NotificacionService service;

    // GET /api/notificaciones
    // Devuelve la lista completa de todas las notificaciones
    @GetMapping
    public List<Notificacion> listar() {
        return service.listarTodos();
    }

    // GET /api/notificaciones/{id}
    // Busca una notificación por su id
    // Responde 200 con la notificación si existe o 404 si no la encuentra
    @GetMapping("/{id}")
    public ResponseEntity<Notificacion> buscar(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/notificaciones
    // Crea una nueva notificación con los datos recibidos en el cuerpo de la solicitud
    @PostMapping
    public Notificacion crear(@RequestBody Notificacion notificacion) {
        return service.guardar(notificacion);
    }

    // PUT /api/notificaciones/{id}
    // Actualiza una notificación existente identificada por id con los nuevos datos
    // Responde 200 con la notificación actualizada o 404 si no se encuentra
    @PutMapping("/{id}")
    public ResponseEntity<Notificacion> actualizar(@PathVariable Long id, @RequestBody Notificacion notificacion) {
        return service.actualizar(id, notificacion)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/notificaciones/{id}
    // Elimina una notificación por id
    // Responde 204 No Content si fue eliminada o 404 si no existe
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (service.eliminar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
