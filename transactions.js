use campusMusic // 🎶 Nos aseguramos de usar la DB correcta

// 📦 Transacción de inscripción segura con fallback si no hay réplica
(function () { // 🧠 Encapsulamos en una función IIFE para no ensuciar el ámbito global
  const estudianteCedula = "1122334455"; // 🆔 Cédula del estudiante a inscribir (puedes cambiarla)
  const cursoNombre = "Violín Básico"; // 📚 Curso objetivo (puedes cambiarlo)

  // 🔍 Buscamos documentos necesarios
  const estudiante = db.estudiantes.findOne({ cedula: estudianteCedula }); // 🎓 Encontrar estudiante
  const curso = db.cursos.findOne({ nombre: cursoNombre }); // 📚 Encontrar curso

  if (!estudiante) { print("❌ Estudiante no encontrado."); return; } // 🛑 Validación
  if (!curso) { print("❌ Curso no encontrado."); return; } // 🛑 Validación

  // 🧪 Función que ejecuta la inscripción (con o sin transacción)
  function ejecutarInscripcion(session) { // 🧩 session puede ser null para modo sin transacción
    const opts = session ? { session } : {}; // ⚙️ Opciones según modo
    const inscritos = db.inscripciones.countDocuments({ curso_id: curso._id }, opts); // 📊 Conteo actual
    if (inscritos >= curso.cupo_maximo) { throw new Error("No hay cupos disponibles."); } // 🚫 Sin cupos
    // 📝 Intentamos insertar (el índice único evitará duplicados del mismo estudiante/curso)
    db.inscripciones.insertOne({
      estudiante_id: estudiante._id,
      curso_id: curso._id,
      fecha_inscripcion: new Date(),
      estado: "activa"
    }, opts); // ✅ Insert realizado
  }

  // 🚦 Intentamos con transacción
  let session = null; // 🪑 Variable para la sesión
  try {
    session = db.getMongo().startSession(); // 🎬 Iniciamos sesión
    session.startTransaction(); // 🚀 Iniciamos transacción
    ejecutarInscripcion(session); // 🧩 Ejecutamos lógica
    session.commitTransaction(); // 💾 Confirmamos
    print("✅ Transacción completada exitosamente."); // 🎉 Éxito
  } catch (e) {
    // 🔄 Fallback si no estamos en réplica o si hubo error
    if (String(e).includes("Transaction numbers are only allowed on a replica set member") ||
        String(e).includes("NotWritablePrimary") ||
        String(e).includes("ReplicaSetNoPrimary")) {
      print("⚠️ Transacciones no soportadas en este entorno. Intentando modo sin transacción…"); // 🛠️ Aviso
      try {
        ejecutarInscripcion(null); // 🔁 Modo simple
        print("✅ Inscripción realizada sin transacción."); // 🎉 Éxito
      } catch (inner) {
        print("❌ Error al inscribir sin transacción: " + inner.message); // ⚠️ Error
      }
    } else {
      print("❌ Error en transacción: " + e.message); // ⚠️ Error diferente
      try { session && session.abortTransaction(); } catch (__) {} // 🧹 Intentamos abortar
    }
  } finally {
    try { session && session.endSession(); } catch (__) {} // 🚪 Cerramos sesión
  }
})(); // 🏁 Fin IIFE
