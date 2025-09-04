use campusMusic // 🎶 Asegúrate de estar en la DB correcta

// 🎯 AGREGACIÓN 1: Estudiantes por sede en el último mes
print("📊 1. ESTUDIANTES INSCRITOS POR SEDE (ÚLTIMO MES)");
db.inscripciones.aggregate([
  { 
    $match: { // ⏳ Filtramos por fecha reciente
      fecha_inscripcion: { 
        $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) 
      }
    }
  },
  {
    $lookup: { // 🤝 Unimos con cursos
      from: "cursos",
      localField: "curso_id",
      foreignField: "_id",
      as: "curso"
    }
  },
  { $unwind: { path: "$curso", preserveNullAndEmptyArrays: true } },
  {
    $lookup: { // 🤝 Unimos con sedes
      from: "sedes",
      localField: "curso.sede_id",
      foreignField: "_id",
      as: "sede"
    }
  },
  { $unwind: { path: "$sede", preserveNullAndEmptyArrays: true } },
  { $match: { sede: { $ne: null } } },
  {
    $group: { // 📦 Agrupamos por sede
      _id: "$sede.nombre",
      total_estudiantes: { $sum: 1 }
    }
  },
  { $sort: { total_estudiantes: -1 } } // 📉 Orden descendente
]).forEach(doc => printjson(doc))

// 🎯 AGREGACIÓN 2: Cursos más populares por sede
print("\n🎯 2. CURSOS MÁS POPULARES POR SEDE");
db.inscripciones.aggregate([
  {
    $lookup: { // 🤝 Unimos con cursos
      from: "cursos",
      localField: "curso_id",
      foreignField: "_id",
      as: "curso"
    }
  },
  { $unwind: { path: "$curso", preserveNullAndEmptyArrays: true } },
  {
    $lookup: { // 🤝 Unimos con sedes
      from: "sedes",
      localField: "curso.sede_id",
      foreignField: "_id",
      as: "sede"
    }
  },
  { $unwind: { path: "$sede", preserveNullAndEmptyArrays: true } },
  {
    $group: { // 📦 Agrupamos por sede y curso
      _id: { sede: "$sede.nombre", curso: "$curso.nombre" },
      total_inscripciones: { $sum: 1 }
    }
  },
  { // 📊 Ordenamos por sede y popularidad
    $sort: { "_id.sede": 1, total_inscripciones: -1 }
  }
]).forEach(doc => printjson(doc))

// 🎯 AGREGACIÓN 3: Ingreso total por sede
print("\n💰 3. INGRESO TOTAL POR SEDE");
db.inscripciones.aggregate([
  {
    $lookup: { // 🤝 Unimos con cursos
      from: "cursos",
      localField: "curso_id",
      foreignField: "_id",
      as: "curso"
    }
  },
  { $unwind: { path: "$curso", preserveNullAndEmptyArrays: true } },
  {
    $lookup: { // 🤝 Unimos con sedes
      from: "sedes",
      localField: "curso.sede_id",
      foreignField: "_id",
      as: "sede"
    }
  },
  { $unwind: { path: "$sede", preserveNullAndEmptyArrays: true } },
  {
    $group: { // 📦 Agrupamos por sede y sumamos ingresos
      _id: "$sede.nombre",
      ingreso_total: { $sum: "$curso.costo" }
    }
  },
  { $sort: { ingreso_total: -1 } } // 📉 Orden por ingresos
]).forEach(doc => printjson(doc))

// 🎯 AGREGACIÓN 4: Profesor con más estudiantes
print("\n👨‍🏫 4. PROFESOR CON MÁS ESTUDIANTES");
db.inscripciones.aggregate([
  {
    $lookup: { // 🤝 Unimos con cursos
      from: "cursos",
      localField: "curso_id",
      foreignField: "_id",
      as: "curso"
    }
  },
  { $unwind: { path: "$curso", preserveNullAndEmptyArrays: true } },
  {
    $group: { // 📦 Agrupamos por profesor
      _id: "$curso.profesor_id",
      total_estudiantes: { $sum: 1 }
    }
  },
  {
    $lookup: { // 🤝 Unimos con profesores
      from: "profesores",
      localField: "_id",
      foreignField: "_id",
      as: "profesor"
    }
  },
  { $unwind: { path: "$profesor", preserveNullAndEmptyArrays: true } },
  { // ✍️ Proyectamos datos amigables
    $project: { 
      _id: 0, 
      nombre: "$profesor.nombre", 
      apellido: "$profesor.apellido", 
      total_estudiantes: 1 
    }
  },
  { $sort: { total_estudiantes: -1 } }, // 📉 Orden descendente
  { $limit: 1 } // 🏆 Top 1
]).forEach(doc => printjson(doc))

// 🎯 AGREGACIÓN 5: Instrumento más reservado
print("\n🥁 5. INSTRUMENTO MÁS RESERVADO");
db.reservas_instrumentos.aggregate([
  {
    $group: { // 📦 Agrupamos por instrumento
      _id: "$instrumento_id",
      total_reservas: { $sum: 1 }
    }
  },
  {
    $lookup: { // 🤝 Unimos con instrumentos
      from: "instrumentos",
      localField: "_id",
      foreignField: "_id",
      as: "instrumento"
    }
  },
  { $unwind: { path: "$instrumento", preserveNullAndEmptyArrays: true } },
  { // ✍️ Proyectamos datos claros
    $project: { 
      nombre: "$instrumento.nombre", 
      tipo: "$instrumento.tipo", 
      total_reservas: 1 
    }
  },
  { $sort: { total_reservas: -1 } }, // 📉 Orden descendente
  { $limit: 1 } // 🏆 Top 1
]).forEach(doc => printjson(doc))

// 🎯 AGREGACIÓN 6: Cursos de un estudiante específico
print("\n🎓 6. CURSOS DE UN ESTUDIANTE ESPECÍFICO");
(function () {
  const cedulaEstudiante = "1122334455"; // 🆔 Cédula de Daniela
  const est = db.estudiantes.findOne({ cedula: cedulaEstudiante });
  if (!est) { print("❌ Estudiante no encontrado"); return; }
  
  db.inscripciones.aggregate([
    { $match: { estudiante_id: est._id } }, // 🔍 Filtramos por estudiante
    { 
      $lookup: { // 🤝 Unimos con cursos
        from: "cursos",
        localField: "curso_id",
        foreignField: "_id",
        as: "curso"
      }
    },
    { $unwind: { path: "$curso", preserveNullAndEmptyArrays: true } },
    { 
      $lookup: { // 🤝 Unimos con profesores
        from: "profesores",
        localField: "curso.profesor_id",
        foreignField: "_id",
        as: "profesor"
      }
    },
    { $unwind: { path: "$profesor", preserveNullAndEmptyArrays: true } },
    { 
      $lookup: { // 🤝 Unimos con sedes
        from: "sedes",
        localField: "curso.sede_id",
        foreignField: "_id",
        as: "sede"
      }
    },
    { $unwind: { path: "$sede", preserveNullAndEmptyArrays: true } },
    { // ✍️ Proyectamos datos bonitos
      $project: {
        _id: 0,
        fecha_inscripcion: 1,
        curso: "$curso.nombre",
        profesor: { $concat: ["$profesor.nombre", " ", "$profesor.apellido"] }, // Fixed this line
        sede: "$sede.nombre",
        costo: "$curso.costo",
        nivel: "$curso.nivel"
      }
    }
  ]).forEach(doc => printjson(doc))
})(); // 🏁 Fin de la función anónima y ejecución