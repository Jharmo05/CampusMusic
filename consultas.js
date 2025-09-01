use campusMusic

// ==========================
// 1. USUARIOS
// ==========================
db.createCollection("usuarios", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nombre", "apellido", "email", "rol", "cedula"],
      properties: {
        nombre: { bsonType: "string" },
        apellido: { bsonType: "string" },
        email: { bsonType: "string", pattern: "^.+@.+\\..+$" },
        rol: { enum: ["administrador", "empleado", "estudiante"] },
        cedula: { bsonType: "string" },
        telefono: { bsonType: "string" },
        fecha_registro: { bsonType: "date" }
      }
    }
  }
})
db.usuarios.createIndex({ cedula: 1 }, { unique: true })
db.usuarios.createIndex({ email: 1 }, { unique: true })

// ==========================
// 2. PROFESORES
// ==========================
db.createCollection("profesores", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nombre", "apellido", "especialidad", "cedula"],
      properties: {
        nombre: { bsonType: "string" },
        apellido: { bsonType: "string" },
        cedula: { bsonType: "string" },
        especialidad: { bsonType: "string" },
        telefono: { bsonType: "string" },
        email: { bsonType: "string", pattern: "^.+@.+\\..+$" },
        fecha_ingreso: { bsonType: "date" }
      }
    }
  }
})
db.profesores.createIndex({ cedula: 1 }, { unique: true })

// ==========================
// 3. ESTUDIANTES
// ==========================
db.createCollection("estudiantes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nombre", "apellido", "cedula"],
      properties: {
        nombre: { bsonType: "string" },
        apellido: { bsonType: "string" },
        cedula: { bsonType: "string" },
        email: { bsonType: "string", pattern: "^.+@.+\\..+$" },
        telefono: { bsonType: "string" },
        direccion: { bsonType: "string" },
        fecha_nacimiento: { bsonType: "date" }
      }
    }
  }
})
db.estudiantes.createIndex({ cedula: 1 }, { unique: true })

// ==========================
// 4. SEDES
// ==========================
db.createCollection("sedes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nombre", "direccion", "zona"],
      properties: {
        nombre: { bsonType: "string" },
        direccion: { bsonType: "string" },
        zona: { enum: ["norte", "sur", "este", "oeste", "centro"] },
        telefono: { bsonType: "string" }
      }
    }
  }
})
db.sedes.createIndex({ zona: 1 })

// ==========================
// 5. CURSOS
// ==========================
db.createCollection("cursos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nombre", "profesor_id", "sede_id"],
      properties: {
        nombre: { bsonType: "string" },
        descripcion: { bsonType: "string" },
        profesor_id: { bsonType: "objectId" },
        sede_id: { bsonType: "objectId" },
        cupo_maximo: { bsonType: "int", minimum: 1 }
      }
    }
  }
})
db.cursos.createIndex({ nombre: 1, sede_id: 1 }, { unique: true })

// ==========================
// 6. INSCRIPCIONES
// ==========================
db.createCollection("inscripciones", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["estudiante_id", "curso_id", "fecha_inscripcion"],
      properties: {
        estudiante_id: { bsonType: "objectId" },
        curso_id: { bsonType: "objectId" },
        fecha_inscripcion: { bsonType: "date" },
        estado: { enum: ["activa", "finalizada", "cancelada"] }
      }
    }
  }
})
db.inscripciones.createIndex({ estudiante_id: 1, curso_id: 1 }, { unique: true })

// ==========================
// 7. INSTRUMENTOS
// ==========================
db.createCollection("instrumentos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nombre", "tipo", "estado"],
      properties: {
        nombre: { bsonType: "string" },
        tipo: { enum: ["cuerda", "viento", "percusión", "teclado", "otro"] },
        estado: { enum: ["disponible", "reservado", "mantenimiento"] },
        sede_id: { bsonType: "objectId" }
      }
    }
  }
})
db.instrumentos.createIndex({ nombre: 1, sede_id: 1 })

// ==========================
// 8. RESERVAS DE INSTRUMENTOS
// ==========================
db.createCollection("reservas_instrumentos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["instrumento_id", "usuario_id", "fecha_reserva"],
      properties: {
        instrumento_id: { bsonType: "objectId" },
        usuario_id: { bsonType: "objectId" },
        fecha_reserva: { bsonType: "date" },
        fecha_devolucion: { bsonType: "date" },
        estado: { enum: ["activa", "finalizada", "cancelada"] }
      }
    }
  }
})
db.reservas_instrumentos.createIndex({ instrumento_id: 1, usuario_id: 1 })
