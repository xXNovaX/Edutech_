package com.edutech.Edutech.controller;

import com.edutech.Edutech.model.Seccion;
import com.edutech.Edutech.service.SeccionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.*;

import java.util.List;

@RestController
@RequestMapping("/api/secciones")
public class SeccionController {

    @Autowired
    private SeccionService seccionService;

    /*@PostMapping
    public ResponseEntity<Seccion> crearSeccion(@RequestBody Seccion seccion) {
        Seccion nueva = seccionService.crearSeccion(seccion);
        return ResponseEntity.ok(nueva);
    }*/

    @PutMapping("/{id}/descripcion")
public ResponseEntity<Seccion> actualizarDescripcion(@PathVariable Long id, @RequestBody String nuevaDescripcion) {
    return seccionService.buscarPorId(id)
        .map(seccion -> {
            seccion.setDescripcion(nuevaDescripcion);
            return ResponseEntity.ok(seccionService.crearSeccion(seccion));
        })
        .orElse(ResponseEntity.notFound().build());
}

@PostMapping("/{id}/archivo")
public ResponseEntity<?> subirArchivo(@PathVariable Long id, @RequestParam("archivo") MultipartFile archivo) {
    try {
        String nombreArchivo = archivo.getOriginalFilename();
        Path ruta = Paths.get("uploads", nombreArchivo);
        Files.createDirectories(ruta.getParent());
        Files.write(ruta, archivo.getBytes());
        return ResponseEntity.ok("Archivo subido correctamente");
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body("Error al subir archivo");
    }
}



    @PostMapping
    public ResponseEntity<?> crearSeccion(@RequestBody Seccion seccion) {
        try {
            System.out.println(">>> Recibido en controller:");
            System.out.println("Título: " + seccion.getTitulo());
            if (seccion.getCurso() != null) {
                System.out.println("Curso ID: " + seccion.getCurso().getId());
            } else {
                System.out.println("Curso es null");
            }

            Seccion nueva = seccionService.crearSeccion(seccion);
            return ResponseEntity.ok(nueva);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }


    @GetMapping
    public ResponseEntity<List<Seccion>> listarSecciones() {
        return ResponseEntity.ok(seccionService.listarSecciones());
    }

    @GetMapping("/curso/{cursoId}")
    public ResponseEntity<List<Seccion>> listarSeccionesPorCurso(@PathVariable Long cursoId) {
        return ResponseEntity.ok(seccionService.listarPorCurso(cursoId));
    }


    @GetMapping("/{id}")
    public ResponseEntity<Seccion> obtenerSeccion(@PathVariable Long id) {
        return seccionService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Seccion> actualizarSeccion(@PathVariable Long id, @RequestBody Seccion datos) {
        return ResponseEntity.ok(seccionService.actualizarSeccion(id, datos));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarSeccion(@PathVariable Long id) {
        seccionService.eliminarSeccion(id);
        return ResponseEntity.ok().build();
    }

    
}
