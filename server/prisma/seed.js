import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const passwordHash = await bcrypt.hash("Password123!", 12);

async function main() {
  const roles = await Promise.all(
    [
      ["client", "Client", "Public end user who submits appointment inquiries."],
      ["lawyer", "Lawyer", "Legal professional managing schedules and appointments."],
      ["staff", "Staff Member", "Operations user handling appointments and assignments."],
      ["admin", "Administrator", "Full system administrator."]
    ].map(([slug, name, description]) =>
      prisma.role.upsert({
        where: { slug },
        update: { name, description },
        create: { slug, name, description }
      })
    )
  );

  const roleBySlug = Object.fromEntries(roles.map((role) => [role.slug, role]));

  const admin = await prisma.user.upsert({
    where: { email: "admin@lfcfirm.com" },
    update: {},
    create: {
      name: "Admin Operations",
      email: "admin@lfcfirm.com",
      phone: "+63 2 8123 4500",
      passwordHash,
      roleId: roleBySlug.admin.id
    }
  });

  const staff = await prisma.user.upsert({
    where: { email: "staff@lfcfirm.com" },
    update: {},
    create: {
      name: "Nora Valdez",
      email: "staff@lfcfirm.com",
      phone: "+63 2 8123 4501",
      passwordHash,
      roleId: roleBySlug.staff.id
    }
  });

  const client = await prisma.user.upsert({
    where: { email: "client@demo.com" },
    update: {},
    create: {
      name: "Mina Santos",
      email: "client@demo.com",
      phone: "+63 917 555 0181",
      passwordHash,
      roleId: roleBySlug.client.id
    }
  });

  const lawyerUsers = await Promise.all(
    [
      ["Atty. Elena Rivera", "attorney.rivera@lfcfirm.com", "Corporate Litigation", "IBP-2026-1001", 14, 4200],
      ["Atty. Marcus Chen", "attorney.chen@lfcfirm.com", "Real Estate & Field Claims", "IBP-2026-1002", 11, 3800],
      ["Atty. Sofia Bennett", "attorney.bennett@lfcfirm.com", "Family & Civil Mediation", "IBP-2026-1003", 9, 3500]
    ].map(async ([name, email, specialization, barNumber, yearsExperience, hourlyRate]) => {
      const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          name,
          email,
          passwordHash,
          roleId: roleBySlug.lawyer.id
        }
      });
      const lawyer = await prisma.lawyer.upsert({
        where: { userId: user.id },
        update: { specialization, barNumber, yearsExperience, hourlyRate },
        create: {
          userId: user.id,
          specialization,
          barNumber,
          yearsExperience,
          hourlyRate,
          maxDailyConsultations: 8,
          bio: `${name} focuses on ${specialization.toLowerCase()} with a practical, client-centered consultation style.`
        }
      });
      return { user, lawyer };
    })
  );

  for (const { lawyer } of lawyerUsers) {
    for (const dayOfWeek of [1, 2, 3, 4, 5]) {
      await prisma.schedule.upsert({
        where: {
          lawyerId_dayOfWeek_startTime: {
            lawyerId: lawyer.id,
            dayOfWeek,
            startTime: "09:00"
          }
        },
        update: {},
        create: {
          lawyerId: lawyer.id,
          dayOfWeek,
          startTime: "09:00",
          endTime: "17:00",
          maxAppointments: 8
        }
      });
    }

    await prisma.availability.deleteMany({ where: { lawyerId: lawyer.id } });
    await prisma.availability.createMany({
      data: [
        {
          lawyerId: lawyer.id,
          type: "AVAILABLE",
          startsAt: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2, 9, 0),
          endsAt: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2, 17, 0),
          reason: "Standard consultation window",
          maxAppointments: 8
        },
        {
          lawyerId: lawyer.id,
          type: "UNAVAILABLE",
          startsAt: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3, 12, 0),
          endsAt: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3, 13, 30),
          reason: "Internal legal review"
        }
      ]
    });
  }

  const primaryLawyer = lawyerUsers[0].lawyer;
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9, 0);
  const tomorrowEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 10, 0);

  await prisma.appointment.upsert({
    where: { id: "apt_seed_001" },
    update: {},
    create: {
      id: "apt_seed_001",
      clientId: client.id,
      lawyerId: primaryLawyer.id,
      assignedById: staff.id,
      consultationType: "Emergency consultation",
      subject: "Urgent filing review",
      description: "Client needs review for a court filing deadline.",
      priority: "HIGH",
      status: "APPROVED",
      preferredStart: tomorrow,
      preferredEnd: tomorrowEnd,
      scheduledStart: tomorrow,
      scheduledEnd: tomorrowEnd,
      conflictStatus: "CLEAR",
      history: {
        create: [
          { actorId: client.id, action: "INQUIRY_CREATED", note: "Client submitted urgent filing request." },
          { actorId: staff.id, action: "STATUS_APPROVED", note: "Staff verified schedule and assigned counsel." }
        ]
      }
    }
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: client.id,
        title: "Appointment approved",
        message: "Your emergency consultation has been approved.",
        type: "APPOINTMENT",
        actionUrl: "/appointments?id=apt_seed_001"
      },
      {
        userId: staff.id,
        title: "Conflict scan completed",
        message: "No double booking detected for APT-SEED-001.",
        type: "CONFLICT"
      }
    ],
    skipDuplicates: true
  });

  await prisma.systemSetting.upsert({
    where: { key: "defaultSessionHours" },
    update: { value: 8, updatedById: admin.id },
    create: { key: "defaultSessionHours", value: 8, updatedById: admin.id }
  });

  await prisma.analyticsSnapshot.createMany({
    data: [
      { metric: "appointment_completion_rate", value: 92.5, dimension: { period: "month" } },
      { metric: "conflict_frequency", value: 6.2, dimension: { period: "month" } },
      { metric: "peak_consultation_hour", value: 10, dimension: { hour: "10:00" } }
    ]
  });

  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: "SEED_DATABASE",
      entity: "System",
      metadata: { seed: "initial demo data" }
    }
  });

  await prisma.activityLog.create({
    data: {
      userId: admin.id,
      action: "SEED_DATABASE",
      summary: "Initial demo data was created for deployment validation.",
      metadata: { users: 6, lawyers: lawyerUsers.length }
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed data created");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
