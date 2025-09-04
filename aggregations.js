/// ¿CUÁNTOS ESTUDIANTES SE HAN INSCRITO EN CADA SEDE EN EL ÚLTIMO MES? 📈
db.inscripciones.aggregate([
  { // ⏳ Paso 1: Filtrar inscripciones del último mes
    $match: {
      fecha_inscripcion: {
        $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) // 📅 Hace 1 mes
      }
    }
  },
  { // 🤝 Paso 2: Unir con cursos
    $lookup: {
      from: "cursos",
      localField: "curso_id",
      foreignField: "_id",
      as: "curso"
    }
  },
  { $unwind: { path: "$curso", preserveNullAndEmptyArrays: true } }, // 💔 Expandir curso
  { // 🏢 Paso 3: Unir con sedes
    $lookup: {
      from: "sedes",
      localField: "curso.sede_id",
      foreignField: "_id",
      as: "sede"
    }
  },
  { $unwind: { path: "$sede", preserveNullAndEmptyArrays: true } }, // 💔 Expandir sede
  { $match: { sede: { $ne: null } } }, // 🚀 Evita resultados con sede nula
  { // 🔢 Paso 4: Agrupar por sede y contar
    $group: {
      _id: "$sede.nombre",
      total_estudiantes: { $sum: 1 }
    }
  },
  { $sort: { total_estudiantes: -1 } } // 🥇 Orden descendente
]) // ✅ Fin pipeline
