use campusMusic // 🎶 Nos aseguramos de estar en la base de datos correcta

/// DATOS USUARIOS 🕺💃
db.usuarios.insertMany([ // 🧩 Insertamos varios usuarios de ejemplo
  { // 👑 Admin del sistema
    nombre: "Carlos", // 🏷️ Nombre
    apellido: "Gómez", // 🏷️ Apellido
    email: "carlos.gomez@campus.edu", // 📧 Email
    rol: "administrador", // 🎭 Rol
    cedula: "1234567890", // 🆔 Cédula
    telefono: "0991234567", // ☎️ Teléfono
    fecha_registro: new Date("2022-01-15") // 📅 Fecha de registro
  },
  { // 👩‍💼 Empleado de sede
    nombre: "Lucía",
    apellido: "Martínez",
    email: "lucia.martinez@campus.edu",
    rol: "empleado",
    cedula: "1234567891",
    telefono: "0987654321",
    fecha_registro: new Date("2023-03-10")
  },
  { // 🎓 Estudiante
    nombre: "Miguel",
    apellido: "Rojas",
    email: "miguel.rojas@campus.edu",
    rol: "estudiante",
    cedula: "1234567892",
    telefono: "0912345678",
    fecha_registro: new Date("2024-02-01")
  }
]) // ✅ Usuarios listos

/// PROFESORES 👨‍🏫
db.profesores.insertMany([ // 👥 Insertamos profesores
  {
    nombre: "Ana",
    apellido: "Pérez",
    cedula: "9876543210",
    especialidad: "Violín", // 🎻 Especialidad
    telefono: "0922334455",
    email: "ana.perez@campus.edu",
    fecha_ingreso: new Date("2021-05-20")
  },
  {
    nombre: "Jorge",
    apellido: "Ramírez",
    cedula: "9876543211",
    especialidad: "Batería", // 🥁 Especialidad
    telefono: "0967788990",
    email: "jorge.ramirez@campus.edu",
    fecha_ingreso: new Date("2020-08-10")
  }
]) // ✅ Profesores listos

/// ESTUDIANTES ✍️
db.estudiantes.insertMany([ // 👨‍🎓 Insertamos estudiantes
  {
    nombre: "Daniela",
    apellido: "Suárez",
    cedula: "1122334455",
    email: "daniela.suarez@correo.com",
    telefono: "0955443322",
    direccion: "Av. Siempre Viva 123", // 🏠 Dirección
    fecha_nacimiento: new Date("2005-07-15")
  },
  {
    nombre: "Andrés",
    apellido: "Torres",
    cedula: "1122334466",
    email: "andres.torres@correo.com",
    telefono: "0944332211",
    direccion: "Calle Luna 456", // 🌙 Dirección
    fecha_nacimiento: new Date("2004-11-03")
  }
]) // ✅ Estudiantes listos

/// SEDES 🏢
db.sedes.insertMany([ // 🏫 Insertamos sedes
  {
    nombre: "Campus Norte",
    direccion: "Av. Principal Norte 100",
    zona: "norte",
    telefono: "022334455"
  },
  {
    nombre: "Campus Centro",
    direccion: "Calle Central 200",
    zona: "centro",
    telefono: "022334466"
  }
]) // ✅ Sedes listas

/// CURSOS 📚
const profesorAna = db.profesores.findOne({ cedula: "9876543210" }) // 🔍 Buscamos a la profesora Ana
const profesorJorge = db.profesores.findOne({ cedula: "9876543211" }) // 🔍 Buscamos al profesor Jorge
const sedeNorte = db.sedes.findOne({ nombre: "Campus Norte" }) // 🔍 Sede Norte
const sedeCentro = db.sedes.findOne({ nombre: "Campus Centro" }) // 🔍 Sede Centro

db.cursos.insertMany([ // ➕ Insertamos cursos
  { // 🎻 Violín Básico en Norte
    nombre: "Violín Básico",
    descripcion: "Curso para principiantes de violín.", // 📝 Descripción
    profesor_id: profesorAna._id, // 🔗 Referencia profesor
    sede_id: sedeNorte._id, // 🔗 Referencia sede
    cupo_maximo: 10, // 🔢 Capacidad
    costo: 500, // 💰 Precio
    fecha_inicio: new Date("2025-01-01"), // 🗓️ Inicio
    fecha_fin: new Date("2025-12-31"), // 🗓️ Fin
    nivel: "básico" // 🧩 Nivel
  },
  { // 🥁 Batería Intermedio en Centro
    nombre: "Batería Intermedio",
    descripcion: "Ritmos y técnicas intermedias de batería.",
    profesor_id: profesorJorge._id,
    sede_id: sedeCentro._id,
    cupo_maximo: 8,
    costo: 700,
    fecha_inicio: new Date("2025-03-01"),
    fecha_fin: new Date("2025-11-30"),
    nivel: "intermedio"
  }
]) // ✅ Cursos listos

/// INSCRIPCIONES 📝
const estudianteDaniela = db.estudiantes.findOne({ cedula: "1122334455" }) // 🔍 Daniela
const estudianteAndres = db.estudiantes.findOne({ cedula: "1122334466" }) // 🔍 Andrés
const cursoViolin = db.cursos.findOne({ nombre: "Violín Básico" }) // 🔍 Curso de violín
const cursoBateria = db.cursos.findOne({ nombre: "Batería Intermedio" }) // 🔍 Curso de batería

db.inscripciones.insertMany([ // ➕ Insertamos inscripciones
  {
    estudiante_id: estudianteDaniela._id, // 🔗 Daniela
    curso_id: cursoViolin._id, // 🔗 Violín
    fecha_inscripcion: new Date("2025-01-10"), // 📅 Fecha
    estado: "activa" // ✅ Activa
  },
  {
    estudiante_id: estudianteAndres._id, // 🔗 Andrés
    curso_id: cursoBateria._id, // 🔗 Batería
    fecha_inscripcion: new Date("2025-02-15"), // 📅 Fecha
    estado: "activa" // ✅ Activa
  }
]) // ✅ Inscripciones listas

/// INSTRUMENTOS 🎹🥁
db.instrumentos.insertMany([ // ➕ Insertamos instrumentos
  {
    nombre: "Piano Yamaha", // 🎹 Nombre
    tipo: "teclado", // 🧩 Tipo
    estado: "disponible", // ✅ Disponible
    sede_id: sedeCentro._id // 🔗 Sede Centro
  },
  {
    nombre: "Violín Stradivarius", // 🎻 Nombre
    tipo: "cuerda", // 🧩 Tipo
    estado: "mantenimiento", // 🚧 En mantenimiento
    sede_id: sedeCentro._id // 🔗 Sede Centro
  }
]) // ✅ Instrumentos listos

/// RESERVAS DE INSTRUMENTOS 📅
const usuarioMiguel = db.usuarios.findOne({ cedula: "1234567892" }) // 🔍 Usuario Miguel (estudiante)
const instrumentoPiano = db.instrumentos.findOne({ nombre: "Piano Yamaha" }) // 🔍 El piano

db.reservas_instrumentos.insertMany([ // ➕ Insertamos reservas
  {
    instrumento_id: instrumentoPiano._id, // 🎹 Instrumento
    usuario_id: usuarioMiguel._id, // 👤 Usuario
    fecha_reserva: new Date("2025-08-20"), // 📅 Reserva
    fecha_devolucion: new Date("2025-08-25"), // 📅 Devolución
    estado: "activa" // ⏳ Activa
  }
]) // ✅ Reservas listas
