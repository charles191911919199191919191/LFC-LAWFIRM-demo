import { prisma } from "../config/prisma.js";
import { writeAuditLog } from "../services/auditService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";
import { created } from "../utils/response.js";

export const uploadDocuments = asyncHandler(async (req, res) => {
  const appointmentId = req.params.appointmentId;
  const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
  if (!appointment) throw new HttpError(404, "Appointment not found");

  const role = req.user.role.slug;
  const allowed =
    ["admin", "staff"].includes(role) ||
    (role === "client" && appointment.clientId === req.user.id) ||
    (role === "lawyer" && appointment.lawyerId === req.user.lawyerProfile?.id);

  if (!allowed) throw new HttpError(403, "You do not have permission to upload documents for this appointment");

  const documents = await Promise.all(
    (req.files || []).map((file) =>
      prisma.document.create({
        data: {
          appointmentId,
          uploadedById: req.user.id,
          fileName: file.originalname,
          filePath: file.path,
          mimeType: file.mimetype,
          size: file.size
        }
      })
    )
  );

  await writeAuditLog({ req, userId: req.user.id, action: "UPLOAD_DOCUMENTS", entity: "Appointment", entityId: appointmentId, metadata: { count: documents.length } });
  created(res, { documents });
});
