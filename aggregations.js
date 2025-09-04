use campusMusic // 🎶 Asegúrate de estar en la DB correcta antes de ejecutar

/// ¿CUÁNTOS ESTUDIANTES SE HAN INSCRITO EN CADA SEDE EN EL ÚLTIMO MES? 📈
db.inscripciones.aggregate([ // ▶️ Iniciamos el pipeline
  { // ⏳ Paso 1: Filtrar inscripciones del último mes
    $match: { // 🎯 Condición
      fecha_inscripcion: { // 📅 Campo de fecha
        $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) // ⏱️ Desde hace 1 mes
      }
    }
  },
  { // 🤝 Paso 2: Unir con cursos para conocer sede
    $lookup: { // 🔗 Join con cursos
      from: "cursos", // 📚 Colección cursos
      localField: "curso_id", // 🧵 Llave local
      foreignField: "_id", // 🪡 Llave foránea
      as: "curso" // 🎁 Resultado en arreglo
    }
  },
  { $unwind: { path: "$curso", preserveNullAndEmptyArrays: true } }, // 💔 Expandir curso, tolerando vacíos
  { // 🏢 Paso 3: Unir con sedes para obtener nombre
    $lookup: {
      from: "sedes", // 🏢 Colección sedes
      localField: "curso.sede_id", // 🧵 Llave local
      foreignField: "_id", // 🪡 Llave foránea
      as: "sede" // 🎁 Resultado
    }
  },
  { $unwind: { path: "$sede", preserveNullAndEmptyArrays: true } }, // 💔 Expandir sede, tolerando vacíos
  { // 🔢 Paso 4: Agrupar por sede y contar
    $group: { // 📦 Agrupación
      _id: "$sede.nombre", // 🏷️ Clave: nombre de sede
      total_estudiantes: { $sum: 1 } // ➕ Conteo
    }
  },
  { $sort: { total_estudiantes: -1 } } // 🥇 Paso 5: Orden descendente
]) // ✅ Fin pipeline

/// ¿CUÁLES SON LOS CURSOS MÁS POPULARES EN CADA SEDE? 🏆
db.inscripciones.aggregate([ // ▶️ Pipeline
  { // 🤝 Paso 1: Unir con cursos
    $lookup: {
      from: "cursos",
      localField: "curso_id",
      foreignField: "_id",
      as: "curso"
    }
  },
  { $unwind: { path: "$curso", preserveNullAndEmptyArrays: true } }, // 💔
  { // 🏢 Paso 2: Unir con sedes
    $lookup: {
      from: "sedes",
      localField: "curso.sede_id",
      foreignField: "_id",
      as: "sede"
    }
  },
  { $unwind: { path: "$sede", preserveNullAndEmptyArrays: true } }, // 💔
  { // 🔢 Paso 3: Agrupar por sede y curso
    $group: {
      _id: { sede: "$sede.nombre", curso: "$curso.nombre" }, // 🧩 Clave compuesta
      total_inscripciones: { $sum: 1 } // ➕ Conteo
    }
  },
  { // 🥇 Paso 4: Ordenar por sede asc y por total desc
    $sort: { "_id.sede": 1, total_inscripciones: -1 }
  }
]) // ✅ Fin pipeline

/// ¿CUÁL ES EL INGRESO TOTAL POR SEDE EN EL ÚLTIMO AÑO? 💰
db.inscripciones.aggregate([ // ▶️ Pipeline
  { // 🤝 Paso 1: Unir con cursos (para costo y sede)
    $lookup: { from: "cursos", localField: "curso_id", foreignField: "_id", as: "curso" }
  },
  { $unwind: { path: "$curso", preserveNullAndEmptyArrays: true } }, // 💔
  { // 🏢 Paso 2: Unir con sedes
    $lookup: { from: "sedes", localField: "curso.sede_id", foreignField: "_id", as: "sede" }
  },
  { $unwind: { path: "$sede", preserveNullAndEmptyArrays: true } }, // 💔
  { // ⏳ Paso 2.5: Filtrar último año (opcional/quitable)
    $match: { fecha_inscripcion: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) } }
  },
  { // 💰 Paso 3: Agrupar por sede y sumar costo
    $group: { _id: "$sede.nombre", ingreso_total: { $sum: "$curso.costo" } }
  },
  { $sort: { ingreso_total: -1 } } // 🥇 Paso 4: Ordenar por ingreso
]) // ✅ Fin pipeline

/// ¿QUÉ PROFESOR TIENE MÁS ESTUDIANTES INSCRITOS? 👨‍🏫
db.inscripciones.aggregate([ // ▶️ Pipeline
  { // 🤝 Paso 1: Unir con cursos para obtener profesor_id
    $lookup: { from: "cursos", localField: "curso_id", foreignField: "_id", as: "curso" }
  },
  { $unwind: { path: "$curso", preserveNullAndEmptyArrays: true } }, // 💔
  { // 🔢 Paso 2: Agrupar por profesor
    $group: { _id: "$curso.profesor_id", total_estudiantes: { $sum: 1 } }
  },
  { // 🤝 Paso 3: Unir con profesores para obtener nombre
    $lookup: { from: "profesores", localField: "_id", foreignField: "_id", as: "profesor" }
  },
  { $unwind: { path: "$profesor", preserveNullAndEmptyArrays: true } }, // 💔
  { // ✍️ Paso 4: Proyección amigable
    $project: { _id: 0, nombre: "$profesor.nombre", apellido: "$profesor.apellido", total_estudiantes: 1 }
  },
  { $sort: { total_estudiantes: -1 } }, // 🥇 Paso 5: Ordenar
  { $limit: 1 } // 🏆 Mostrar solo el top 1
]) // ✅ Fin pipeline

//// ¿QUÉ INSTRUMENTO ES EL MÁS RESERVADO? 🥁🎹🎸
db.reservas_instrumentos.aggregate([ // ▶️ Pipeline
  { // 🔢 Paso 1: Agrupar por instrumento
    $group: { _id: "$instrumento_id", total_reservas: { $sum: 1 } }
  },
  { // 🤝 Paso 2: Unir con instrumentos para nombre y tipo
    $lookup: { from: "instrumentos", localField: "_id", foreignField: "_id", as: "instrumento" }
  },
  { $unwind: { path: "$instrumento", preserveNullAndEmptyArrays: true } }, // 💔
  { // ✍️ Paso 3: Proyección clara
    $project: { nombre: "$instrumento.nombre", tipo: "$instrumento.tipo", total_reservas: 1 }
  },
  { $sort: { total_reservas: -1 } }, // 🥇 Paso 4: Ordenar
  { $limit: 1 } // 🏆 Top 1
]) // ✅ Fin pipeline

/// MOSTRAR TODOS LOS CURSOS EN LOS QUE UN ESTUDIANTE ESTÁ INSCRITO, INCLUYENDO DETALLES DEL CURSO, PROFESOR Y SEDE 🎓
(function () { // 🧠 IIFE para resolver estudiante por cédula
  const cedulaEstudiante = "1122334455"; // 🆔 Cambia si quieres otro
  const est = db.estudiantes.findOne({ cedula: cedulaEstudiante }); // 🔍 Buscamos estudiante
  if (!est) { print("❌ Estudiante no encontrado"); return; } // 🛑 Si no existe, salimos
  db.inscripciones.aggregate([ // ▶️ Pipeline
    { $match: { estudiante_id: est._id } }, // 🔍 Paso 1: Filtrar por estudiante
    { $lookup: { from: "cursos", localField: "curso_id", foreignField: "_id", as: "curso" } }, // 🤝 Paso 2
    { $unwind: { path: "$curso", preserveNullAndEmptyArrays: true } }, // 💔
    { $lookup: { from: "profesores", localField: "curso.profesor_id", foreignField: "_id", as: "profesor" } }, // 🤝 Paso 3
    { $unwind: { path: "$profesor", preserveNullAndEmptyArrays: true } }, // 💔
    { $lookup: { from: "sedes", localField: "curso.sede_id", foreignField: "_id", as: "sede" } }, // 🤝 Paso 4
    { $unwind: { path: "$sede", preserveNullAndEmptyArrays: true } }, // 💔
    { // ✍️ Paso 5: Proyección bonita
      $project: {
        _id: 0, // 🗑️ Ocultamos _id
        fecha_inscripcion: 1, // 📅 Fecha
        curso: "$curso.nombre", // 📚 Nombre del curso
        profesor: { $concat: ["$profesor.nombre", " ", "$profesor.apellido"] }, // 👨‍🏫 Profe
        sede: "$sede.nombre", // 🏢 Sede
        nivel: "$curso.nivel", // 📊 Nivel
        costo: "$curso.costo" // 💰 Costo
      }
    },
    { $sort: { fecha_inscripcion: -1 } } // 🗓️ Paso 6: Ordenar por fecha desc
  ]).forEach(doc => printjson(doc)) // 🖨️ Imprimimos resultados
})(); // 🏁 Fin IIFE

/// LISTAR TODOS LOS CURSOS ACTIVOS EN UNA SEDE ESPECÍFICA, CON NOMBRE DEL PROFESOR 📚
(function () { // 🧠 IIFE para resolver sede por nombre
  const sedeObjetivo = "Campus Norte"; // 🏷️ Cambia por otra sede si quieres
  const hoy = new Date(); // 📅 Fecha actual
  const sede = db.sedes.findOne({ nombre: sedeObjetivo }); // 🔍 Buscamos sede
  if (!sede) { print("❌ Sede no encontrada"); return; } // 🛑 Validación
  db.cursos.aggregate([ // ▶️ Pipeline
    { $match: { sede_id: sede._id, fecha_inicio: { $lte: hoy }, fecha_fin: { $gte: hoy } } }, // 🔍 Paso 1: Cursos activos en esa sede
    { $lookup: { from: "profesores", localField: "profesor_id", foreignField: "_id", as: "prof" } }, // 🤝 Paso 2: Unir profesor
    { $unwind: { path: "$prof", preserveNullAndEmptyArrays: true } }, // 💔
    { // ✍️ Paso 3: Proyección clara
      $project: { _id: 0, curso: "$nombre", sede: sedeObjetivo, profesor: { $concat: ["$prof.nombre", " ", "$prof.apellido"] }, fecha_inicio: 1, fecha_fin: 1 }
    },
    { $sort: { curso: 1 } } // 🗂️ Ordenar por nombre
  ]).forEach(doc => printjson(doc)) // 🖨️ Mostrar resultados
})(); // 🏁 Fin IIFE

/// DETECTAR CURSOS QUE ESTÁN A PUNTO DE ALCANZAR SU CUPO MÁXIMO DE INSCRIPCIONES ⚠️
db.inscripciones.aggregate([ // ▶️ Pipeline
  { // 🔢 Paso 1: Agrupar por curso y contar el total de inscritos
    $group: { _id: "$curso_id", total_inscritos: { $sum: 1 } }
  },
  { // 🤝 Paso 2: Unir con la colección de cursos para obtener el cupo máximo
    $lookup: { from: "cursos", localField: "_id", foreignField: "_id", as: "curso" }
  },
  { $unwind: { path: "$curso", preserveNullAndEmptyArrays: true } }, // 💔
  { // 📊 Paso 3: Calcular el porcentaje de ocupación
    $addFields: { porcentaje_ocupado: { $divide: ["$total_inscritos", "$curso.cupo_maximo"] } }
  },
  { // ⚠️ Paso 4: Filtrar solo los cursos que están casi llenos (90% o más)
    $match: { porcentaje_ocupado: { $gte: 0.9 } }
  },
  { // ✍️ Paso 5: Proyectar datos
    $project: { _id: 0, curso: "$curso.nombre", total_inscritos: 1, cupo_maximo: "$curso.cupo_maximo", porcentaje_ocupado: 1 }
  },
  { $sort: { porcentaje_ocupado: -1 } } // 📈 Paso 6: Ordenar
]) // ✅ Fin pipeline
