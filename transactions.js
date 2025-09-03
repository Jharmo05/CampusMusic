// 📦 Este script realiza una inscripción a un curso de manera segura usando transacciones.

// 🎬 Iniciar una sesión para la transacción
const session = db.getMongo().startSession();

try {
  // 🚀 Iniciar la transacción
  session.startTransaction();

  // ============================================
  // 🔁 DATOS DE ENTRADA
  // ============================================
  const estudianteId = ObjectId("REEMPLAZAR_CON_ID_ESTUDIANTE"); // 👤 ID del estudiante que se va a inscribir
  const cursoId = ObjectId("REEMPLAZAR_CON_ID_CURSO"); // 📚 ID del curso deseado

  // ============================================
  // ✅ PASO 1: Verificar que el curso tenga cupo
  // ============================================
  const curso = db.cursos.findOne({ _id: cursoId }, { session }); // 🔍 Buscamos el curso dentro de la transacción

  if (!curso) {
    throw new Error("Curso no encontrado."); // ❌ Si el curso no existe, lanzamos un error
  }

  if (!curso.cupo_disponible || curso.cupo_disponible <= 0) {
    throw new Error("No hay cupos disponibles."); // ❌ Si no hay espacio, ¡error!
  }

  // ============================================
  // ✅ PASO 2: Insertar inscripción
  // ============================================
  db.inscripciones.insertOne({
    estudiante_id: estudianteId,
    curso_id: cursoId,
    fecha_inscripcion: new Date(),
    estado: "activa"
  }, { session }); // 📝 Insertamos la inscripción, pero solo temporalmente en la sesión

  // ============================================
  // ✅ PASO 3: Decrementar cupo del curso
  // ============================================
  db.cursos.updateOne(
    { _id: cursoId },
    { $inc: { cupo_disponible: -1 } }, // ⬇️ Restamos 1 al cupo disponible
    { session } // 🔄 Esta actualización también es parte de la transacción
  );

  // ============================================
  // 🟢 COMMIT: Confirmar la transacción
  // ============================================
  session.commitTransaction(); // 💾 ¡Todo salió bien! Guardamos los cambios de forma permanente
  print("✅ Transacción completada exitosamente.");

} catch (error) {
  // ============================================
  // 🔴 ERROR: Revertir cambios si algo falla
  // ============================================
  print("❌ Error en la transacción: " + error.message);
  session.abortTransaction(); // 🔙 ¡Algo falló! Deshacemos todos los cambios
} finally {
  // 🚪 Cerrar la sesión
  session.endSession();
}