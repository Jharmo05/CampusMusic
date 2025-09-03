/// CREAR ROLES PERSONALIZADOS 👑🎭

// Rol de Administrador
db.createRole({
  role: "adminCampus", // 👑 Un rol poderoso para gestionar todo
  privileges: [
    {
      resource: { db: "campusMusic", collection: "" }, // 🕵️‍♂️ Acceso a todas las colecciones
      actions: [
        "find", "insert", "update", "remove", // CRUD completo
        "createCollection", "createIndex",
        "dropCollection"
      ]
    },
    {
      resource: { db: "campusMusic", collection: "usuarios" }, // 👤 Permisos especiales para manejar usuarios
      actions: ["createUser", "grantRole", "updateUser"]
    }
  ],
  roles: [
    { role: "readWrite", db: "campusMusic" }, // 📝 Hereda permisos de lectura y escritura
    { role: "userAdmin", db: "campusMusic" } // 👩‍💻 Hereda permisos de administración de usuarios
  ]
})

/// CREAR ROL: Empleado (empleadoSede) 👨‍💼

db.createRole({
    role: "empleadoSede",
    privileges: [
      // Lectura 📖
      {
        resource: { db: "campusMusic", collection: "profesores" },
        actions: ["find"] // Puede ver los profesores
      },
      {
        resource: { db: "campusMusic", collection: "estudiantes" },
        actions: ["find"] // Puede ver los estudiantes
      },
      {
        resource: { db: "campusMusic", collection: "cursos" },
        actions: ["find"] // Puede ver los cursos
      },
      // Escritura 📝
      {
        resource: { db: "campusMusic", collection: "inscripciones" },
        actions: ["insert", "find"] // Puede inscribir a estudiantes y ver las inscripciones
      },
      {
        resource: { db: "campusMusic", collection: "reservas_instrumentos" },
        actions: ["insert", "find"] // Puede gestionar reservas de instrumentos
      }
    ],
    roles: []
  })

/// CREAR ROL: Estudiante (estudianteCampus) 🎓

db.createRole({
    role: "estudianteCampus",
    privileges: [
      // Lectura de su perfil (controlado por la app) 🕵️‍♂️
      {
        resource: { db: "campusMusic", collection: "usuarios" },
        actions: ["find"] // Puede buscar su propio usuario (con filtros)
      },
      {
        resource: { db: "campusMusic", collection: "cursos" },
        actions: ["find"] // Puede ver los cursos disponibles
      },
      {
        resource: { db: "campusMusic", collection: "inscripciones" },
        actions: ["find"] // Puede ver sus propias inscripciones
      },
      {
        resource: { db: "campusMusic", collection: "reservas_instrumentos" },
        actions: ["insert", "find"] // 📝 Puede hacer y ver sus reservas de instrumentos
      }
    ],
    roles: []
  })

/// CREAR USUARIOS CON ROLES ASIGNADOS 🧙‍♂️

// Administrador
db.createUser({
    user: "admin1", // 💻 El usuario de la super-administradora
    pwd: "admin123",
    roles: [ { role: "adminCampus", db: "campusMusic" } ] // 👑 Le asignamos el rol de admin
  })

// Empleado
db.createUser({
    user: "empleado1", // 💼 El usuario del gestor de sedes
    pwd: "empleado123",
    roles: [ { role: "empleadoSede", db: "campusMusic" } ] // 👨‍💼 Le damos su rol
  })

// Estudiante
db.createUser({
    user: "estudiante1", // 🎶 El usuario del futuro músico
    pwd: "estudiante123",
    roles: [ { role: "estudianteCampus", db: "campusMusic" } ] // 🎓 Le asignamos el rol de estudiante
  })

// ¿ACTUALIZAR ROLES? 🔄

// Agregar rol de empleado a un usuario existente
db.grantRolesToUser("empleado1", [
    { role: "empleadoSede", db: "campusMusic" } // ➕ Añadimos un rol a un usuario
  ])