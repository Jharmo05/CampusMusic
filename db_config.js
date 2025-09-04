use campusMusic // 🎶 Nos conectamos a la base de datos principal de nuestra academia de música

// ==========================
// 1. USUARIOS 👤
// ==========================
db.createCollection("usuarios", { // 📂 Creamos la colección "usuarios"
  validator: { // ✅ Agregamos un validador para que los datos sean correctos
    $jsonSchema: { // 📜 Usamos JSON Schema para validar documentos
      bsonType: "object", // 📦 Cada documento debe ser un objeto
      required: ["nombre", "apellido", "email", "rol", "cedula"], // ❗ Campos obligatorios
      properties: { // 📝 Propiedades permitidas
        nombre: { bsonType: "string" }, // 🏷️ Nombre (string)
        apellido: { bsonType: "string" }, // 🏷️ Apellido (string)
        email: { bsonType: "string", pattern: "^.+@.+\..+$" }, // 📧 Email con formato válido
        rol: { enum: ["administrador", "empleado", "estudiante"] }, // 🎭 Rol permitido
        cedula: { bsonType: "string" }, // 🆔 Documento de identidad
        telefono: { bsonType: "string" }, // ☎️ Teléfono (opcional)
        fecha_registro: { bsonType: "date" } // 📅 Fecha de registro (opcional)
      }
    }
  }
}) // ✅ Colección creada con validador
db.usuarios.createIndex({ cedula: 1 }, { unique: true }) // 🔑 Índice único por cédula
db.usuarios.createIndex({ email: 1 }, { unique: true }) // 🔑 Índice único por email

// ==========================
// 2. PROFESORES 👨‍🏫
// ==========================
db.createCollection("profesores", { // 📂 Creamos la colección "profesores"
  validator: { // ✅ Validador para profesores
    $jsonSchema: { // 📜 Esquema
      bsonType: "object", // 📦 Cada documento es un objeto
      required: ["nombre", "apellido", "especialidad", "cedula"], // ❗ Campos obligatorios
      properties: { // 📝 Propiedades permitidas
        nombre: { bsonType: "string" }, // 🏷️ Nombre
        apellido: { bsonType: "string" }, // 🏷️ Apellido
        cedula: { bsonType: "string" }, // 🆔 Documento único
        especialidad: { bsonType: "string" }, // 🎶 Qué enseña
        telefono: { bsonType: "string" }, // ☎️ Teléfono (opcional)
        email: { bsonType: "string", pattern: "^.+@.+\..+$" }, // 📧 Email (opcional)
        fecha_ingreso: { bsonType: "date" } // 🗓️ Fecha de ingreso (opcional)
      }
    }
  }
}) // ✅ Colección creada
db.profesores.createIndex({ cedula: 1 }, { unique: true }) // 🔑 Índice único por cédula

// ==========================
// 3. ESTUDIANTES 🎓
// ==========================
db.createCollection("estudiantes", { // 📂 Creamos la colección "estudiantes"
  validator: { // ✅ Validador para estudiantes
    $jsonSchema: { // 📜 Esquema
      bsonType: "object", // 📦 Objeto
      required: ["nombre", "apellido", "cedula"], // ❗ Requeridos
      properties: { // 📝 Propiedades
        nombre: { bsonType: "string" }, // 🏷️ Nombre
        apellido: { bsonType: "string" }, // 🏷️ Apellido
        cedula: { bsonType: "string" }, // 🆔 Documento único
        email: { bsonType: "string", pattern: "^.+@.+\..+$" }, // 📧 Email (opcional)
        telefono: { bsonType: "string" }, // ☎️ Teléfono (opcional)
        direccion: { bsonType: "string" }, // 🏠 Dirección (opcional)
        fecha_nacimiento: { bsonType: "date" } // 🎂 Fecha de nacimiento (opcional)
      }
    }
  }
}) // ✅ Colección creada
db.estudiantes.createIndex({ cedula: 1 }, { unique: true }) // 🔑 Índice único por cédula

// ==========================
// 4. SEDES 🏢
// ==========================
db.createCollection("sedes", { // 📂 Colección de sedes/campus
  validator: { // ✅ Validador de sedes
    $jsonSchema: { // 📜 Esquema
      bsonType: "object", // 📦 Objeto
      required: ["nombre", "direccion", "zona"], // ❗ Requeridos
      properties: { // 📝 Propiedades
        nombre: { bsonType: "string" }, // 🏷️ Nombre de la sede
        direccion: { bsonType: "string" }, // 📍 Dirección
        zona: { enum: ["norte", "sur", "este", "oeste", "centro"] }, // 🗺️ Zona válida
        telefono: { bsonType: "string" } // ☎️ Teléfono (opcional)
      }
    }
  }
}) // ✅ Colección creada
db.sedes.createIndex({ zona: 1 }) // ⚡ Índice por zona

// ==========================
// 5. CURSOS 📚
// ==========================
db.createCollection("cursos", { // 📂 Colección de cursos
  validator: { // ✅ Validador de cursos
    $jsonSchema: { // 📜 Esquema
      bsonType: "object", // 📦 Objeto
      required: ["nombre", "profesor_id", "sede_id"], // ❗ Requeridos
      properties: { // 📝 Propiedades
        nombre: { bsonType: "string" }, // 🏷️ Nombre del curso
        descripcion: { bsonType: "string" }, // 📝 Descripción (opcional)
        profesor_id: { bsonType: "objectId" }, // 👨‍🏫 Referencia a profesor
        sede_id: { bsonType: "objectId" }, // 🏢 Referencia a sede
        cupo_maximo: { bsonType: "int", minimum: 1 }, // 🔢 Máximo de cupos
        costo: { bsonType: "int", minimum: 0 }, // 💰 Costo del curso (opcional)
        fecha_inicio: { bsonType: "date" }, // 🗓️ Inicio (opcional)
        fecha_fin: { bsonType: "date" }, // 🗓️ Fin (opcional)
        nivel: { bsonType: "string" } // 📊 Nivel (opcional)
      }
    }
  }
}) // ✅ Colección creada
db.cursos.createIndex({ nombre: 1, sede_id: 1 }, { unique: true }) // 🔑 Evita cursos duplicados por sede

// ==========================
// 6. INSCRIPCIONES ✍️
// ==========================
db.createCollection("inscripciones", { // 📂 Colección de inscripciones
  validator: { // ✅ Validador
    $jsonSchema: { // 📜 Esquema
      bsonType: "object", // 📦 Objeto
      required: ["estudiante_id", "curso_id", "fecha_inscripcion"], // ❗ Requeridos
      properties: { // 📝 Propiedades
        estudiante_id: { bsonType: "objectId" }, // 🎓 Ref estudiante
        curso_id: { bsonType: "objectId" }, // 📚 Ref curso
        fecha_inscripcion: { bsonType: "date" }, // 📅 Fecha de inscripción
        estado: { enum: ["activa", "finalizada", "cancelada"] } // 🚦 Estado permitido
      }
    }
  }
}) // ✅ Colección creada
db.inscripciones.createIndex({ estudiante_id: 1, curso_id: 1 }, { unique: true }) // 🔑 Evita inscribir dos veces al mismo curso

// ==========================
// 7. INSTRUMENTOS 🎸
// ==========================
db.createCollection("instrumentos", { // 📂 Colección de instrumentos
  validator: { // ✅ Validador
    $jsonSchema: { // 📜 Esquema
      bsonType: "object", // 📦 Objeto
      required: ["nombre", "tipo", "estado"], // ❗ Requeridos
      properties: { // 📝 Propiedades
        nombre: { bsonType: "string" }, // 🏷️ Nombre del instrumento
        tipo: { enum: ["cuerda", "viento", "percusión", "teclado", "otro"] }, // 🎶 Tipo permitido
        estado: { enum: ["disponible", "reservado", "mantenimiento"] }, // 🔧 Estado permitido
        sede_id: { bsonType: "objectId" } // 🏢 Referencia a sede (opcional)
      }
    }
  }
}) // ✅ Colección creada
db.instrumentos.createIndex({ nombre: 1, sede_id: 1 }) // ⚡ Búsqueda rápida por nombre+sede

// ==========================
// 8. RESERVAS DE INSTRUMENTOS 🗓️
// ==========================
db.createCollection("reservas_instrumentos", { // 📂 Colección de reservas
  validator: { // ✅ Validador
    $jsonSchema: { // 📜 Esquema
      bsonType: "object", // 📦 Objeto
      required: ["instrumento_id", "usuario_id", "fecha_reserva"], // ❗ Requeridos
      properties: { // 📝 Propiedades
        instrumento_id: { bsonType: "objectId" }, // 🎹 Ref instrumento
        usuario_id: { bsonType: "objectId" }, // 👤 Ref usuario
        fecha_reserva: { bsonType: "date" }, // 📅 Fecha de reserva
        fecha_devolucion: { bsonType: "date" }, // 📅 Fecha de devolución (opcional)
        estado: { enum: ["activa", "finalizada", "cancelada"] } // 🚦 Estado permitido
      }
    }
  }
}) // ✅ Colección creada
db.reservas_instrumentos.createIndex({ instrumento_id: 1, usuario_id: 1 }) // ⚡ Índice de consulta común
