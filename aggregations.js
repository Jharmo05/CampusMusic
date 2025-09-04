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

print("\n🎯 2. CURSOS MÁS POPULARES POR SEDE");
// ... (el resto del código se mantiene similar pero con comentarios creativos)