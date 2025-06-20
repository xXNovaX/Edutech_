package com.edutech.Edutech.repository;

import com.edutech.Edutech.model.Evaluacion;
import org.springframework.data.jpa.repository.JpaRepository;

// Repositorio para la entidad Evaluacion que extiende JpaRepository
// Esto proporciona métodos CRUD estándar para Evaluacion (guardar, buscar, eliminar, etc.)
public interface EvaluacionRepository extends JpaRepository<Evaluacion, Long> {}
