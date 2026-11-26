/**
 * Membership expiration values are backed by PostgreSQL DATE columns. They
 * remain valid through the named calendar day, rather than expiring at midnight
 * at its start.
 */
export function isMembershipDateExpired(
  expiration: string | Date | null | undefined,
  now: Date = new Date(),
): boolean {
  if (!expiration) return false;

  const value =
    expiration instanceof Date ? expiration.toISOString() : expiration;
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const midnightDateTime = /^(\d{4})-(\d{2})-(\d{2})T00:00:00(?:\.000)?Z$/.exec(
    value,
  );
  const dateParts = dateOnly ?? midnightDateTime;

  if (dateParts) {
    const expiresAt = Date.UTC(
      Number(dateParts[1]),
      Number(dateParts[2]) - 1,
      Number(dateParts[3]) + 1,
    );
    return expiresAt <= now.getTime();
  }

  const expiresAt = new Date(value).getTime();
  return !Number.isNaN(expiresAt) && expiresAt < now.getTime();
}

export function isMembershipRestricted(
  membership:
    | { status?: string | null; nextRenewalAt?: string | Date | null }
    | null
    | undefined,
): boolean {
  return (
    !membership ||
    membership.status?.trim().toLowerCase() !== "active" ||
    isMembershipDateExpired(membership.nextRenewalAt)
  );
}
