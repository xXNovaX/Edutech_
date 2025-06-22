package com.edutech.Edutech.repository;

import com.edutech.Edutech.model.Archivo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ArchivoRepository extends JpaRepository<Archivo, Long> {
    List<Archivo> findBySeccionId(Long seccionId);
}


