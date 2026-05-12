import { prisma } from "../config/prisma.js";
import { writeAuditLog } from "../services/auditService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPagination, paginationMeta } from "../utils/pagination.js";
import { ok } from "../utils/response.js";
import { clientUserSelect, serializeUser } from "../utils/serializers.js";

export const listUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip, take } = getPagination(req.validated.query);
  const { search, role, status } = req.validated.query;
  const where = {
    ...(status && { status }),
    ...(role && { role: { slug: role } }),
    ...(search && {
      OR: [
        { name: { contains: search } },
        { email: { contains: search } }
      ]
    })
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({ where, select: clientUserSelect(), skip, take, orderBy: { createdAt: "desc" } }),
    prisma.user.count({ where })
  ]);

  ok(res, { users: users.map(serializeUser) }, paginationMeta(total, page, limit));
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const role = await prisma.role.findUnique({ where: { slug: req.validated.body.roleSlug } });
  const user = await prisma.user.update({
    where: { id: req.validated.params.id },
    data: {
      roleId: role.id,
      status: req.validated.body.status
    },
    include: { role: true, lawyerProfile: true }
  });

  await writeAuditLog({ req, userId: req.user.id, action: "UPDATE_USER_ROLE", entity: "User", entityId: user.id, metadata: { roleSlug: role.slug } });
  ok(res, { user: serializeUser(user) });
});
