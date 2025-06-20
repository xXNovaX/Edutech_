package com.edutech.Edutech.service;

import com.edutech.Edutech.model.Evaluacion;
import com.edutech.Edutech.repository.EvaluacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// Servicio que maneja la lógica de negocio para Evaluaciones
@Service
public class EvaluacionService {

    // Inyección del repositorio para acceso a datos de Evaluacion
    @Autowired
    private EvaluacionRepository repo;

    // Devuelve una lista con todas las evaluaciones registradas
    public List<Evaluacion> listarTodos() {
        return repo.findAll();
    }

    // Busca una evaluación por su id, devuelve Optional para manejar ausencia
    public Optional<Evaluacion> buscarPorId(Long id) {
        return repo.findById(id);
    }

    // Guarda una nueva evaluación o actualiza una existente
    public Evaluacion guardar(Evaluacion evaluacion) {
        return repo.save(evaluacion);
    }

    // Actualiza los datos de una evaluación existente si se encuentra por id
    public Optional<Evaluacion> actualizar(Long id, Evaluacion evaluacion) {
        return repo.findById(id).map(e -> {
            e.setIdCurso(evaluacion.getIdCurso());
            e.setIdEstudiante(evaluacion.getIdEstudiante());
            e.setNota(evaluacion.getNota());
            e.setFecha(evaluacion.getFecha());
            return repo.save(e);
        });
    }

    // Elimina una evaluación si existe, devuelve true si se eliminó
    public boolean eliminar(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return true;
        }
        return false;
    }
}
