package com.edutech.Edutech.controller;

import com.edutech.Edutech.model.Estudiante;
import com.edutech.Edutech.service.EstudianteService;
import com.edutech.Edutech.service.InscripcionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

// Marca esta clase como un controlador REST que responde en la ruta /api/estudiantes
@RestController
@RequestMapping("/api/estudiantes")
// Permite solicitudes de cualquier origen (CORS) para evitar bloqueos en frontend separados
@CrossOrigin(origins = "*")
public class EstudianteController {

    // Inyección del servicio para manejar la lógica y datos de estudiantes
    @Autowired
    private EstudianteService service;

    // GET /api/estudiantes
    // Devuelve una lista con todos los estudiantes
    @GetMapping
    public List<Estudiante> listar() {
        return service.listarTodos();
    }

    // GET /api/estudiantes/{id}
    // Busca un estudiante por su id y devuelve 200 con el estudiante o 404 si no existe
    @GetMapping("/{id}")
    public ResponseEntity<Estudiante> buscar(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/estudiantes
    // Crea un nuevo estudiante con los datos recibidos en el cuerpo JSON
    @PostMapping
    public Estudiante crear(@RequestBody Estudiante estudiante) {
        return service.guardar(estudiante);
    }

    // PUT /api/estudiantes/{id}
    // Actualiza un estudiante existente identificado por id con datos del cuerpo JSON
    @PutMapping("/{id}")
    public ResponseEntity<Estudiante> actualizar(@PathVariable Long id, @RequestBody Estudiante estudiante) {
        return service.actualizar(id, estudiante)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/estudiantes/{id}
    // Elimina un estudiante por id, devuelve 204 si fue eliminado, o 404 si no existe
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (service.eliminar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // POST /api/estudiantes/register
    // Registro público para crear un nuevo usuario con rol fijo "ESTUDIANTE"
    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody Estudiante estudiante) {
        try {
            estudiante.setRol("ESTUDIANTE"); // asegura que el rol siempre sea "ESTUDIANTE" al registrarse
            Estudiante nuevo = service.guardar(estudiante);
            return ResponseEntity.ok(nuevo);
        } catch (RuntimeException e) {
            // Si hay error (por ejemplo, email duplicado), devuelve un 400 con el mensaje
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


   @Autowired
private InscripcionService inscripcionService;

@GetMapping("/cursos/{id}/estudiantes")
public ResponseEntity<List<Estudiante>> getEstudiantesPorCurso(@PathVariable Long id) {
    List<Estudiante> estudiantes = inscripcionService.obtenerEstudiantesPorCursoId(id);
    return ResponseEntity.ok(estudiantes);
}


    // POST /api/estudiantes/login
    // Autenticación por correo y contraseña
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String correo = loginData.get("correo");
        String password = loginData.get("password");

        // Busca el estudiante que coincida con correo y password
        Optional<Estudiante> optEst = service.login(correo, password);
        if (optEst.isPresent()) {
            Estudiante est = optEst.get();
            // Devuelve 200 con el objeto estudiante si las credenciales son correctas
            return ResponseEntity.ok(est);
        } else {
            // Si no coincide, responde con 401 Unauthorized y mensaje de error
            return ResponseEntity.status(401).body("Correo o contraseña incorrectos");
        }
    }

    // POST /api/estudiantes/crear-docente?adminCorreo=...
    // Endpoint para crear un docente, solo accesible si el correo de quien hace la petición es de un admin
    @PostMapping("/crear-docente")
    public ResponseEntity<?> crearDocente(@RequestBody Estudiante docente, @RequestParam String adminCorreo) {
        // Busca al admin por correo para validar permisos
        Optional<Estudiante> adminOpt = service.buscarPorCorreo(adminCorreo);
        if (adminOpt.isEmpty() || !"ADMIN".equals(adminOpt.get().getRol())) {
            // Si no existe o no es admin, responde 403 Forbidden
            return ResponseEntity.status(403).body("No autorizado. Solo admins pueden crear docentes.");
        }
        try {
            docente.setRol("DOCENTE"); // fija rol de docente al nuevo usuario
            Estudiante nuevoDocente = service.guardar(docente);
            return ResponseEntity.ok(nuevoDocente);
        } catch (RuntimeException e) {
            // Captura errores como datos inválidos y responde con 400
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

