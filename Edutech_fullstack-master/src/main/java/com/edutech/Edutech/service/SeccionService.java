package com.edutech.Edutech.service;

import com.edutech.Edutech.model.Seccion;
import com.edutech.Edutech.model.Curso;
import com.edutech.Edutech.repository.SeccionRepository;
import com.edutech.Edutech.repository.CursoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SeccionService {

    @Autowired
    private SeccionRepository seccionRepository;

    

    @Autowired
    private CursoRepository cursoRepository;

    public Seccion crearSeccion(Seccion seccion) {
        Long cursoId = seccion.getCurso().getId();
        System.out.println("Recibido ID de curso: " + cursoId);

        Curso curso = cursoRepository.findById(cursoId)
            .orElseThrow(() -> new RuntimeException("Curso no encontrado con ID: " + cursoId));

        System.out.println("Curso encontrado: " + curso.getNombre()); // Asumiendo que tiene nombre
        System.out.println("Sección recibida: " + seccion.getTitulo());
        System.out.println("Curso recibido: " + seccion.getCurso());

        seccion.setCurso(curso);

        return seccionRepository.save(seccion);
    }




    public List<Seccion> listarSecciones() {
        return seccionRepository.findAll();
    }

    public Optional<Seccion> buscarPorId(Long id) {
        return seccionRepository.findById(id);
    }

    public void eliminarSeccion(Long id) {
        seccionRepository.deleteById(id);
    }

    public Seccion actualizarSeccion(Long id, Seccion datosActualizados) {
        return seccionRepository.findById(id).map(seccion -> {
            seccion.setTitulo(datosActualizados.getTitulo());
            return seccionRepository.save(seccion);
        }).orElseThrow(() -> new RuntimeException("Sección no encontrada"));
    }

    public List<Seccion> listarPorCurso(Long cursoId) {
        return seccionRepository.findAll().stream()
            .filter(s -> s.getCurso() != null && s.getCurso().getId().equals(cursoId))
            .toList();
    }

}
