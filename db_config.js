use campusMusic // 🎵🎻 ¡Activamos la base de datos musical!

// ==========================
// 1. COLECCIÓN USUARIOS 👥🎭
// ==========================
db.createCollection("usuarios", { // 📦 Creamos la colección de usuarios
  validator: { // 🛡️ Validador de datos para mantener la calidad
    $jsonSchema: { // 📜 Esquema JSON para validación
      bsonType: "object", // 🎯 Cada documento debe ser un objeto
      required: ["nombre", "apellido", "email", "rol", "cedula"], // 🚨 Campos obligatorios
      properties: { // 📋 Propiedades permitidas con restricciones
        nombre: { bsonType: "string" }, // 🏷️ Nombre debe ser texto
        apellido: { bsonType: "string" }, // 🏷️ Apellido debe ser texto
        email: { 
          bsonType: "string", 
          pattern: "^.+@.+\\..+$" // 📧 Formato de email válido
        },
        rol: { 
          enum: ["administrador", "empleado", "estudiante"] // 🎭 Solo roles permitidos
        },
        cedula: { bsonType: "string" }, // 🆔 Cédula como texto
        telefono: { bsonType: "string" }, // 📞 Teléfono opcional
        fecha_registro: { bsonType: "date" } // 📅 Fecha de registro opcional
      }
    }
  }
})
db.usuarios.createIndex({ cedula: 1 }, { unique: true }) // 🔑 Índice único para cédula
db.usuarios.createIndex({ email: 1 }, { unique: true }) // 🔑 Índice único para email

// ==========================
// 2. COLECCIÓN PROFESORES 👨‍🏫🎼
// ==========================
db.createCollection("profesores", { // 📦 Colección de maestros musicales
  validator: { // 🛡️ Validador de datos
    $jsonSchema: { // 📜 Esquema de validación
      bsonType: "object", // 🎯 Documentos tipo objeto
      required: ["nombre", "apellido", "especialidad", "cedula"], // 🚨 Campos requeridos
      properties: { // 📋 Propiedades con validaciones
        nombre: { bsonType: "string" }, // 🏷️ Nombre del profesor
        apellido: { bsonType: "string" }, // 🏷️ Apellido del profesor
        cedula: { bsonType: "string" }, // 🆔 Cédula única
        especialidad: { bsonType: "string" }, // 🎻 Especialidad musical
        telefono: { bsonType: "string" }, // 📞 Teléfono opcional
        email: { 
          bsonType: "string", 
          pattern: "^.+@.+\\..+$" // 📧 Email con formato válido
        },
        fecha_ingreso: { bsonType: "date" } // 🗓️ Fecha de ingreso opcional
      }
    }
  }
})
db.profesores.createIndex({ cedula: 1 }, { unique: true }) // 🔑 Índice único por cédula

// ==========================
// 3. COLECCIÓN ESTUDIANTES 🎓🎸
// ==========================
db.createCollection("estudiantes", { // 📦 Colección de estudiantes
  validator: { // 🛡️ Validador de datos
    $jsonSchema: { // 📜 Esquema de validación
      bsonType: "object", // 🎯 Documentos tipo objeto
      required: ["nombre", "apellido", "cedula"], // 🚨 Campos obligatorios
      properties: { // 📋 Propiedades permitidas
        nombre: { bsonType: "string" }, // 🏷️ Nombre del estudiante
        apellido: { bsonType: "string" }, // 🏷️ Apellido del estudiante
        cedula: { bsonType: "string" }, // 🆔 Cédula única
        email: { 
          bsonType: "string", 
          pattern: "^.+@.+\\..+$" // 📧 Email opcional con formato
        },
        telefono: { bsonType: "string" }, // 📞 Teléfono opcional
        direccion: { bsonType: "string" }, // 🏠 Dirección opcional
        fecha_nacimiento: { bsonType: "date" } // 🎂 Fecha nacimiento opcional
      }
    }
  }
})
db.estudiantes.createIndex({ cedula: 1 }, { unique: true }) // 🔑 Índice único por cédula

// ==========================
// 4. COLECCIÓN SEDES 🏢🎹
// ==========================
db.createCollection("sedes", { // 📦 Colección de sedes/campus
  validator: { // 🛡️ Validador de datos
    $jsonSchema: { // 📜 Esquema de validación
      bsonType: "object", // 🎯 Documentos tipo objeto
      required: ["nombre", "direccion", "zona"], // 🚨 Campos requeridos
      properties: { // 📋 Propiedades permitidas
        nombre: { bsonType: "string" }, // 🏷️ Nombre de la sede
        direccion: { bsonType: "string" }, // 📍 Dirección física
        zona: { 
          enum: ["norte", "sur", "este", "oeste", "centro"] // 🗺️ Zona permitida
        },
        telefono: { bsonType: "string" } // 📞 Teléfono opcional
      }
    }
  }
})
db.sedes.createIndex({ zona: 1 }) // ⚡ Índice por zona para búsquedas rápidas

// ==========================
// 5. COLECCIÓN CURSOS 📚🎷
// ==========================
db.createCollection("cursos", { // 📦 Colección de cursos musicales
  validator: { // 🛡️ Validador de datos
    $jsonSchema: { // 📜 Esquema de validación
      bsonType: "object", // 🎯 Documentos tipo objeto
      required: ["nombre", "profesor_id", "sede_id"], // 🚨 Campos obligatorios
      properties: { // 📋 Propiedades permitidas
        nombre: { bsonType: "string" }, // 🏷️ Nombre del curso
        descripcion: { bsonType: "string" }, // 📝 Descripción opcional
        profesor_id: { bsonType: "objectId" }, // 👨‍🏫 Referencia a profesor
        sede_id: { bsonType: "objectId" }, // 🏢 Referencia a sede
        cupo_maximo: { 
          bsonType: "int", 
          minimum: 1 // 🔢 Mínimo 1 cupo
        },
        costo: { 
          bsonType: "int", 
          minimum: 0 // 💰 Costo no negativo
        },
        fecha_inicio: { bsonType: "date" }, // 🗓️ Fecha inicio opcional
        fecha_fin: { bsonType: "date" }, // 🗓️ Fecha fin opcional
        nivel: { bsonType: "string" } // 📊 Nivel opcional
      }
    }
  }
})
db.cursos.createIndex({ nombre: 1, sede_id: 1 }, { unique: true }) // 🔑 Evita cursos duplicados por sede

// ==========================
// 6. COLECCIÓN INSCRIPCIONES ✍️🎺
// ==========================
db.createCollection("inscripciones", { // 📦 Colección de inscripciones
  validator: { // 🛡️ Validador de datos
    $jsonSchema: { // 📜 Esquema de validación
      bsonType: "object", // 🎯 Documentos tipo objeto
      required: ["estudiante_id", "curso_id", "fecha_inscripcion"], // 🚨 Campos obligatorios
      properties: { // 📋 Propiedades permitidas
        estudiante_id: { bsonType: "objectId" }, // 🎓 Referencia a estudiante
        curso_id: { bsonType: "objectId" }, // 📚 Referencia a curso
        fecha_inscripcion: { bsonType: "date" }, // 📅 Fecha de inscripción
        estado: { 
          enum: ["activa", "finalizada", "cancelada"] // 🚦 Estados permitidos
        }
      }
    }
  }
})
db.inscripciones.createIndex({ estudiante_id: 1, curso_id: 1 }, { unique: true }) // 🔑 Evita inscripciones duplicadas

// ==========================
// 7. COLECCIÓN INSTRUMENTOS 🎸🥁
// ==========================
db.createCollection("instrumentos", { // 📦 Colección de instrumentos musicales
  validator: { // 🛡️ Validador de datos
    $jsonSchema: { // 📜 Esquema de validación
      bsonType: "object", // 🎯 Documentos tipo objeto
      required: ["nombre", "tipo", "estado"], // 🚨 Campos obligatorios
      properties: { // 📋 Propiedades permitidas
        nombre: { bsonType: "string" }, // 🏷️ Nombre del instrumento
        tipo: { 
          enum: ["cuerda", "viento", "percusión", "teclado", "otro"] // 🎶 Tipos permitidos
        },
        estado: { 
          enum: ["disponible", "reservado", "mantenimiento"] // 🔧 Estados permitidos
        },
        sede_id: { bsonType: "objectId" } // 🏢 Referencia a sede opcional
      }
    }
  }
})
db.instrumentos.createIndex({ nombre: 1, sede_id: 1 }) // ⚡ Índice para búsquedas rápidas

// ==========================
// 8. COLECCIÓN RESERVAS 📅🎹
// ==========================
db.createCollection("reservas_instrumentos", { // 📦 Colección de reservas
  validator: { // 🛡️ Validador de datos
    $jsonSchema: { // 📜 Esquema de validación
      bsonType: "object", // 🎯 Documentos tipo objeto
      required: ["instrumento_id", "usuario_id", "fecha_reserva"], // 🚨 Campos obligatorios
      properties: { // 📋 Propiedades permitidas
        instrumento_id: { bsonType: "objectId" }, // 🎹 Referencia a instrumento
        usuario_id: { bsonType: "objectId" }, // 👤 Referencia a usuario
        fecha_reserva: { bsonType: "date" }, // 📅 Fecha de reserva
        fecha_devolucion: { bsonType: "date" }, // 📅 Fecha devolución opcional
        estado: { 
          enum: ["activa", "finalizada", "cancelada"] // 🚦 Estados permitidos
        }
      }
    }
  }
})
db.reservas_instrumentos.createIndex({ instrumento_id: 1, usuario_id: 1 }) // ⚡ Índice para consultas comunes

print("✅🎉 ¡Todas las colecciones fueron configuradas exitosamente!") // 🎊 Mensaje de éxito