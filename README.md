# 🎵 CampusMusic

**CampusMusic** es un sistema académico diseñado para la gestión de estudiantes, profesores, cursos y reservas de instrumentos musicales.  
El proyecto utiliza **MongoDB** e implementa configuraciones de seguridad, roles personalizados, transacciones y consultas de agregación para dar soporte a la operación de una escuela de música distribuida en diferentes sedes.  

---

## 📂 Estructura del Proyecto

- **`db_config.js`** → Definición de colecciones con validaciones `$jsonSchema`, índices y reglas de negocio:
  - `usuarios`, `profesores`, `estudiantes`, `sedes`, `cursos`, `inscripciones`, `instrumentos`, `reservas_instrumentos`.

- **`roles.js`** → Creación de **roles personalizados** y usuarios en MongoDB:
  - `adminCampus` → acceso total.
  - `empleadoSede` → gestión de inscripciones y reservas.
  - `estudianteCampus` → lectura de cursos y reservas.
  - Usuarios de ejemplo (`admin1`, `empleado1`, `estudiante1`).

- **`transactions.js`** → Ejemplo de **transacción**:
  - Inscripción de un estudiante a un curso.
  - Verificación de cupos.
  - Inserción en `inscripciones`.
  - Decremento de cupo en `cursos`.
  - Manejo de errores con `abortTransaction`.

- **`aggregations.js`** → Consultas de **agregación avanzada**:
  - Estudiantes inscritos por sede en el último mes.
  - Cursos más populares por sede.
  - Ingreso total por sede en el último año.
  - Profesor con más estudiantes inscritos.
  - Instrumento más reservado.
  - Cursos de un estudiante con detalles de profesor y sede.
  - Detección de cursos con cupos casi completos.

- **`test_dataset.js`** → Conjunto de datos de prueba para inicializar la base de datos.  

---

## 🚀 Instalación y Uso

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/Jharmo05/CampusMusic.git
   cd CampusMusic
   ```

2. Iniciar MongoDB y acceder a la shell:
   ```bash
   mongosh
   ```

3. Ejecutar la configuración inicial:
   ```javascript
   load("db_config.js")
   ```

4. Crear roles y usuarios:
   ```javascript
   load("roles.js")
   ```

5. Insertar dataset de prueba:
   ```javascript
   load("test_dataset.js")
   ```

6. Probar transacciones:
   ```javascript
   load("transactions.js")
   ```

7. Ejecutar consultas de agregación:
   ```javascript
   load("aggregations.js")
   ```

---

## 🔒 Roles y Seguridad

- **Administrador (`adminCampus`)** → gestión completa de la base.  
- **Empleado de sede (`empleadoSede`)** → inscripción de estudiantes y reservas.  
- **Estudiante (`estudianteCampus`)** → visualización de cursos, inscripciones y reservas personales.  

---

## 📊 Funcionalidades Clave

✔ Gestión de estudiantes, profesores, cursos y sedes.  
✔ Inscripciones con validación de cupos.  
✔ Reservas de instrumentos por usuario y sede.  
✔ Roles con permisos diferenciados.  
✔ Reportes con **pipelines de agregación**.  
✔ Transacciones seguras con `startTransaction()`.  

---

## 👨‍💻 Autor

Proyecto desarrollado como práctica de **MongoDB**. 
Realizado por: Jhon Sebastian Ardila Moreno 
Repositorio: [Campus-Music](https://github.com/Jharmo05/Campus_music)  
