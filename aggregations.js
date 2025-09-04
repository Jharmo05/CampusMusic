use campusMusic // 🎶 Asegúrate de estar en la DB correcta antes de ejecutar

/// ¿CUÁNTOS ESTUDIANTES SE HAN INSCRITO EN CADA SEDE EN EL ÚLTIMO MES? 📈
db.inscripciones.aggregate([
  { // ⏳ Paso 1: Filtrar inscripciones del último mes
    $match: {
      fecha_inscripcion: {
        $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) // ⏱️ Desde hace 1 mes
      }
    }
  },
  { // 🤝 Paso 2: Unir con cursos para conocer sede
    $lookup: {
      from: "cursos",
      localField: "curso_id",
      foreignField: "_id",
      as: "curso"
    }
  },
  { $unwind: { path: "$curso", preserveNullAndEmptyArrays: true } }, // 💔 Expandir curso
  { // 🏢 Paso 3: Unir con sedes para obtener nombre
    $lookup: {
      from: "sedes",
      localField: "curso.sede_id",
      foreignField: "_id",
      as: "sede"
    }
  },
  { $unwind: { path: "$sede", preserveNullAndEmptyArrays: true } }, // 💔 Expandir sede
  { $match: { sede: { $ne: null } } }, // 🚀 Evitar resultados nulos
  { // 🔢 Paso 4: Agrupar por sede y contar
    $group: {
      _id: "$sede.nombre",
      total_estudiantes: { $sum: 1 }
    }
  },
  { $sort: { total_estudiantes: -1 } } // 🥇 Orden descendente
]) // ✅ Fin pipeline

/// ¿CUÁLES SON LOS CURSOS MÁS POPULARES EN CADA SEDE? 🏆
db.inscripciones.aggregate([
  { $lookup: { from: "cursos", localField: "curso_id", foreignField: "_id", as: "curso" } },
  { $unwind: { path: "$curso", preserveNullAndEmptyArrays: true } },
  { $lookup: { from: "sedes", localField: "curso.sede_id", foreignField: "_id", as: "sede" } },
  { $unwind: { path: "$sede", preserveNullAndEmptyArrays: true } },
  { $group: { _id: { sede: "$sede.nombre", curso: "$curso.nombre" }, total_inscripciones: { $sum: 1 } } },
  { $sort: { "_id.sede": 1, total_inscripciones: -1 } }
]) // ✅ Fin pipeline

/// ¿CUÁL ES EL INGRESO TOTAL POR SEDE EN EL ÚLTIMO AÑO? 💰
db.inscripciones.aggregate([
  { $lookup: { from: "cursos", localField: "curso_id", foreignField: "_id", as: "curso" } },
  { $unwind: { path: "$curso", preserveNullAndEmptyArrays: true } },
  { $lookup: { from: "sedes", localField: "curso.sede_id", foreignField: "_id", as: "sede" } },
  { $unwind: { path: "$sede", preserveNullAndEmptyArrays: true } },
  { $match: { fecha_inscripcion: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) } } },
  { $group: { _id: "$sede.nombre", ingreso_total: { $sum: "$curso.costo" } } },
  { $sort: { ingreso_total: -1 } }
]) // ✅ Fin pipeline

/// ¿QUÉ PROFESOR TIENE MÁS ESTUDIANTES INSCRITOS? 👨‍🏫
db.inscripciones.aggregate([
  { $lookup: { from: "cursos", localField: "curso_id", foreignField: "_id", as: "curso" } },
  { $unwind: { path: "$curso", preserveNullAndEmptyArrays: true } },
  { $group: { _id: "$curso.profesor_id", total_estudiantes: { $sum: 1 } } },
  { $lookup: { from: "profesores", localField: "_id", foreignField: "_id", as: "profesor" } },
  { $unwind: { path: "$profesor", preserveNullAndEmptyArrays: true } },
  { $project: { _id: 0, nombre: "$profesor.nombre", apellido: "$profesor.apellido", total_estudiantes: 1 } },
  { $sort: { total_estudiantes: -1 } },
  { $limit: 1 }
]) // ✅ Fin pipeline

/// ¿QUÉ INSTRUMENTO ES EL MÁS RESERVADO? 🥁🎹🎸
db.reservas_instrumentos.aggregate([
  { $group: { _id: "$instrumento_id", total_reservas: { $sum: 1 } } },
  { $lookup: { from: "instrumentos", localField: "_id", foreignField: "_id", as: "instrumento" } },
  { $unwind: { path: "$instrumento", preserveNullAndEmptyArrays: true } },
  { $project: { nombre: "$instrumento.nombre", tipo: "$instrumento.tipo", total_reservas: 1 } },
  { $sort: { total_reservas: -1 } },
  { $limit: 1 }
]) // ✅ Fin pipeline

/// MOSTRAR TODOS LOS CURSOS EN LOS QUE UN ESTUDIANTE ESTÁ INSCRITO 🎓
(function () {
  const cedulaEstudiante = "1122334455"; // 🆔 Cambia si quieres otro
  const est = db.estudiantes.findOne({ cedula: cedulaEstudiante });
  if (!est) { print("❌ Estudiante no encontrado"); return; }
  db.inscripciones.aggregate([
    { $match: { estudiante_id: est._id } },
    { $lookup: { from: "cursos", localField: "curso_id", foreignField: "_id", as: "curso" } },
    { $unwind: { path: "$curso", preserveNullAndEmptyArrays: true } },
    { $lookup: { from: "profesores", localField: "curso.profesor_id", foreignField: "_id", as: "profesor" } },
    { $unwind: { path: "$profesor", preserveNullAndEmptyArrays: true } },
    { $lookup: { from: "sedes", localField: "curso.sede_id", foreignField: "_id", as: "sede" } },
    { $unwind: { path: "$sede", preserveNullAndEmptyArrays: true } },
    { $project: { _id: 0, fecha_inscripcion: 1, curso: "$curso.nombre", profesor: { $concat: ["$profesor.nombre", " ", "$profesor.apellido"] }, sede: "$sede.nombre", nivel: "$curso.nivel", costo: "$curso.costo" } },
    { $sort: { fecha_inscripcion: -1 } }
  ]).forEach(doc => printjson(doc))
})();

/// LISTAR TODOS LOS CURSOS ACTIVOS EN UNA SEDE ESPECÍFICA 📚
(function () {
  const sedeObjetivo = "Campus Norte";
  const hoy = new Date();
  const sede = db.sedes.findOne({ nombre: sedeObjetivo });
  if (!sede) { print("❌ Sede no encontrada"); return; }
  db.cursos.aggregate([
    { $match: { sede_id: sede._id, fecha_inicio: { $lte: hoy }, fecha_fin: { $gte: hoy } } },
    { $lookup: { from: "profesores", localField: "profesor_id", foreignField: "_id", as: "prof" } },
    { $unwind: { path: "$prof", preserveNullAndEmptyArrays: true } },
    { $project: { _id: 0, curso: "$nombre", sede: sedeObjetivo, profesor: { $concat: ["$prof.nombre", " ", "$prof.apellido"] }, fecha_inicio: 1, fecha_fin: 1 } },
    { $sort: { curso: 1 } }
  ]).forEach(doc => printjson(doc))
})();

/// DETECTAR CURSOS QUE ESTÁN A PUNTO DE ALCANZAR SU CUPO ⚠️
db.inscripciones.aggregate([
  { $group: { _id: "$curso_id", total_inscritos: { $sum: 1 } } },
  { $lookup: { from: "cursos", localField: "_id", foreignField: "_id", as: "curso" } },
  { $unwind: { path: "$curso", preserveNullAndEmptyArrays: true } },
  { $addFields: { porcentaje_ocupado: { $divide: ["$total_inscritos", "$curso.cupo_maximo"] } } },
  { $match: { porcentaje_ocupado: { $gte: 0.9 } } },
  { $project: { _id: 0, curso: "$curso.nombre", total_inscritos: 1, cupo_maximo: "$curso.cupo_maximo", porcentaje_ocupado: 1 } },
  { $sort: { porcentaje_ocupado: -1 } }
]) // ✅ Fin pipeline
