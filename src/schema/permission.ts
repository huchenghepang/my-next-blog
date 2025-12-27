import z from "zod";

export const addPermissionSchema = z.object({
  permissionName: z.string(),
  description: z.string(),
  type: z.enum(["route", "button"]),
  parentId: z.number(),
  permissionValue: z.string(),
});

export const deletePermissionSchema = z.object({
  permissionId: z.number(),
});

export const updatePermissionSchema = addPermissionSchema.partial();
export type AddPermissionSchema = z.infer<typeof addPermissionSchema>;
export type DeletePermissionSchema = z.infer<typeof deletePermissionSchema>;
export type UpdatePermissionSchema = z.infer<typeof updatePermissionSchema>;
