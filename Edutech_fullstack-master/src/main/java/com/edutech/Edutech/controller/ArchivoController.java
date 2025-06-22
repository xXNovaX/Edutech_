package com.edutech.Edutech.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Optional;
import java.util.List;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.edutech.Edutech.model.Archivo;
import com.edutech.Edutech.service.ArchivoService;


import org.springframework.beans.factory.annotation.Autowired;
import com.edutech.Edutech.repository.ArchivoRepository;

@RestController
@RequestMapping("/api/archivos")
public class ArchivoController {

    private final ArchivoService archivoService;

    public ArchivoController(ArchivoService archivoService) {
        this.archivoService = archivoService;
    }

    // ✅ Endpoint para subir archivo
    @PostMapping("/subir")
    public ResponseEntity<?> subirArchivo(
            @RequestParam("archivo") MultipartFile archivo,
            @RequestParam("seccionId") Long seccionId) {
        try {
            Archivo guardado = archivoService.guardarArchivo(archivo, seccionId);
            return ResponseEntity.ok(guardado);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al guardar archivo");
        }
    }

    // ✅ Nuevo endpoint para eliminar archivo
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarArchivo(@PathVariable Long id) {
        try {
            archivoService.eliminarArchivo(id);
            return ResponseEntity.ok("Archivo eliminado");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar archivo");
        }
    }

    // ✅ Endpoint para descargar archivo
    @GetMapping("/descargar/{id}")
    public ResponseEntity<?> descargarArchivo(@PathVariable Long id) {
        Optional<Archivo> archivoOpt = archivoService.obtenerArchivoPorId(id);
        if (archivoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Archivo archivo = archivoOpt.get();
        File file = new File(archivo.getRuta());

        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        try {
            InputStreamResource recurso = new InputStreamResource(new FileInputStream(file));
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"" + archivo.getNombre() + "\"")
                    .contentType(MediaType.parseMediaType(archivo.getTipo()))
                    .body(recurso);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al descargar archivo");
        }
    }

    /*// ✅ Listar archivos por sección
    @GetMapping("/seccion/{seccionId}")
    public ResponseEntity<?> listarArchivosPorSeccion(@PathVariable Long seccionId) {
        return ResponseEntity.ok(archivoService.obtenerArchivosPorSeccion(seccionId));
    }*/

    @GetMapping("/seccion/{seccionId}")
    public ResponseEntity<List<Archivo>> listarPorSeccion(@PathVariable Long seccionId) {
    List<Archivo> archivos = archivoService.obtenerArchivosPorSeccion(seccionId); // ✅
    return ResponseEntity.ok(archivos);
}


}
