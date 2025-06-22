package com.edutech.Edutech.repository;

import com.edutech.Edutech.model.Seccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SeccionRepository extends JpaRepository<Seccion, Long> {
    // Aquí puedes agregar métodos personalizados si necesitas luego
}
