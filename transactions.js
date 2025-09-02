// Conectar a la base de datos campusMusic
use campusMusic

// Iniciar una sesión para la transacción
const session = db.getMongo().startSession();

try {
  // Iniciar la transacción
  session.startTransaction();

  // ============================================
  // 🔁 DATOS DE ENTRADA
  // ============================================
  const estudianteId = ObjectId("REEMPLAZAR_CON_ID_ESTUDIANTE");
  const cursoId = ObjectId("REEMPLAZAR_CON_ID_CURSO");

  // ============================================
  // ✅ PASO 1: Verificar que el curso tenga cupo
  // ============================================
  const curso = db.cursos.findOne({ _id: cursoId }, { session });

  if (!curso) {
    throw new Error("Curso no encontrado.");
  }

  if (!curso.cupo_disponible || curso.cupo_disponible <= 0) {
    throw new Error("No hay cupos disponibles.");
  }

  // ============================================
  // ✅ PASO 2: Insertar inscripción
  // ============================================
  db.inscripciones.insertOne({
    estudiante_id: estudianteId,
    curso_id: cursoId,
    fecha_inscripcion: new Date(),
    estado: "activa"
  }, { session });

  // ============================================
  // ✅ PASO 3: Decrementar cupo del curso
  // ============================================
  db.cursos.updateOne(
    { _id: cursoId },
    { $inc: { cupo_disponible: -1 } },
    { session }
  );

  // ============================================
  // 🟢 COMMIT: Confirmar la transacción
  // ============================================
  session.commitTransaction();
  print("✅ Transacción completada exitosamente.");

} catch (error) {
  // ============================================
  // 🔴 ERROR: Revertir cambios si algo falla
  // ============================================
  print("❌ Error en la transacción: " + error.message);
  session.abortTransaction();
} finally {
  // Cerrar la sesión
  session.endSession();
}
