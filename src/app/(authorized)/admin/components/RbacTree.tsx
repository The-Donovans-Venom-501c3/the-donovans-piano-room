import type { RbacData } from "@/lib/api/rbacService";

function nodeLabel(node: { id: string; name?: unknown; code?: unknown }) {
  if (typeof node.name === "string" && node.name.trim()) return node.name;
  if (typeof node.code === "string" && node.code.trim()) return node.code;
  return node.id;
}

const branchClass = "ml-2 space-y-3 border-l-2 border-purple-200 pl-4 sm:ml-4 sm:pl-6";
const summaryClass = "cursor-pointer rounded-lg px-2 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-600 hover:bg-purple-50";
const countClass = "ml-2 text-sm font-normal text-gray-600";

export default function RbacTree({ data, userName }: { data: RbacData; userName: string }) {
  return (
    <div className="space-y-6 p-4 text-gray-800 sm:p-6" aria-label={`Authorization tree for ${userName}`}>
      <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
        <h3 className="break-words text-lg font-semibold text-purple-900">{userName}</h3>
        <p className="break-all text-sm text-gray-600">User ID: {data.userId}</p>
        <p className="mt-2 text-sm text-gray-600">Expand or collapse a persona or role to explore inherited permissions.</p>
      </div>

      <section aria-label="Assigned personas and roles">
        <h3 className="mb-3 font-semibold">Personas → Roles → Permissions</h3>
        {data.personas.length === 0 ? (
          <p className="text-sm text-gray-600">No personas assigned to this user.</p>
        ) : (
          <ul className={branchClass}>
            {data.personas.map((persona) => (
              <li key={persona.id}>
                <details open>
                  <summary className={summaryClass}>
                    <span className="break-words font-semibold">{nodeLabel(persona)}</span>
                    <span className={countClass}>Persona · {persona.roles.length} roles</span>
                  </summary>
                  <div className="mt-2">
                    {persona.roles.length === 0 ? (
                      <p className="pl-6 text-sm text-gray-600">No roles assigned.</p>
                    ) : (
                      <ul className={branchClass}>
                        {persona.roles.map((role) => (
                          <li key={role.id}>
                            <details open>
                              <summary className={summaryClass}>
                                <span className="break-words font-medium">{nodeLabel(role)}</span>
                                <span className={countClass}>Role · {role.permissions.length} permissions</span>
                              </summary>
                              {role.permissions.length === 0 ? (
                                <p className="py-2 pl-6 text-sm text-gray-600">No permissions assigned.</p>
                              ) : (
                                <ul className={`${branchClass} mt-2`}>
                                  {role.permissions.map((permission) => (
                                    <li key={permission.code} className="rounded-lg border border-purple-100 bg-white p-3">
                                      <div className="break-all font-mono text-sm text-purple-900">{permission.code}</div>
                                      <div className="mt-1 break-words text-sm text-gray-600">
                                        Resource: {permission.resource} · Action: {permission.action}
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </details>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </details>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-label="Effective permissions by resource">
        <h3 className="mb-3 font-semibold">Effective permissions</h3>
        <p className="mb-3 text-sm text-gray-600">Combined access across all assigned personas and roles.</p>
        {data.permissions.length === 0 ? (
          <p className="text-sm text-gray-600">No effective permissions.</p>
        ) : (
          <ul className={branchClass}>
            {data.permissions.map((permission) => (
              <li key={permission.resource}>
                <details open>
                  <summary className={summaryClass}>
                    <span className="break-words font-medium">{permission.resource}</span>
                    <span className={countClass}>{permission.actions.length} actions</span>
                  </summary>
                  {permission.actions.length === 0 ? (
                    <p className="py-2 pl-6 text-sm text-gray-600">No actions granted.</p>
                  ) : (
                    <ul className={`${branchClass} mt-2`}>
                      {permission.actions.map((action) => (
                        <li key={action} className="break-words text-sm">{action}</li>
                      ))}
                    </ul>
                  )}
                </details>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}