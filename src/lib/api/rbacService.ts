import { z } from "zod";
import { apiRequest } from "./api";

const userSchema = z
  .object({
    id: z.string(),
    fullName: z
      .string()
      .nullish()
      .transform((value) => value ?? ""),
    displayName: z
      .string()
      .nullish()
      .transform((value) => value ?? ""),
    email: z.string(),
  })
  .passthrough();
const optionSchema = z
  .object({ id: z.string(), name: z.string() })
  .passthrough();
const catalogSchema = z.object({
  users: z.array(userSchema),
  resources: z.array(optionSchema),
  actions: z.array(optionSchema),
});
const rbacSchema = z
  .object({
    userId: z.string(),
    personas: z.array(
      z
        .object({
          id: z.string(),
          roles: z.array(
            z
              .object({
                id: z.string(),
                permissions: z.array(
                  z
                    .object({
                      code: z.string(),
                      resource: z.string(),
                      action: z.string(),
                    })
                    .passthrough(),
                ),
              })
              .passthrough(),
          ),
        })
        .passthrough(),
    ),
    permissions: z.array(
      z
        .object({
          resource: z.string(),
          actions: z.array(z.string()),
        })
        .passthrough(),
    ),
  })
  .passthrough();
const browseSchema = z
  .object({
    filter: z.object({
      resource: z.string().nullable(),
      action: z.string().nullable(),
    }),
    matchCount: z.number().int().nonnegative(),
    users: z.array(userSchema.extend({ permissions: z.array(z.string()) })),
  })
  .passthrough();

export type RbacCatalog = z.infer<typeof catalogSchema>;
export type RbacData = z.infer<typeof rbacSchema>;
export type BrowseResult = z.infer<typeof browseSchema>;

async function requestValidated<T>(
  path: string,
  schema: z.ZodType<T, z.ZodTypeDef, unknown>,
): Promise<T> {
  // Authorization data must not be reused after user assignments change.
  const payload = await apiRequest<unknown>(path, { cache: "no-store" });
  const result = schema.safeParse(payload);
  if (!result.success) {
    throw new Error(`The RBAC API returned an invalid response for ${path}.`);
  }
  return result.data;
}

export function getRbacCatalog() {
  // The catalog includes all users, including those with no assigned permissions.
  return requestValidated("/rbac/admin/catalog", catalogSchema);
}

export function getMyRbac() {
  return requestValidated("/rbac/me", rbacSchema);
}

export function getUserRbac(userId: string) {
  return requestValidated(
    `/rbac/admin/users/${encodeURIComponent(userId)}/rbac`,
    rbacSchema,
  );
}

export function getUsersByPermission(resource: string, action: string) {
  const params = new URLSearchParams();
  if (resource) params.set("resource", resource);
  if (action) params.set("action", action);
  const query = params.toString();
  return requestValidated(
    `/rbac/admin/rbac/users${query ? `?${query}` : ""}`,
    browseSchema,
  );
}
