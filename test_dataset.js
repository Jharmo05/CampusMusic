/// DATOS USUARIOS


db.usuarios.insertMany([
  {
    nombre: "Carlos",
    apellido: "Gómez",
    email: "carlos.gomez@campus.edu",
    rol: "administrador",
    cedula: "1234567890",
    telefono: "0991234567",
    fecha_registro: new Date("2022-01-15")
  },
  {
    nombre: "Lucía",
    apellido: "Martínez",
    email: "lucia.martinez@campus.edu",
    rol: "empleado",
    cedula: "1234567891",
    telefono: "0987654321",
    fecha_registro: new Date("2023-03-10")
  },
  {
    nombre: "Miguel",
    apellido: "Rojas",
    email: "miguel.rojas@campus.edu",
    rol: "estudiante",
    cedula: "1234567892",
    telefono: "0912345678",
    fecha_registro: new Date("2024-02-01")
  }
])



/// PROFESORES

db.profesores.insertMany([
  {
    nombre: "Ana",
    apellido: "Pérez",
    cedula: "9876543210",
    especialidad: "Violín",
    telefono: "0922334455",
    email: "ana.perez@campus.edu",
    fecha_ingreso: new Date("2021-05-20")
  },
  {
    nombre: "Jorge",
    apellido: "Ramírez",
    cedula: "9876543211",
    especialidad: "Batería",
    telefono: "0967788990",
    email: "jorge.ramirez@campus.edu",
    fecha_ingreso: new Date("2020-08-10")
  }
])

/// ESTUDIANTES

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
])


/// SEDES

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

/// CURSOS

const profesor = db.profesores.findOne({ cedula: "9876543210" });
const sede = db.sedes.findOne({ nombre: "Campus Norte" });

db.cursos.insertMany([
{
  nombre: "Violín Básico",
  descripcion: "Curso para principiantes de violín.",
  profesor_id: profesor._id,
  sede_id: sede._id,
  cupo_maximo: 10
}
])

/// INSCRIPCIONES

const estudiante = db.estudiantes.findOne({ cedula: "1122334455" });
const curso = db.cursos.findOne({ nombre: "Violín Básico" });

db.inscripciones.insertMany([
{
  estudiante_id: estudiante._id,
  curso_id: curso._id,
  fecha_inscripcion: new Date("2025-01-10"),
  estado: "activa"
}
])


/// INSTRUMENTOS

const sedeCentro = db.sedes.findOne({ nombre: "Campus Centro" });

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
])

/// RESERVAS DE INSTRUMENTOS

const usuario = db.usuarios.findOne({ cedula: "1234567892" }); // Miguel (estudiante)
const instrumento = db.instrumentos.findOne({ nombre: "Piano Yamaha" });

db.reservas_instrumentos.insertMany([
{
  instrumento_id: instrumento._id,
  usuario_id: usuario._id,
  fecha_reserva: new Date("2025-08-20"),
  fecha_devolucion: new Date("2025-08-25"),
  estado: "activa"
}
])
