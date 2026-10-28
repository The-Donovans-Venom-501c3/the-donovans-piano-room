import { z } from "zod";

const authorizationSchema = z.object({
  userId: z.string().min(1),
  personas: z.array(z.object({ code: z.string() }).passthrough()),
});

// Match the stable persona code, never its display name or a browser-stored flag.
export function hasAdministratorPersona(payload: unknown): boolean {
  const result = authorizationSchema.safeParse(payload);
  return (
    result.success &&
    result.data.personas.some((persona) => persona.code === "admin")
  );
}
