package com.edutech.Edutech.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Evaluacion {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne
    @JoinColumn(name = "id_estudiante")
    private Estudiante estudiante;

    @ManyToOne
    @JoinColumn(name = "id_curso")
    private Curso curso;

    private Double nota;

    private Double ponderacion;

    private LocalDate fecha;

    public Evaluacion() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }


    public Estudiante getEstudiante() { return estudiante; }
    public void setEstudiante(Estudiante estudiante) { this.estudiante = estudiante; }

    public Curso getCurso() { return curso; }
    public void setCurso(Curso curso) { this.curso = curso; }

    public Double getNota() { return nota; }
    public void setNota(Double nota) { this.nota = nota; }

    public Double getPonderacion() { return ponderacion; }
    public void setPonderacion(Double ponderacion) { this.ponderacion = ponderacion; }

    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
}
