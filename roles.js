use campusMusic // 🎶 Creamos roles/usuarios dentro de esta DB

/// CREAR ROLES PERSONALIZADOS 👑🎭

// Rol de Administrador
db.createRole({ // 🧱 Definimos un rol
  role: "adminCampus", // 🏷️ Nombre del rol
  privileges: [ // 🧰 Permisos específicos
    { // 🔓 Acceso a todas las colecciones de la DB
      resource: { db: "campusMusic", collection: "" }, // 🌐 Todas
      actions: [ "find", "insert", "update", "remove", "createCollection", "createIndex", "dropCollection" ] // 🛠️ Acciones
    },
    { // 👤 Permisos especiales sobre usuarios
      resource: { db: "campusMusic", collection: "usuarios" }, // 👥 Colección usuarios
      actions: [ "createUser", "grantRole", "updateUser" ] // 🧑‍💻 Administración de usuarios
    }
  ],
  roles: [ // 🧬 Herencia de roles
    { role: "readWrite", db: "campusMusic" }, // 📝 Leer/Escribir
    { role: "userAdmin", db: "campusMusic" } // 👩‍💻 Admin de usuarios
  ]
}) // ✅ Rol adminCampus creado

/// CREAR ROL: Empleado (empleadoSede) 👨‍💼
db.createRole({ // 🧱 Definimos rol empleado
  role: "empleadoSede", // 🏷️ Nombre
  privileges: [ // 🧰 Permisos
    { resource: { db: "campusMusic", collection: "profesores" }, actions: ["find"] }, // 👀 Ver profesores
    { resource: { db: "campusMusic", collection: "estudiantes" }, actions: ["find"] }, // 👀 Ver estudiantes
    { resource: { db: "campusMusic", collection: "cursos" }, actions: ["find"] }, // 👀 Ver cursos
    { resource: { db: "campusMusic", collection: "inscripciones" }, actions: ["insert", "find"] }, // 📝 Inscribir y ver
    { resource: { db: "campusMusic", collection: "reservas_instrumentos" }, actions: ["insert", "find"] } // 📝 Reservar y ver
  ],
  roles: [] // 🚫 Sin herencia adicional
}) // ✅ Rol empleadoSede creado

/// CREAR ROL: Estudiante (estudianteCampus) 🎓
db.createRole({ // 🧱 Definimos rol estudiante
  role: "estudianteCampus", // 🏷️ Nombre
  privileges: [ // 🧰 Permisos
    { resource: { db: "campusMusic", collection: "usuarios" }, actions: ["find"] }, // 👀 Ver su perfil (filtrado por app)
    { resource: { db: "campusMusic", collection: "cursos" }, actions: ["find"] }, // 👀 Ver cursos
    { resource: { db: "campusMusic", collection: "inscripciones" }, actions: ["find"] }, // 👀 Ver inscripciones
    { resource: { db: "campusMusic", collection: "reservas_instrumentos" }, actions: ["insert", "find"] } // 📝 Reservar instrumentos
  ],
  roles: [] // 🚫 Sin herencia
}) // ✅ Rol estudianteCampus creado

/// CREAR USUARIOS CON ROLES ASIGNADOS 🧙‍♂️
db.createUser({ // 👑 Usuario Admin
  user: "admin1", // 👤 Nombre de usuario
  pwd: "admin123", // 🔐 Contraseña
  roles: [ { role: "adminCampus", db: "campusMusic" } ] // 🎭 Rol asignado
}) // ✅ Usuario admin creado

db.createUser({ // 👨‍💼 Usuario Empleado
  user: "empleado1",
  pwd: "empleado123",
  roles: [ { role: "empleadoSede", db: "campusMusic" } ]
}) // ✅ Usuario empleado creado

db.createUser({ // 🎓 Usuario Estudiante
  user: "estudiante1",
  pwd: "estudiante123",
  roles: [ { role: "estudianteCampus", db: "campusMusic" } ]
}) // ✅ Usuario estudiante creado

// Agregar rol de empleado a un usuario existente (ejemplo) 🔄
db.grantRolesToUser("empleado1", [ { role: "empleadoSede", db: "campusMusic" } ]) // ➕ Añadimos rol a empleado1