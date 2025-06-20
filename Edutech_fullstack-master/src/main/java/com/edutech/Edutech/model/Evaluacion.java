package com.edutech.Edutech.model;

import jakarta.persistence.*;
import java.time.LocalDate;

// Esta clase representa la entidad Evaluacion, que se mapea a una tabla en la base de datos
@Entity
public class Evaluacion {

    // Clave primaria con generación automática (auto-incremental)
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ID del estudiante que recibe la evaluación (clave foránea implícita)
    private Long idEstudiante;

    // ID del curso asociado a la evaluación (clave foránea implícita)
    private Long idCurso;

    // Nota o calificación obtenida por el estudiante en la evaluación
    private Double nota;

    // Fecha en que se realizó la evaluación
    private LocalDate fecha;

    // Getters y setters para todos los atributos

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getIdEstudiante() { return idEstudiante; }
    public void setIdEstudiante(Long idEstudiante) { this.idEstudiante = idEstudiante; }

    public Long getIdCurso() { return idCurso; }
    public void setIdCurso(Long idCurso) { this.idCurso = idCurso; }

    public Double getNota() { return nota; }
    public void setNota(Double nota) { this.nota = nota; }

    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
}
