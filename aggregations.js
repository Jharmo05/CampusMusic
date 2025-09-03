/// ¿CUÁNTOS ESTUDIANTES SE HAN INSCRITO EN CADA SEDE EN EL ÚLTIMO MES? 📈

db.inscripciones.aggregate([
  // ⏳ Paso 1: Filtrar inscripciones del último mes para el análisis
  {
    $match: {
      fecha_inscripcion: {
        $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) // 📅 Filtra desde hace 1 mes hasta ahora
      }
    }
  },
  // 🤝 Paso 2: Unir con la colección de cursos para saber a qué curso se inscribieron
  {
    $lookup: {
      from: "cursos",
      localField: "curso_id",
      foreignField: "_id",
      as: "curso"
    }
  },
  { $unwind: "$curso" }, // 💔 Desestructura el array 'curso' para trabajar con cada documento
  // 🏢 Paso 3: Unir con la colección de sedes para obtener el nombre de la sede
  {
    $lookup: {
      from: "sedes",
      localField: "curso.sede_id",
      foreignField: "_id",
      as: "sede"
    }
  },
  { $unwind: "$sede" }, // 💔 Desestructura el array 'sede'
  // 🔢 Paso 4: Agrupar por sede y contar el número total de inscripciones
  {
    $group: {
      _id: "$sede.nombre", // 📦 El nombre de la sede es la clave de agrupación
      total_estudiantes: { $sum: 1 } // ➕ Contamos cada inscripción
    }
  },
  // 🥇 Paso 5: Ordenar los resultados para ver las sedes más populares primero
  { $sort: { total_estudiantes: -1 } }
])

/// ¿CUÁLES SON LOS CURSOS MÁS POPULARES EN CADA SEDE? 🏆

db.inscripciones.aggregate([
  // 🤝 Paso 1: Unir con la colección de cursos
  {
    $lookup: {
      from: "cursos",
      localField: "curso_id",
      foreignField: "_id",
      as: "curso"
    }
  },
  { $unwind: "$curso" },
  // 🏢 Paso 2: Unir con la colección de sedes
  {
    $lookup: {
      from: "sedes",
      localField: "curso.sede_id",
      foreignField: "_id",
      as: "sede"
    }
  },
  { $unwind: "$sede" },
  // 🔢 Paso 3: Agrupar por sede y curso para contar las inscripciones
  {
    $group: {
      _id: {
        sede: "$sede.nombre", // 📦 Agrupamos primero por sede
        curso: "$curso.nombre" // 📦 Luego por nombre del curso dentro de cada sede
      },
      total_inscripciones: { $sum: 1 } // ➕ Contamos
    }
  },
  // 🥇 Paso 4: Ordenar por sede y luego por la cantidad de inscripciones de forma descendente
  {
    $sort: {
      "_id.sede": 1, // ↕️ Orden ascendente por nombre de sede
      total_inscripciones: -1 // 🥇 Orden descendente por popularidad del curso
    }
  }
])

/// ¿CUÁL ES EL INGRESO TOTAL POR SEDE EN EL ÚLTIMO AÑO? 💰

db.inscripciones.aggregate([
  // 🤝 Paso 1: Unir con la colección de cursos para obtener el costo y la sede
  {
    $lookup: {
      from: "cursos",
      localField: "curso_id",
      foreignField: "_id",
      as: "curso"
    }
  },
  { $unwind: "$curso" },
  // 🏢 Paso 2: Unir con la colección de sedes para obtener el nombre
  {
    $lookup: {
      from: "sedes",
      localField: "curso.sede_id",
      foreignField: "_id",
      as: "sede"
    }
  },
  { $unwind: "$sede" },
  // 💰 Paso 3: Agrupar por sede y sumar el costo de cada inscripción
  {
    $group: {
      _id: "$sede.nombre", // 📦 Agrupamos por sede
      ingreso_total: { $sum: "$curso.costo" } // ➕ Sumamos el costo de cada curso (asumiendo que existe un campo 'costo')
    }
  },
  // 🥇 Paso 4: Ordenar de mayor a menor ingreso
  { $sort: { ingreso_total: -1 } }
])

/// ¿QUÉ PROFESOR TIENE MÁS ESTUDIANTES INSCRITOS? 👨‍🏫

db.inscripciones.aggregate([
  // 🤝 Paso 1: Unir con la colección de cursos para obtener el ID del profesor
  {
    $lookup: {
      from: "cursos",
      localField: "curso_id",
      foreignField: "_id",
      as: "curso"
    }
  },
  { $unwind: "$curso" },
  // 🔢 Paso 2: Agrupar por profesor para contar el total de estudiantes
  {
    $group: {
      _id: "$curso.profesor_id", // 📦 La clave es el ID del profesor
      total_estudiantes: { $sum: 1 } // ➕ Sumamos los estudiantes
    }
  },
  // 🤝 Paso 3: Unir con la colección de profesores para obtener su nombre
  {
    $lookup: {
      from: "profesores",
      localField: "_id",
      foreignField: "_id",
      as: "profesor"
    }
  },
  { $unwind: "$profesor" },
  // ✍️ Paso 4: Proyectar un resultado más limpio y legible
  {
    $project: {
      _id: 0, // 🗑️ Quitamos el ID interno
      nombre: "$profesor.nombre",
      apellido: "$profesor.apellido",
      total_estudiantes: 1
    }
  },
  // 🥇 Paso 5: Ordenar y mostrar solo al primero
  { $sort: { total_estudiantes: -1 } },
  { $limit: 1 } // 🏆 ¡El ganador!
])

//// ¿QUÉ INSTRUMENTO ES EL MÁS RESERVADO? 🥁🎹🎸

db.reservas_instrumentos.aggregate([
  // 🔢 Paso 1: Agrupar por instrumento y contar la cantidad de reservas
  {
    $group: {
      _id: "$instrumento_id", // 📦 La clave es el ID del instrumento
      total_reservas: { $sum: 1 } // ➕ Contamos las reservas
    }
  },
  // 🤝 Paso 2: Unir con la colección de instrumentos para obtener su nombre y tipo
  {
    $lookup: {
      from: "instrumentos",
      localField: "_id",
      foreignField: "_id",
      as: "instrumento"
    }
  },
  { $unwind: "$instrumento" },
  // ✍️ Paso 3: Proyectar campos más bonitos
  {
    $project: {
      nombre: "$instrumento.nombre",
      tipo: "$instrumento.tipo",
      total_reservas: 1
    }
  },
  // 🥇 Paso 4: Ordenar y mostrar solo al más popular
  { $sort: { total_reservas: -1 } },
  { $limit: 1 } // 🏆 ¡El instrumento estrella!
])

/// MOSTRAR TODOS LOS CURSOS EN LOS QUE UN ESTUDIANTE ESTÁ INSCRITO, INCLUYENDO DETALLES DEL CURSO, PROFESOR Y SEDE 🎓

const estudianteId = ObjectId("653282b545d9e51c11060938"); // ⚠️ ¡REEMPLAZA ESTO CON UN ID REAL!

db.inscripciones.aggregate([
  // 🔍 Paso 1: Filtrar solo las inscripciones de un estudiante específico
  { $match: { estudiante_id: estudianteId } },
  // 🤝 Paso 2: Unir con la colección de cursos
  {
    $lookup: {
      from: "cursos",
      localField: "curso_id",
      foreignField: "_id",
      as: "curso"
    }
  },
  { $unwind: "$curso" },
  // 🤝 Paso 3: Unir con la colección de profesores
  {
    $lookup: {
      from: "profesores",
      localField: "curso.profesor_id",
      foreignField: "_id",
      as: "profesor"
    }
  },
  { $unwind: "$profesor" },
  // 🤝 Paso 4: Unir con la colección de sedes
  {
    $lookup: {
      from: "sedes",
      localField: "curso.sede_id",
      foreignField: "_id",
      as: "sede"
    }
  },
  { $unwind: "$sede" },
  {
    // ✍️ Paso 5: Proyectar los datos en un formato legible
    $project: {
      fecha_inscripcion: 1,
      curso: "$curso.nombre",
      profesor: { $concat: ["$profesor.nombre", " ", "$profesor.apellido"] }, // ✍️ Creamos un nombre completo
      sede: "$sede.nombre",
      nivel: "$curso.nivel", // ℹ️ Asumiendo que el curso tiene un nivel
      costo: "$curso.costo" // 💰 Asumiendo que el curso tiene un costo
    }
  },
  // 🗓️ Paso 6: Ordenar por fecha de inscripción
  { $sort: { fecha_inscripcion: -1 } }
])

/// LISTAR TODOS LOS CURSOS DISPONIBLES EN UNA SEDE ESPECÍFICA, INCLUYENDO EL NOMBRE DEL PROFESOR Y EL NÚMERO DE ESTUDIANTES INSCRITOS 📚

const hoy = new Date();

db.cursos.aggregate([
  // 🔍 Paso 1: Filtrar los cursos que están activos en la fecha actual
  {
    $match: {
      fecha_inicio: { $lte: hoy }, // 🚦 La fecha de inicio debe ser hoy o antes
      fecha_fin: { $gte: hoy } // 🚦 La fecha de fin debe ser hoy o después
    }
  },
  // 🤝 Paso 2: Unir con la colección de sedes
  {
    $lookup: {
      from: "sedes",
      localField: "sede_id",
      foreignField: "_id",
      as: "sede"
    }
  },
  { $unwind: "$sede" },
  {
    // ✍️ Paso 3: Proyectar la información relevante
    $project: {
      curso: "$nombre",
      sede: "$sede.nombre",
      fecha_inicio: 1,
      fecha_fin: 1
    }
  },
  { $sort: { "sede": 1, "fecha_inicio": 1 } } // 📝 Ordenamos por sede y luego por fecha de inicio
])

/// DETECTAR CURSOS QUE ESTÁN A PUNTO DE ALCANZAR SU CUPO MÁXIMO DE INSCRIPCIONES ⚠️

db.inscripciones.aggregate([
  // 🔢 Paso 1: Agrupar por curso y contar el total de inscritos
  {
    $group: {
      _id: "$curso_id",
      total_inscritos: { $sum: 1 }
    }
  },
  // 🤝 Paso 2: Unir con la colección de cursos para obtener el cupo máximo
  {
    $lookup: {
      from: "cursos",
      localField: "_id",
      foreignField: "_id",
      as: "curso"
    }
  },
  { $unwind: "$curso" },
  // 📊 Paso 3: Calcular el porcentaje de ocupación
  {
    $addFields: {
      porcentaje_ocupado: {
        $divide: ["$total_inscritos", "$curso.cupo_maximo"] // ➗ Dividimos inscritos entre el cupo
      }
    }
  },
  // ⚠️ Paso 4: Filtrar solo los cursos que están casi llenos (90% o más)
  {
    $match: {
      porcentaje_ocupado: { $gte: 0.9 } // 🎯 El umbral crítico
    }
  },
  {
    // ✍️ Paso 5: Proyectar los datos en un formato claro
    $project: {
      curso: "$curso.nombre",
      total_inscritos: 1,
      cupo_maximo: "$curso.cupo_maximo",
      porcentaje_ocupado: 1
    }
  },
  // 📈 Paso 6: Ordenar de mayor a menor ocupación
  { $sort: { porcentaje_ocupado: -1 } }
])