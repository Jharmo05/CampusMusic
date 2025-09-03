use campusMusic // 🎶 Conectamos a la base de datos de nuestra academia de música

// ==========================
// 1. USUARIOS 👤
// ==========================
db.createCollection("usuarios", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nombre", "apellido", "email", "rol", "cedula"], // ❗ Campos obligatorios para cada usuario
      properties: {
        nombre: { bsonType: "string" },
        apellido: { bsonType: "string" },
        email: { bsonType: "string", pattern: "^.+@.+\\..+$" }, // 📧 Validamos que el email tenga un formato correcto
        rol: { enum: ["administrador", "empleado", "estudiante"] }, // 🎭 Rol del usuario, ¡solo estos son válidos!
        cedula: { bsonType: "string" },
        telefono: { bsonType: "string" },
        fecha_registro: { bsonType: "date" }
      }
    }
  }
})
db.usuarios.createIndex({ cedula: 1 }, { unique: true }) // 🔑 Aseguramos que la cédula sea única
db.usuarios.createIndex({ email: 1 }, { unique: true }) // 🔑 También el email para evitar duplicados

// ==========================
// 2. PROFESORES 👨‍🏫
// ==========================
db.createCollection("profesores", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nombre", "apellido", "especialidad", "cedula"], // ❗ Info esencial para el profesor
      properties: {
        nombre: { bsonType: "string" },
        apellido: { bsonType: "string" },
        cedula: { bsonType: "string" },
        especialidad: { bsonType: "string" }, // 🎻 La especialidad musical del profesor
        telefono: { bsonType: "string" },
        email: { bsonType: "string", pattern: "^.+@.+\\..+$" },
        fecha_ingreso: { bsonType: "date" } // 🗓️ Cuando se unió a la orquesta de profesores
      }
    }
  }
})
db.profesores.createIndex({ cedula: 1 }, { unique: true }) // 🔑 Cédula de profesor, ¡única e irrepetible!

// ==========================
// 3. ESTUDIANTES 🎓
// ==========================
db.createCollection("estudiantes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nombre", "apellido", "cedula"], // ❗ Campos principales para el estudiante
      properties: {
        nombre: { bsonType: "string" },
        apellido: { bsonType: "string" },
        cedula: { bsonType: "string" },
        email: { bsonType: "string", pattern: "^.+@.+\\..+$" },
        telefono: { bsonType: "string" },
        direccion: { bsonType: "string" },
        fecha_nacimiento: { bsonType: "date" } // 🎂 Fecha de nacimiento
      }
    }
  }
})
db.estudiantes.createIndex({ cedula: 1 }, { unique: true }) // 🔑 Cédula única para identificar a cada estudiante

// ==========================
// 4. SEDES 🏢
// ==========================
db.createCollection("sedes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nombre", "direccion", "zona"], // ❗ Los datos básicos de cada campus
      properties: {
        nombre: { bsonType: "string" },
        direccion: { bsonType: "string" },
        zona: { enum: ["norte", "sur", "este", "oeste", "centro"] }, // 🗺️ Zonas geográficas
        telefono: { bsonType: "string" }
      }
    }
  }
})
db.sedes.createIndex({ zona: 1 }) // ⚡ Índice para búsquedas rápidas por zona

// ==========================
// 5. CURSOS 📚
// ==========================
db.createCollection("cursos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nombre", "profesor_id", "sede_id"], // ❗ Lo mínimo para un curso
      properties: {
        nombre: { bsonType: "string" },
        descripcion: { bsonType: "string" },
        profesor_id: { bsonType: "objectId" }, // 🔗 Referencia al profesor que imparte el curso
        sede_id: { bsonType: "objectId" }, // 🔗 Referencia a la sede donde se da el curso
        cupo_maximo: { bsonType: "int", minimum: 1 } // 🔢 El límite de estudiantes
      }
    }
  }
})
db.cursos.createIndex({ nombre: 1, sede_id: 1 }, { unique: true }) // 🔑 Un curso con el mismo nombre en la misma sede es único

// ==========================
// 6. INSCRIPCIONES ✍️
// ==========================
db.createCollection("inscripciones", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["estudiante_id", "curso_id", "fecha_inscripcion"], // ❗ Datos clave de la inscripción
      properties: {
        estudiante_id: { bsonType: "objectId" }, // 🔗 El estudiante que se inscribe
        curso_id: { bsonType: "objectId" }, // 🔗 El curso al que se inscribe
        fecha_inscripcion: { bsonType: "date" },
        estado: { enum: ["activa", "finalizada", "cancelada"] } // 🚦 Estado de la inscripción
      }
    }
  }
})
db.inscripciones.createIndex({ estudiante_id: 1, curso_id: 1 }, { unique: true }) // 🔑 Un estudiante solo puede inscribirse una vez en un curso

// ==========================
// 7. INSTRUMENTOS 🎸
// ==========================
db.createCollection("instrumentos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nombre", "tipo", "estado"], // ❗ Lo que necesitamos saber de un instrumento
      properties: {
        nombre: { bsonType: "string" },
        tipo: { enum: ["cuerda", "viento", "percusión", "teclado", "otro"] }, // 🎶 Tipo de instrumento
        estado: { enum: ["disponible", "reservado", "mantenimiento"] }, // 🛠️ Estado actual
        sede_id: { bsonType: "objectId" } // 🔗 Dónde se encuentra el instrumento
      }
    }
  }
})
db.instrumentos.createIndex({ nombre: 1, sede_id: 1 }) // ⚡ Índice para encontrar instrumentos por nombre y sede

// ==========================
// 8. RESERVAS DE INSTRUMENTOS 🗓️
// ==========================
db.createCollection("reservas_instrumentos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["instrumento_id", "usuario_id", "fecha_reserva"], // ❗ Los datos de la reserva
      properties: {
        instrumento_id: { bsonType: "objectId" }, // 🔗 El instrumento reservado
        usuario_id: { bsonType: "objectId" }, // 🔗 El usuario que lo reserva
        fecha_reserva: { bsonType: "date" }, // 🗓️ Día de la reserva
        fecha_devolucion: { bsonType: "date" }, // 🗓️ Día de la devolución
        estado: { enum: ["activa", "finalizada", "cancelada"] } // 🚦 Estado de la reserva
      }
    }
  }
})
db.reservas_instrumentos.createIndex({ instrumento_id: 1, usuario_id: 1 }) // ⚡ Índice para ver reservas de un instrumento por usuario