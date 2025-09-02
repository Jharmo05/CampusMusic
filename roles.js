/// CREAR ROLES PERSONALIZADOS

use campusMusic

db.createRole({
  role: "adminCampus",
  privileges: [
    {
      resource: { db: "campusMusic", collection: "" }, // todas las colecciones
      actions: [
        "find", "insert", "update", "remove",
        "createCollection", "createIndex",
        "dropCollection"
      ]
    },
    {
      resource: { db: "campusMusic", collection: "usuarios" },
      actions: ["createUser", "grantRole", "updateUser"]
    }
  ],
  roles: [
    { role: "readWrite", db: "campusMusic" },
    { role: "userAdmin", db: "campusMusic" }
  ]
})

/// CREAR ROL: Empleado (empleadoSede)

db.createRole({
    role: "empleadoSede",
    privileges: [
      // Lectura
      {
        resource: { db: "campusMusic", collection: "profesores" },
        actions: ["find"]
      },
      {
        resource: { db: "campusMusic", collection: "estudiantes" },
        actions: ["find"]
      },
      {
        resource: { db: "campusMusic", collection: "cursos" },
        actions: ["find"]
      },
      // Escritura
      {
        resource: { db: "campusMusic", collection: "inscripciones" },
        actions: ["insert", "find"]
      },
      {
        resource: { db: "campusMusic", collection: "reservas_instrumentos" },
        actions: ["insert", "find"]
      }
    ],
    roles: []
  })

/// CREAR ROL: Estudiante (estudianteCampus)

db.createRole({
    role: "estudianteCampus",
    privileges: [
      // Lectura de su perfil (controlado por la app)
      {
        resource: { db: "campusMusic", collection: "usuarios" },
        actions: ["find"]
      },
      {
        resource: { db: "campusMusic", collection: "cursos" },
        actions: ["find"]
      },
      {
        resource: { db: "campusMusic", collection: "inscripciones" },
        actions: ["find"]
      },
      {
        resource: { db: "campusMusic", collection: "reservas_instrumentos" },
        actions: ["insert", "find"]
      }
    ],
    roles: []
  })

/// CREAR USUARIOS CON ROLES ASIGNADOS

// Administrador

db.createUser({
    user: "admin1",
    pwd: "admin123",
    roles: [ { role: "adminCampus", db: "campusMusic" } ]
  })

  
// Empleado

db.createUser({
    user: "empleado1",
    pwd: "empleado123",
    roles: [ { role: "empleadoSede", db: "campusMusic" } ]
  })

// Estudiante

db.createUser({
    user: "estudiante1",
    pwd: "estudiante123",
    roles: [ { role: "estudianteCampus", db: "campusMusic" } ]
  })

// ¿ACTUALIZAR ROLES?

// Agregar rol de empleado a un usuario existente

db.grantRolesToUser("empleado1", [
    { role: "empleadoSede", db: "campusMusic" }
  ])


