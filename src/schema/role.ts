import z from "zod";

export const addRoleSchema = z.object({
  roleName: z.string(),
  description: z.string(),
});

export const updateRoleSchema = z.object({
  roleName: z.string(),
  description: z.string(),
  roleId: z.number(),
});

export const deleteRoleSchema = z.object({
  roleId: z.number(),
});

export const assignRolePermissionsSchema = z.object({
  roleId: z.number(),
  permissionIds: z.array(z.number()).refine((arr) => arr.length > 0, {
    message: "至少需要一个权限ID",
  }),
});
