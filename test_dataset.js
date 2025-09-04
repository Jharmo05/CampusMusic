use campusMusic // 🎶 Nos aseguramos de estar en la base de datos correcta

/// ===============================
/// 👥 USUARIOS
/// ===============================
db.usuarios.insertMany([
  { // 👑 Admin del sistema
    nombre: "Carlos",
    apellido: "Gómez",
    email: "carlos.gomez@campus.edu",
    rol: "administrador",
    cedula: "1234567890",
    telefono: "0991234567",
    fecha_registro: new Date("2022-01-15")
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

/// ===============================
/// 👨‍🏫 PROFESORES
/// ===============================
db.profesores.insertMany([
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

/// ===============================
/// 🎓 ESTUDIANTES
/// ===============================
db.estudiantes.insertMany([
  {
    nombre: "Daniela",
    apellido: "Suárez",
    cedula: "1122334455",
    email: "daniela.suarez@correo.com",
    telefono: "0955443322",
    direccion: "Av. Siempre Viva 123",
    fecha_nacimiento: new Date("2005-07-15")
  },
  {
    nombre: "Andrés",
    apellido: "Torres",
    cedula: "1122334466",
    email: "andres.torres@correo.com",
    telefono: "0944332211",
    direccion: "Calle Luna 456",
    fecha_nacimiento: new Date("2004-11-03")
  }
]) // ✅ Estudiantes listos

/// ===============================
/// 🏢 SEDES
/// ===============================
db.sedes.insertMany([
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

/// ===============================
/// 📚 CURSOS
/// ===============================
// 🔍 Obtenemos referencias
const profesorAna = db.profesores.findOne({ cedula: "9876543210" })
const profesorJorge = db.profesores.findOne({ cedula: "9876543211" })
const sedeNorte = db.sedes.findOne({ nombre: "Campus Norte" })
const sedeCentro = db.sedes.findOne({ nombre: "Campus Centro" })

db.cursos.insertMany([
  { // 🎻 Violín Básico en Norte
    nombre: "Violín Básico",
    descripcion: "Curso para principiantes de violín.",
    profesor_id: profesorAna._id,
    sede_id: sedeNorte._id,
    cupo_maximo: 10,
    costo: 500,
    fecha_inicio: new Date("2025-08-01"), // 📅 Activo ahora
    fecha_fin: new Date("2025-12-31"),
    nivel: "básico"
  },
  { // 🥁 Batería Intermedio en Centro
    nombre: "Batería Intermedio",
    descripcion: "Ritmos y técnicas intermedias de batería.",
    profesor_id: profesorJorge._id,
    sede_id: sedeCentro._id,
    cupo_maximo: 8,
    costo: 700,
    fecha_inicio: new Date("2025-07-01"), // 📅 Activo ahora
    fecha_fin: new Date("2025-12-31"),
    nivel: "intermedio"
  }
]) // ✅ Cursos listos

/// ===============================
/// ✍️ INSCRIPCIONES
/// ===============================
const estudianteDaniela = db.estudiantes.findOne({ cedula: "1122334455" })
const estudianteAndres = db.estudiantes.findOne({ cedula: "1122334466" })
const cursoViolin = db.cursos.findOne({ nombre: "Violín Básico" })
const cursoBateria = db.cursos.findOne({ nombre: "Batería Intermedio" })

db.inscripciones.insertMany([
  {
    estudiante_id: estudianteDaniela._id,
    curso_id: cursoViolin._id,
    fecha_inscripcion: new Date(), // 📅 Hoy mismo
    estado: "activa"
  },
  {
    estudiante_id: estudianteAndres._id,
    curso_id: cursoBateria._id,
    fecha_inscripcion: new Date(), // 📅 Hoy mismo
    estado: "activa"
  }
]) // ✅ Inscripciones listas

/// ===============================
/// 🎹 INSTRUMENTOS
/// ===============================
db.instrumentos.insertMany([
  {
    nombre: "Piano Yamaha",
    tipo: "teclado",
    estado: "disponible",
    sede_id: sedeCentro._id
  },
  {
    nombre: "Violín Stradivarius",
    tipo: "cuerda",
    estado: "mantenimiento",
    sede_id: sedeCentro._id
  }
]) // ✅ Instrumentos listos

/// ===============================
/// 📅 RESERVAS DE INSTRUMENTOS
/// ===============================
const usuarioMiguel = db.usuarios.findOne({ cedula: "1234567892" })
const instrumentoPiano = db.instrumentos.findOne({ nombre: "Piano Yamaha" })

db.reservas_instrumentos.insertMany([
  {
    instrumento_id: instrumentoPiano._id,
    usuario_id: usuarioMiguel._id,
    fecha_reserva: new Date("2025-08-20"),
    fecha_devolucion: new Date("2025-09-01"),
    estado: "activa"
  }
]) // ✅ Reservas listas
