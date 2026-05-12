import { prisma } from "../config/prisma.js";

export async function createNotification({ userId, title, message, type = "SYSTEM", actionUrl, metadata }) {
  if (!userId) return null;
  return prisma.notification.create({
    data: {
      userId,
      title,
      message,
      type,
      actionUrl,
      metadata
    }
  });
}

export async function simulateEmail({ to, subject, body }) {
  console.info("[email-simulation]", { to, subject, body });
  return { to, subject, queued: true };
}

export async function notifyAppointmentChange({ appointment, actor, title, message }) {
  const targets = [appointment.clientId, appointment.lawyer?.userId, appointment.assignedById].filter(Boolean);
  const uniqueTargets = [...new Set(targets)];
  await Promise.all(
    uniqueTargets.map((userId) =>
      createNotification({
        userId,
        title,
        message,
        type: "APPOINTMENT",
        actionUrl: `/appointments?id=${appointment.id}`,
        metadata: { appointmentId: appointment.id, actorId: actor?.id }
      })
    )
  );
}
