/// DATOS USUARIOS 🕺💃
db.usuarios.insertMany([
  {
    nombre: "Carlos",
    apellido: "Gómez",
    email: "carlos.gomez@campus.edu",
    rol: "administrador", // 👑 Es el rey de la base de datos
    cedula: "1234567890",
    telefono: "0991234567",
    fecha_registro: new Date("2022-01-15")
  },
  {
    nombre: "Lucía",
    apellido: "Martínez",
    email: "lucia.martinez@campus.edu",
    rol: "empleado", // 👩‍💼 Gestiona inscripciones y reservas
    cedula: "1234567891",
    telefono: "0987654321",
    fecha_registro: new Date("2023-03-10")
  },
  {
    nombre: "Miguel",
    apellido: "Rojas",
    email: "miguel.rojas@campus.edu",
    rol: "estudiante", // 🎓 Va a aprender música
    cedula: "1234567892",
    telefono: "0912345678",
    fecha_registro: new Date("2024-02-01")
  }
])

/// PROFESORES 👨‍🏫
db.profesores.insertMany([
  {
    nombre: "Ana",
    apellido: "Pérez",
    cedula: "9876543210",
    especialidad: "Violín", // 🎻 ¡Una maestra del violín!
    telefono: "0922334455",
    email: "ana.perez@campus.edu",
    fecha_ingreso: new Date("2021-05-20")
  },
  {
    nombre: "Jorge",
    apellido: "Ramírez",
    cedula: "9876543211",
    especialidad: "Batería", // 🥁 El maestro del ritmo
    telefono: "0967788990",
    email: "jorge.ramirez@campus.edu",
    fecha_ingreso: new Date("2020-08-10")
  }
])

/// ESTUDIANTES ✍️
db.estudiantes.insertMany([
  {
    nombre: "Daniela",
    apellido: "Suárez",
    cedula: "1122334455",
    email: "daniela.suarez@correo.com",
    telefono: "0955443322",
    direccion: "Av. Siempre Viva 123", // 🏠 ¡Un guiño a Los Simpsons!
    fecha_nacimiento: new Date("2005-07-15")
  },
  {
    nombre: "Andrés",
    apellido: "Torres",
    cedula: "1122334466",
    email: "andres.torres@correo.com",
    telefono: "0944332211",
    direccion: "Calle Luna 456", // 🌙 Como la famosa canción...
    fecha_nacimiento: new Date("2004-11-03")
  }
])

/// SEDES 🏢
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
])

/// CURSOS 📚
const profesor = db.profesores.findOne({ cedula: "9876543210" }); // 🔍 Buscamos a la profesora Ana para asignarla
const sede = db.sedes.findOne({ nombre: "Campus Norte" }); // 🔍 Encontramos la sede Norte

db.cursos.insertMany([
{
  nombre: "Violín Básico",
  descripcion: "Curso para principiantes de violín.", // 🎻 ¡Ideal para empezar a tocar!
  profesor_id: profesor._id, // 🔗 Usamos el ID de Ana Pérez
  sede_id: sede._id, // 🔗 Lo ubicamos en el Campus Norte
  cupo_maximo: 10
}
])

/// INSCRIPCIONES 📝
const estudiante = db.estudiantes.findOne({ cedula: "1122334455" }); // 🔍 Buscamos a Daniela Suárez
const curso = db.cursos.findOne({ nombre: "Violín Básico" }); // 🔍 Encontramos el curso de violín

db.inscripciones.insertMany([
{
  estudiante_id: estudiante._id, // 🔗 El ID de Daniela
  curso_id: curso._id, // 🔗 El ID del curso de violín
  fecha_inscripcion: new Date("2025-01-10"),
  estado: "activa" // 👍 Está inscrita y lista para aprender
}
])

/// INSTRUMENTOS 🎹🥁
const sedeCentro = db.sedes.findOne({ nombre: "Campus Centro" }); // 🔍 Sede para los instrumentos

db.instrumentos.insertMany([
{
  nombre: "Piano Yamaha",
  tipo: "teclado",
  estado: "disponible", // ✅ ¡Listo para ser usado!
  sede_id: sedeCentro._id // 🔗 Se encuentra en el Campus Centro
},
{
  nombre: "Violín Stradivarius",
  tipo: "cuerda",
  estado: "mantenimiento", // 🚧 No se puede usar por ahora
  sede_id: sedeCentro._id // 🔗 Se encuentra en el Campus Centro
}
])

/// RESERVAS DE INSTRUMENTOS 📅
const usuario = db.usuarios.findOne({ cedula: "1234567892" }); // 🔍 Miguel (el estudiante)
const instrumento = db.instrumentos.findOne({ nombre: "Piano Yamaha" }); // 🔍 El piano disponible

db.reservas_instrumentos.insertMany([
{
  instrumento_id: instrumento._id, // 🔗 El piano
  usuario_id: usuario._id, // 🔗 El estudiante Miguel
  fecha_reserva: new Date("2025-08-20"),
  fecha_devolucion: new Date("2025-08-25"),
  estado: "activa" // ⏳ La reserva está en curso
}
])