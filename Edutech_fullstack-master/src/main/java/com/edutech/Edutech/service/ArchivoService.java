package com.edutech.Edutech.service;

import com.edutech.Edutech.model.Archivo;
import com.edutech.Edutech.model.Seccion;
import com.edutech.Edutech.repository.ArchivoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.Optional;
import java.util.List;


@Service
public class ArchivoService {

    @Value("${ruta.archivos}")
    private String rutaArchivos;

    @Autowired
    private ArchivoRepository archivoRepository;

    public Archivo guardarArchivo(MultipartFile archivo, Long seccionId) throws IOException {
        String nombre = archivo.getOriginalFilename();

        // Convertir ruta relativa a absoluta (dentro del proyecto)
        String rutaBase = new File(rutaArchivos).getAbsolutePath();
        String ruta = rutaBase + File.separator + nombre;

        // Crear carpeta si no existe
        File directorio = new File(rutaBase);
        if (!directorio.exists()) {
            directorio.mkdirs();
        }

        // Guardar archivo en disco
        archivo.transferTo(new File(ruta));

        // Registrar en base de datos
        Archivo nuevo = new Archivo();
        nuevo.setNombre(nombre);
        nuevo.setRuta(ruta);
        nuevo.setTipo(archivo.getContentType());
        nuevo.setFechaSubida(LocalDate.now());

        Seccion seccion = new Seccion();
        seccion.setId(seccionId);
        nuevo.setSeccion(seccion);

        return archivoRepository.save(nuevo);
    }

    public void eliminarArchivo(Long id) {
    archivoRepository.deleteById(id);
}

public Optional<Archivo> obtenerArchivoPorId(Long id) {
    return archivoRepository.findById(id);
}

public List<Archivo> obtenerArchivosPorSeccion(Long seccionId) {
    return archivoRepository.findBySeccionId(seccionId);
}

}

