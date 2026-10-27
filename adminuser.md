# Assign an Administrator persona to a user

The backend grants administrator access through the `admin` persona in `personas`, assigned to a user through `user_personas`. This SQL is safe to rerun: it keeps existing persona assignments and does nothing if the administrator assignment already exists.

Run it against the application's PostgreSQL database after the target user and the `admin` persona exist. Replace the example email with the intended user's email, and only grant this access to an authorized account.

```sql
BEGIN;

DO $$
DECLARE
    target_user_id text;
    admin_persona_id text;
BEGIN
    SELECT id INTO target_user_id
    FROM "user"
    WHERE email = 'demo@localhost.test';

    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'Target user does not exist';
    END IF;

    SELECT id INTO admin_persona_id
    FROM personas
    WHERE code = 'admin';

    IF admin_persona_id IS NULL THEN
        RAISE EXCEPTION 'Administrator persona does not exist';
    END IF;

    INSERT INTO user_personas (user_id, persona_id)
    VALUES (target_user_id, admin_persona_id)
    ON CONFLICT (user_id, persona_id) DO NOTHING;
END;
$$;

COMMIT;
```

## Verify the assignment

```sql
SELECT u.email, p.code, p.name
FROM "user" u
JOIN user_personas up ON up.user_id = u.id
JOIN personas p ON p.id = up.persona_id
WHERE u.email = 'demo@localhost.test'
  AND p.code = 'admin';
```

## Notes

- The schema uses text IDs, and `user_personas` has a composite primary key on `(user_id, persona_id)`, which supports the `ON CONFLICT` clause above.
- Run this only after the user and administrator persona have been created (the persona code is `admin`).
- Direct SQL bypasses application-level authorization cache invalidation. Cached authorization data may remain stale for up to 60 seconds; wait for expiry or use the application's RBAC management flow if immediate cache refresh is needed.
- This grants the permissions configured for the `admin` persona; it does not automatically grant every permission. The `rbac_manager` persona is separate.
