use campusMusic // 🎶 ¡Conectando con nuestra vibrante base de datos musical!

// 🎯 AGREGACIÓN 1: Estudiantes inscritos por sede en el último mes
print("📊✨ AGREGACIÓN 1: Estudiantes Inscritos por Sede (Último Mes) ✨📊");
print("🔍 Vamos a descubrir qué sedes son las más activas con nuevos talentos. 🚀");
db.inscripciones.aggregate([
  { 
    $match: { // ⏳ Filtramos para capturar solo las inscripciones más frescas del último mes
      fecha_inscripcion: { 
        $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) // 🗓️ Calculamos la fecha de hace un mes exacto
      }
    }
  },
  {
    $lookup: { // 🤝 Hacemos magia para traer los detalles de los cursos asociados a cada inscripción
      from: "cursos", // 📚 Desde la colección de cursos
      localField: "curso_id", // 🔗 Usando el ID del curso en inscripciones
      foreignField: "_id", // 🔑 Coincidiendo con el ID único del curso
      as: "curso" // 🏷️ Guardamos los detalles del curso en un nuevo campo llamado 'curso'
    }
  },
  { $unwind: { path: "$curso", preserveNullAndEmptyArrays: true } }, // 🌬️ Desempaquetamos el array 'curso', ¡listo para usar!
  {
    $lookup: { // 🤝 Y ahora, a buscar en qué sede se imparte cada curso
      from: "sedes", // 🏢 Desde la colección de sedes
      localField: "curso.sede_id", // 🔗 Usando el ID de la sede que está dentro del curso
      foreignField: "_id", // 🔑 Coincidiendo con el ID único de la sede
      as: "sede" // 🏷️ Almacenamos los datos de la sede en el campo 'sede'
    }
  },
  { $unwind: { path: "$sede", preserveNullAndEmptyArrays: true } }, // 🌬️ Desempaquetamos 'sede' también, ¡todo a la vista!
  { $match: { sede: { $ne: null } } }, // 🛑 Nos aseguramos de solo contar inscripciones que realmente tienen una sede asignada
  {
    $group: { // 📦 ¡Hora de agrupar! Contaremos cuántos estudiantes por cada sede
      _id: "$sede.nombre", // 🏷️ El nombre de la sede será nuestra clave de agrupación
      total_estudiantes: { $sum: 1 } // ➕ Cada inscripción suma un estudiante a la sede
    }
  },
  { $sort: { total_estudiantes: -1 } } // 📉 Ordenamos de mayor a menor para ver las sedes con más 'buzz'
]).forEach(doc => printjson(doc)) // 📝 Imprimimos los resultados bonitos en formato JSON

// 🎯 AGREGACIÓN 2: Cursos más populares por sede
print("\n\n🎯🌟 AGREGACIÓN 2: Cursos Más Populares por Sede 🌟🎯");
print("🚀 Descubramos qué cursos están rompiendo taquillas en cada campus. ¡A rockear! 🎸");
db.inscripciones.aggregate([
  {
    $lookup: { // 🤝 Conectamos cada inscripción con los detalles de su curso
      from: "cursos", // 📚 Buscando en la colección de cursos
      localField: "curso_id", // 🔗 El ID del curso en la inscripción
      foreignField: "_id", // 🔑 Coincidiendo con el ID del curso
      as: "curso" // 🏷️ Guardamos los datos del curso
    }
  },
  { $unwind: { path: "$curso", preserveNullAndEmptyArrays: true } }, // 🌬️ Desempaquetamos el curso
  {
    $lookup: { // 🤝 Ahora, buscamos la sede a la que pertenece cada curso
      from: "sedes", // 🏢 Buscando en la colección de sedes
      localField: "curso.sede_id", // 🔗 El ID de la sede dentro del curso
      foreignField: "_id", // 🔑 Coincidiendo con el ID de la sede
      as: "sede" // 🏷️ Guardamos los datos de la sede
    }
  },
  { $unwind: { path: "$sede", preserveNullAndEmptyArrays: true } }, // 🌬️ Desempaquetamos la sede
  {
    $group: { // 📦 Agrupamos para contar la popularidad: por sede y luego por curso
      _id: { sede: "$sede.nombre", curso: "$curso.nombre" }, // 🏷️ Clave compuesta: nombre de la sede y nombre del curso
      total_inscripciones: { $sum: 1 } // ➕ Contamos cada inscripción como un voto de popularidad
    }
  },
  { // 📊 Ordenamos: primero por sede (alfabéticamente) y luego los cursos más populares primero
    $sort: { "_id.sede": 1, total_inscripciones: -1 } // 📈 De A-Z en sedes, y luego de más a menos inscripciones
  }
]).forEach(doc => printjson(doc)) // 📝 ¡A imprimir esos hits musicales!

// 🎯 AGREGACIÓN 3: Ingreso total por sede
print("\n\n💰💸 AGREGACIÓN 3: Ingreso Total por Sede 💸💰");
print("📈 ¿Qué sedes son las que más contribuyen a nuestra armonía financiera? ¡A sumar! 🎼");
db.inscripciones.aggregate([
  {
    $lookup: { // 🤝 Unimos inscripciones con los cursos para saber su costo
      from: "cursos", // 📚 Desde la colección de cursos
      localField: "curso_id", // 🔗 El ID del curso de la inscripción
      foreignField: "_id", // 🔑 Coincidiendo con el ID del curso
      as: "curso" // 🏷️ Traemos los detalles del curso
    }
  },
  { $unwind: { path: "$curso", preserveNullAndEmptyArrays: true } }, // 🌬️ Desempaquetamos el curso
  {
    $lookup: { // 🤝 Unimos los cursos con sus sedes para agrupar ingresos
      from: "sedes", // 🏢 Desde la colección de sedes
      localField: "curso.sede_id", // 🔗 El ID de la sede del curso
      foreignField: "_id", // 🔑 Coincidiendo con el ID de la sede
      as: "sede" // 🏷️ Traemos los detalles de la sede
    }
  },
  { $unwind: { path: "$sede", preserveNullAndEmptyArrays: true } }, // 🌬️ Desempaquetamos la sede
  {
    $group: { // 📦 Agrupamos todas las inscripciones por sede y sumamos sus costos
      _id: "$sede.nombre", // 🏷️ El nombre de la sede como clave
      ingreso_total: { $sum: "$curso.costo" } // ➕ Sumamos el 'costo' de cada curso inscrito
    }
  },
  { $sort: { ingreso_total: -1 } } // 📉 Ordenamos para ver las sedes más rentables primero
]).forEach(doc => printjson(doc)) // 📝 ¡Resultados financieros en la batuta!

// 🎯 AGREGACIÓN 4: Profesor con más estudiantes
print("\n\n👨‍🏫🏆 AGREGACIÓN 4: Profesor con Más Estudiantes 🏆👨‍🏫");
print("✨ ¿Quién es el director de orquesta con la mayor cantidad de alumnos? ¡Descubrámoslo! 🌟");
db.inscripciones.aggregate([
  {
    $lookup: { // 🤝 Vinculamos cada inscripción con los datos del curso
      from: "cursos", // 📚 Desde la colección de cursos
      localField: "curso_id", // 🔗 El ID del curso en la inscripción
      foreignField: "_id", // 🔑 Coincidiendo con el ID del curso
      as: "curso" // 🏷️ Traemos el curso
    }
  },
  { $unwind: { path: "$curso", preserveNullAndEmptyArrays: true } }, // 🌬️ Desempaquetamos el curso
  {
    $group: { // 📦 Agrupamos por el ID del profesor para contar sus estudiantes
      _id: "$curso.profesor_id", // 🏷️ El ID del profesor como clave
      total_estudiantes: { $sum: 1 } // ➕ Cada inscripción suma un estudiante a ese profesor
    }
  },
  {
    $lookup: { // 🤝 Ahora, con los IDs de profesor, buscamos sus nombres
      from: "profesores", // 👨‍🏫 Desde la colección de profesores
      localField: "_id", // 🔗 El ID del profesor (resultado del group)
      foreignField: "_id", // 🔑 Coincidiendo con el ID del profesor
      as: "profesor" // 🏷️ Traemos los datos del profesor
    }
  },
  { $unwind: { path: "$profesor", preserveNullAndEmptyArrays: true } }, // 🌬️ Desempaquetamos el profesor
  { // ✍️ Proyectamos un resultado más legible, con nombre y apellido del profesor
    $project: { 
      _id: 0, // 🚫 Ocultamos el ID interno de MongoDB para que sea más claro
      nombre: "$profesor.nombre", // 🏷️ El nombre del profesor
      apellido: "$profesor.apellido", // 🏷️ El apellido del profesor
      total_estudiantes: 1 // 🔢 Y el conteo de estudiantes
    }
  },
  { $sort: { total_estudiantes: -1 } }, // 📉 Ordenamos del profesor con más estudiantes al que tiene menos
  { $limit: 1 } // 🏆 ¡Y seleccionamos solo al campeón!
]).forEach(doc => printjson(doc)) // 📝 Anunciamos al profesor estrella

// 🎯 AGREGACIÓN 5: Instrumento más reservado
print("\n\n🥁🥇 AGREGACIÓN 5: Instrumento Más Reservado 🥇🥁");
print("🎵 ¿Cuál es el instrumento más codiciado en nuestras salas de ensayo? ¡Que suene la música! 🎷");
db.reservas_instrumentos.aggregate([
  {
    $group: { // 📦 Agrupamos las reservas para contar cuántas veces se ha reservado cada instrumento
      _id: "$instrumento_id", // 🏷️ El ID del instrumento como clave de agrupación
      total_reservas: { $sum: 1 } // ➕ Cada reserva cuenta como una para el instrumento
    }
  },
  {
    $lookup: { // 🤝 Conectamos con la colección de instrumentos para obtener sus nombres y tipos
      from: "instrumentos", // 🎹 Desde la colección de instrumentos
      localField: "_id", // 🔗 El ID del instrumento (resultado del group)
      foreignField: "_id", // 🔑 Coincidiendo con el ID del instrumento
      as: "instrumento" // 🏷️ Traemos los detalles del instrumento
    }
  },
  { $unwind: { path: "$instrumento", preserveNullAndEmptyArrays: true } }, // 🌬️ Desempaquetamos el instrumento
  { // ✍️ Proyectamos un resultado claro: nombre, tipo y conteo de reservas
    $project: { 
      nombre: "$instrumento.nombre", // 🏷️ El nombre del instrumento
      tipo: "$instrumento.tipo", // 🏷️ El tipo (cuerda, viento, percusión, etc.)
      total_reservas: 1 // 🔢 El total de veces que fue reservado
    }
  },
  { $sort: { total_reservas: -1 } }, // 📉 Ordenamos para ver el instrumento más popular primero
  { $limit: 1 } // 🏆 ¡Revelamos al instrumento más deseado!
]).forEach(doc => printjson(doc)) // 📝 Y lo presentamos en el escenario

// 🎯 AGREGACIÓN 6: Cursos de un estudiante específico
print("\n\n🎓📖 AGREGACIÓN 6: Cursos de un Estudiante Específico 📖🎓");
print("🕵️‍♀️ Vamos a investigar el recorrido musical de uno de nuestros estudiantes. ¡En marcha! 🚶‍♀️");
(function () { // 🧠 Encapsulamos en una función anónima para mantener las variables locales limpias
  const cedulaEstudiante = "1122334455"; // 🆔 La cédula de nuestro estudiante "Daniela Suárez" para el ejemplo
  const est = db.estudiantes.findOne({ cedula: cedulaEstudiante }); // 🔍 Primero, encontramos al estudiante por su cédula
  if (!est) { print("❌ Estudiante no encontrado. ¡Verifica la cédula!"); return; } // 🛑 Si no lo encontramos, avisamos y salimos
  
  print(`🎵 Mostrando cursos de: ${est.nombre} ${est.apellido} (Cédula: ${est.cedula}) 🎵`); // 👋 Un saludo personalizado
  
  db.inscripciones.aggregate([
    { $match: { estudiante_id: est._id } }, // 🔍 Filtramos todas las inscripciones de este estudiante en particular
    { 
      $lookup: { // 🤝 Conectamos cada inscripción con los datos de su curso
        from: "cursos", // 📚 Desde la colección de cursos
        localField: "curso_id", // 🔗 El ID del curso en la inscripción
        foreignField: "_id", // 🔑 Coincidiendo con el ID del curso
        as: "curso" // 🏷️ Traemos los detalles del curso
      }
    },
    { $unwind: { path: "$curso", preserveNullAndEmptyArrays: true } }, // 🌬️ Desempaquetamos el curso
    { 
      $lookup: { // 🤝 Ahora, buscamos los datos del profesor que imparte ese curso
        from: "profesores", // 👨‍🏫 Desde la colección de profesores
        localField: "curso.profesor_id", // 🔗 El ID del profesor que está dentro del curso
        foreignField: "_id", // 🔑 Coincidiendo con el ID del profesor
        as: "profesor" // 🏷️ Traemos los datos del profesor
      }
    },
    { $unwind: { path: "$profesor", preserveNullAndEmptyArrays: true } }, // 🌬️ Desempaquetamos el profesor
    { 
      $lookup: { // 🤝 Y finalmente, conectamos con la sede donde se realiza el curso
        from: "sedes", // 🏢 Desde la colección de sedes
        localField: "curso.sede_id", // 🔗 El ID de la sede que está dentro del curso
        foreignField: "_id", // 🔑 Coincidiendo con el ID de la sede
        as: "sede" // 🏷️ Traemos los datos de la sede
      }
    },
    { $unwind: { path: "$sede", preserveNullAndEmptyArrays: true } }, // 🌬️ Desempaquetamos la sede
    { // ✍️ Proyectamos un resultado muy detallado y amigable para el estudiante
      $project: {
        _id: 0, // 🚫 Escondemos el ID interno de MongoDB
        fecha_inscripcion: "$fecha_inscripcion", // 📅 La fecha en que se inscribió
        curso: "$curso.nombre", // 📚 El nombre del curso
        profesor: { $concat: ["$profesor.nombre", " ", "$profesor.apellido"] }, // 👨‍🏫 Nombre completo del profesor (¡aquí estaba el detalle!)
        sede: "$sede.nombre", // 🏢 Nombre de la sede
        costo: "$curso.costo", // 💰 Costo del curso
        nivel: "$curso.nivel" // 📊 Nivel del curso
      }
    }
  ]).forEach(doc => printjson(doc)) // 📝 Imprimimos el itinerario musical de nuestro estudiante
})(); // 🏁 Fin de la función anónima y su ejecución ¡Misión cumplida!