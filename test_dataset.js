use campusMusic // 🎶 ¡Activamos la base de datos musical!

// 🧹 Limpiamos datos existentes para empezar fresco
db.usuarios.deleteMany({}) // 🗑️ Limpiar usuarios
db.profesores.deleteMany({}) // 🗑️ Limpiar profesores
db.estudiantes.deleteMany({}) // 🗑️ Limpiar estudiantes
db.sedes.deleteMany({}) // 🗑️ Limpiar sedes
db.cursos.deleteMany({}) // 🗑️ Limpiar cursos
db.inscripciones.deleteMany({}) // 🗑️ Limpiar inscripciones
db.instrumentos.deleteMany({}) // 🗑️ Limpiar instrumentos
db.reservas_instrumentos.deleteMany({}) // 🗑️ Limpiar reservas

/// DATOS USUARIOS 🕺💃
db.usuarios.insertMany([ // 📥 Insertamos usuarios de ejemplo
  { 
    nombre: "Carlos", // 🏷️ Nombre
    apellido: "Gómez", // 🏷️ Apellido
    email: "carlos.gomez@campus.edu", // 📧 Email
    rol: "administrador", // 👑 Rol administrativo
    cedula: "1234567890", // 🆔 Cédula
    telefono: "0991234567", // 📞 Teléfono
    fecha_registro: new Date("2024-01-15") // 📅 Fecha reciente
  },
  { 
    nombre: "Lucía", // 🏷️ Nombre
    apellido: "Martínez", // 🏷️ Apellido
    email: "lucia.martinez@campus.edu", // 📧 Email
    rol: "empleado", // 👨‍💼 Rol empleado
    cedula: "1234567891", // 🆔 Cédula
    telefono: "0987654321", // 📞 Teléfono
    fecha_registro: new Date("2024-03-10") // 📅 Fecha reciente
  },
  { 
    nombre: "Miguel", // 🏷️ Nombre
    apellido: "Rojas", // 🏷️ Apellido
    email: "miguel.rojas@campus.edu", // 📧 Email
    rol: "estudiante", // 🎓 Rol estudiante
    cedula: "1234567892", // 🆔 Cédula
    telefono: "0912345678", // 📞 Teléfono
    fecha_registro: new Date("2024-02-01") // 📅 Fecha reciente
  }
])

/// PROFESORES 👨‍🏫🎻
db.profesores.insertMany([ // 📥 Insertamos profesores
  {
    nombre: "Ana", // 🏷️ Nombre
    apellido: "Pérez", // 🏷️ Apellido
    cedula: "9876543210", // 🆔 Cédula
    especialidad: "Violín", // 🎻 Especialidad
    telefono: "0922334455", // 📞 Teléfono
    email: "ana.perez@campus.edu", // 📧 Email
    fecha_ingreso: new Date("2024-05-20") // 📅 Fecha reciente
  },
  {
    nombre: "Jorge", // 🏷️ Nombre
    apellido: "Ramírez", // 🏷️ Apellido
    cedula: "9876543211", // 🆔 Cédula
    especialidad: "Batería", // 🥁 Especialidad
    telefono: "0967788990", // 📞 Teléfono
    email: "jorge.ramirez@campus.edu", // 📧 Email
    fecha_ingreso: new Date("2024-08-10") // 📅 Fecha reciente
  }
])

/// ESTUDIANTES ✍️🎸
db.estudiantes.insertMany([ // 📥 Insertamos estudiantes
  {
    nombre: "Daniela", // 🏷️ Nombre
    apellido: "Suárez", // 🏷️ Apellido
    cedula: "1122334455", // 🆔 Cédula
    email: "daniela.suarez@correo.com", // 📧 Email
    telefono: "0955443322", // 📞 Teléfono
    direccion: "Av. Siempre Viva 123", // 🏠 Dirección
    fecha_nacimiento: new Date("2005-07-15") // 🎂 Fecha nacimiento
  },
  {
    nombre: "Andrés", // 🏷️ Nombre
    apellido: "Torres", // 🏷️ Apellido
    cedula: "1122334466", // 🆔 Cédula
    email: "andres.torres@correo.com", // 📧 Email
    telefono: "0944332211", // 📞 Teléfono
    direccion: "Calle Luna 456", // 🏠 Dirección
    fecha_nacimiento: new Date("2004-11-03") // 🎂 Fecha nacimiento
  },
  {
    nombre: "María", // 🏷️ Nombre
    apellido: "Gonzalez", // 🏷️ Apellido
    cedula: "1122334477", // 🆔 Cédula
    email: "maria.gonzalez@correo.com", // 📧 Email
    telefono: "0933445566", // 📞 Teléfono
    direccion: "Av. Central 789", // 🏠 Dirección
    fecha_nacimiento: new Date("2003-05-20") // 🎂 Fecha nacimiento
  }
])

/// SEDES 🏢🎹
db.sedes.insertMany([ // 📥 Insertamos sedes
  {
    nombre: "Campus Norte", // 🏷️ Nombre sede
    direccion: "Av. Principal Norte 100", // 📍 Dirección
    zona: "norte", // 🗺️ Zona
    telefono: "022334455" // 📞 Teléfono
  },
  {
    nombre: "Campus Centro", // 🏷️ Nombre sede
    direccion: "Calle Central 200", // 📍 Dirección
    zona: "centro", // 🗺️ Zona
    telefono: "022334466" // 📞 Teléfono
  },
  {
    nombre: "Campus Sur", // 🏷️ Nombre sede
    direccion: "Av. Sur 300", // 📍 Dirección
    zona: "sur", // 🗺️ Zona
    telefono: "022334477" // 📞 Teléfono
  }
])

/// CURSOS 📚🎷
const profesorAna = db.profesores.findOne({ cedula: "9876543210" }) // 🔍 Buscamos profesora Ana
const profesorJorge = db.profesores.findOne({ cedula: "9876543211" }) // 🔍 Buscamos profesor Jorge
const sedeNorte = db.sedes.findOne({ nombre: "Campus Norte" }) // 🔍 Sede Norte
const sedeCentro = db.sedes.findOne({ nombre: "Campus Centro" }) // 🔍 Sede Centro
const sedeSur = db.sedes.findOne({ nombre: "Campus Sur" }) // 🔍 Sede Sur

db.cursos.insertMany([ // 📥 Insertamos cursos
  { 
    nombre: "Violín Básico", // 🏷️ Nombre curso
    descripcion: "Curso para principiantes de violín.", // 📝 Descripción
    profesor_id: profesorAna._id, // 👩‍🏫 Referencia profesor
    sede_id: sedeNorte._id, // 🏢 Referencia sede
    cupo_maximo: 10, // 🔢 Capacidad
    costo: 500, // 💰 Precio
    fecha_inicio: new Date("2024-09-01"), // 🗓️ Inicio reciente
    fecha_fin: new Date("2024-12-15"), // 🗓️ Fin reciente
    nivel: "básico" // 📊 Nivel
  },
  { 
    nombre: "Batería Intermedio", // 🏷️ Nombre curso
    descripcion: "Ritmos y técnicas intermedias de batería.", // 📝 Descripción
    profesor_id: profesorJorge._id, // 👨‍🏫 Referencia profesor
    sede_id: sedeCentro._id, // 🏢 Referencia sede
    cupo_maximo: 8, // 🔢 Capacidad
    costo: 700, // 💰 Precio
    fecha_inicio: new Date("2024-08-15"), // 🗓️ Inicio reciente
    fecha_fin: new Date("2024-11-30"), // 🗓️ Fin reciente
    nivel: "intermedio" // 📊 Nivel
  },
  { 
    nombre: "Guitarra Principiante", // 🏷️ Nombre curso
    descripcion: "Aprende guitarra desde cero.", // 📝 Descripción
    profesor_id: profesorAna._id, // 👩‍🏫 Referencia profesor
    sede_id: sedeSur._id, // 🏢 Referencia sede
    cupo_maximo: 12, // 🔢 Capacidad
    costo: 450, // 💰 Precio
    fecha_inicio: new Date("2024-10-01"), // 🗓️ Inicio reciente
    fecha_fin: new Date("2025-01-31"), // 🗓️ Fin reciente
    nivel: "básico" // 📊 Nivel
  }
])

/// INSCRIPCIONES 📝🎺
const estudianteDaniela = db.estudiantes.findOne({ cedula: "1122334455" }) // 🔍 Daniela
const estudianteAndres = db.estudiantes.findOne({ cedula: "1122334466" }) // 🔍 Andrés
const estudianteMaria = db.estudiantes.findOne({ cedula: "1122334477" }) // 🔍 María
const cursoViolin = db.cursos.findOne({ nombre: "Violín Básico" }) // 🔍 Curso violín
const cursoBateria = db.cursos.findOne({ nombre: "Batería Intermedio" }) // 🔍 Curso batería
const cursoGuitarra = db.cursos.findOne({ nombre: "Guitarra Principiante" }) // 🔍 Curso guitarra

db.inscripciones.insertMany([ // 📥 Insertamos inscripciones RECIENTES
  {
    estudiante_id: estudianteDaniela._id, // 🎓 Daniela
    curso_id: cursoViolin._id, // 🎻 Violín
    fecha_inscripcion: new Date("2024-08-20"), // 📅 Fecha reciente
    estado: "activa" // ✅ Activa
  },
  {
    estudiante_id: estudianteAndres._id, // 🎓 Andrés
    curso_id: cursoBateria._id, // 🥁 Batería
    fecha_inscripcion: new Date("2024-08-18"), // 📅 Fecha reciente
    estado: "activa" // ✅ Activa
  },
  {
    estudiante_id: estudianteMaria._id, // 🎓 María
    curso_id: cursoGuitarra._id, // 🎸 Guitarra
    fecha_inscripcion: new Date("2024-08-22"), // 📅 Fecha reciente
    estado: "activa" // ✅ Activa
  },
  {
    estudiante_id: estudianteDaniela._id, // 🎓 Daniela
    curso_id: cursoGuitarra._id, // 🎸 Guitarra
    fecha_inscripcion: new Date("2024-08-25"), // 📅 Fecha reciente
    estado: "activa" // ✅ Activa
  }
])

/// INSTRUMENTOS 🎹🥁
db.instrumentos.insertMany([ // 📥 Insertamos instrumentos
  {
    nombre: "Piano Yamaha", // 🏷️ Nombre instrumento
    tipo: "teclado", // 🎹 Tipo
    estado: "disponible", // ✅ Disponible
    sede_id: sedeCentro._id // 🏢 Sede Centro
  },
  {
    nombre: "Violín Stradivarius", // 🏷️ Nombre instrumento
    tipo: "cuerda", // 🎻 Tipo
    estado: "mantenimiento", // 🔧 En mantenimiento
    sede_id: sedeCentro._id // 🏢 Sede Centro
  },
  {
    nombre: "Guitarra Acústica", // 🏷️ Nombre instrumento
    tipo: "cuerda", // 🎸 Tipo
    estado: "disponible", // ✅ Disponible
    sede_id: sedeSur._id // 🏢 Sede Sur
  },
  {
    nombre: "Batería Pearl", // 🏷️ Nombre instrumento
    tipo: "percusión", // 🥁 Tipo
    estado: "disponible", // ✅ Disponible
    sede_id: sedeNorte._id // 🏢 Sede Norte
  }
])

/// RESERVAS DE INSTRUMENTOS 📅🎹
const usuarioMiguel = db.usuarios.findOne({ cedula: "1234567892" }) // 🔍 Usuario Miguel
const instrumentoPiano = db.instrumentos.findOne({ nombre: "Piano Yamaha" }) // 🔍 Piano
const instrumentoGuitarra = db.instrumentos.findOne({ nombre: "Guitarra Acústica" }) // 🔍 Guitarra

db.reservas_instrumentos.insertMany([ // 📥 Insertamos reservas RECIENTES
  {
    instrumento_id: instrumentoPiano._id, // 🎹 Instrumento
    usuario_id: usuarioMiguel._id, // 👤 Usuario
    fecha_reserva: new Date("2024-08-20"), // 📅 Reserva reciente
    fecha_devolucion: new Date("2024-08-25"), // 📅 Devolución
    estado: "activa" // ⏳ Activa
  },
  {
    instrumento_id: instrumentoGuitarra._id, // 🎸 Instrumento
    usuario_id: usuarioMiguel._id, // 👤 Usuario
    fecha_reserva: new Date("2024-08-22"), // 📅 Reserva reciente
    fecha_devolucion: new Date("2024-08-27"), // 📅 Devolución
    estado: "activa" // ⏳ Activa
  }
])

print("✅🎊 ¡Datos de prueba insertados exitosamente!") // 🎉 Mensaje de éxito
print("📊 Total estudiantes: " + db.estudiantes.countDocuments()) // 📈 Conteo
print("📚 Total cursos: " + db.cursos.countDocuments()) // 📈 Conteo
print("📝 Total inscripciones: " + db.inscripciones.countDocuments()) // 📈 Conteo