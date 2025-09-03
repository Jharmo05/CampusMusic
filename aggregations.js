/// ¿CUANTOS ESTUDIANTES SE HAN INSCRITO EN CADA SEDE EN EL ÚLTIMO MES?

db.inscripciones.aggregate([
  // Filtrar inscripciones del último mes
  {
    $match: {
      fecha_inscripcion: {
        $gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
      }
    }
  },
  // Unir con cursos para obtener sede_id
  {
    $lookup: {
      from: "cursos",
      localField: "curso_id",
      foreignField: "_id",
      as: "curso"
    }
  },
  { $unwind: "$curso" },
  // Unir con sedes para obtener nombre de la sede
  {
    $lookup: {
      from: "sedes",
      localField: "curso.sede_id",
      foreignField: "_id",
      as: "sede"
    }
  },
  { $unwind: "$sede" },
  // Agrupar por sede y contar inscripciones
  {
    $group: {
      _id: "$sede.nombre",
      total_estudiantes: { $sum: 1 }
    }
  },
  // Ordenar por mayor número de inscripciones
  { $sort: { total_estudiantes: -1 } }
])

/// ¿CUÁLES SON LOS CURSOS MÁS POPULARES EN CADA SEDE?

db.inscripciones.aggregate([
  // Unir con cursos
  {
    $lookup: {
      from: "cursos",
      localField: "curso_id",
      foreignField: "_id",
      as: "curso"
    }
  },
  { $unwind: "$curso" },
  // Unir con sedes
  {
    $lookup: {
      from: "sedes",
      localField: "curso.sede_id",
      foreignField: "_id",
      as: "sede"
    }
  },
  { $unwind: "$sede" },
  // Agrupar por sede y curso
  {
    $group: {
      _id: {
        sede: "$sede.nombre",
        curso: "$curso.nombre"
      },
      total_inscripciones: { $sum: 1 }
    }
  },
  // Ordenar por sede y luego por inscripciones descendente
  {
    $sort: {
      "_id.sede": 1,
      total_inscripciones: -1
    }
  }
])

/// ¿CUÁL ES EL INGRESO TOTAL POR SEDE EN EL ÚLTIMO AÑO?

db.inscripciones.aggregate([
  // Unir con cursos para obtener costo y sede
  {
    $lookup: {
      from: "cursos",
      localField: "curso_id",
      foreignField: "_id",
      as: "curso"
    }
  },
  { $unwind: "$curso" },
  // Unir con sedes
  {
    $lookup: {
      from: "sedes",
      localField: "curso.sede_id",
      foreignField: "_id",
      as: "sede"
    }
  },
  { $unwind: "$sede" },
  // Agrupar por sede y sumar el costo por inscripción
  {
    $group: {
      _id: "$sede.nombre",
      ingreso_total: { $sum: "$curso.costo" }
    }
  },
  { $sort: { ingreso_total: -1 } }
])


/// ¿QUÉ PROFESOR TIENE MÁS ESTUDIANTES INSCRITOS?

db.inscripciones.aggregate([
  // Unir con cursos para obtener profesor
  {
    $lookup: {
      from: "cursos",
      localField: "curso_id",
      foreignField: "_id",
      as: "curso"
    }
  },
  { $unwind: "$curso" },
  // Agrupar por profesor y contar estudiantes
  {
    $group: {
      _id: "$curso.profesor_id",
      total_estudiantes: { $sum: 1 }
    }
  },
  // Unir con profesores para obtener nombre
  {
    $lookup: {
      from: "profesores",
      localField: "_id",
      foreignField: "_id",
      as: "profesor"
    }
  },
  { $unwind: "$profesor" },
  // Proyectar campos legibles
  {
    $project: {
      _id: 0,
      nombre: "$profesor.nombre",
      apellido: "$profesor.apellido",
      total_estudiantes: 1
    }
  },
  // Ordenar descendente
  { $sort: { total_estudiantes: -1 } },
  { $limit: 1 }
])

//// ¿QUÉ INSTRUMENTO ES EL MÁS RESERVADO?

db.reservas_instrumentos.aggregate([
  // Agrupar por instrumento y contar reservas
  {
    $group: {
      _id: "$instrumento_id",
      total_reservas: { $sum: 1 }
    }
  },
  // Unir con instrumentos para obtener nombre
  {
    $lookup: {
      from: "instrumentos",
      localField: "_id",
      foreignField: "_id",
      as: "instrumento"
    }
  },
  { $unwind: "$instrumento" },
  {
    $project: {
      nombre: "$instrumento.nombre",
      tipo: "$instrumento.tipo",
      total_reservas: 1
    }
  },
  { $sort: { total_reservas: -1 } },
  { $limit: 1 }
])
db.reservas_instrumentos.aggregate([
  // Agrupar por instrumento y contar reservas
  {
    $group: {
      _id: "$instrumento_id",
      total_reservas: { $sum: 1 }
    }
  },
  // Unir con instrumentos para obtener nombre
  {
    $lookup: {
      from: "instrumentos",
      localField: "_id",
      foreignField: "_id",
      as: "instrumento"
    }
  },
  { $unwind: "$instrumento" },
  {
    $project: {
      nombre: "$instrumento.nombre",
      tipo: "$instrumento.tipo",
      total_reservas: 1
    }
  },
  { $sort: { total_reservas: -1 } },
  { $limit: 1 }
])

/// MOSTRAR TODOS LOS CURSOS EN LOS QUE UN ESTUDIANTE ESTÁ INSCRITO, INCLUYENDO DETALLES DEL CURSO, PROFESOR Y SEDE

const estudianteId = ObjectId("...") // Reemplazar con ID real

db.inscripciones.aggregate([
// Filtrar por estudiante
{ $match: { estudiante_id: estudianteId } },
// Unir con cursos
{
  $lookup: {
    from: "cursos",
    localField: "curso_id",
    foreignField: "_id",
    as: "curso"
  }
},
{ $unwind: "$curso" },
// Unir con profesores
{
  $lookup: {
    from: "profesores",
    localField: "curso.profesor_id",
    foreignField: "_id",
    as: "profesor"
  }
},
{ $unwind: "$profesor" },
// Unir con sedes
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
  $project: {
    fecha_inscripcion: 1,
    curso: "$curso.nombre",
    profesor: { $concat: ["$profesor.nombre", " ", "$profesor.apellido"] },
    sede: "$sede.nombre",
    nivel: "$curso.nivel",
    costo: "$curso.costo"
  }
},
{ $sort: { fecha_inscripcion: -1 } }
])


/// LISTAR TODOS LOS CURSOS DISPONIBLES EN UNA SEDE ESPECÍFICA, INCLUYENDO EL NOMBRE DEL PROFESOR Y EL NÚMERO DE ESTUDIANTES INSCRITOS

const hoy = new Date();

db.cursos.aggregate([
// Filtrar por fecha de ejecución actual
{
  $match: {
    fecha_inicio: { $lte: hoy },
    fecha_fin: { $gte: hoy }
  }
},
// Unir con sedes
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
  $project: {
    curso: "$nombre",
    sede: "$sede.nombre",
    fecha_inicio: 1,
    fecha_fin: 1
  }
},
{ $sort: { "sede": 1, "fecha_inicio": 1 } }
])

/// DETECTAR CURSOS QUE ESTÁN A PUNTO DE ALCANZAR SU CUPO MÁXIMO DE INSCRIPCIONES

db.inscripciones.aggregate([
  // Agrupar por curso y contar inscripciones
  {
    $group: {
      _id: "$curso_id",
      total_inscritos: { $sum: 1 }
    }
  },
  // Unir con cursos para comparar con cupo_maximo
  {
    $lookup: {
      from: "cursos",
      localField: "_id",
      foreignField: "_id",
      as: "curso"
          }
        },
        { $unwind: "$curso" },
        // Filtrar cursos que están a punto de alcanzar el cupo máximo (por ejemplo, 90% o más del cupo)
        {
          $addFields: {
      porcentaje_ocupado: {
        $divide: ["$total_inscritos", "$curso.cupo_maximo"]
      }
          }
        },
        {
          $match: {
      porcentaje_ocupado: { $gte: 0.9 }
          }
        },
        {
          $project: {
      curso: "$curso.nombre",
      total_inscritos: 1,
      cupo_maximo: "$curso.cupo_maximo",
      porcentaje_ocupado: 1
          }
        },
        { $sort: { porcentaje_ocupado: -1 } }
    ])


