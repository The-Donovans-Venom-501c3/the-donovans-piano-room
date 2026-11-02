const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");

const root = path.resolve(__dirname, "..");
const read = (relativePath) => readFileSync(path.join(root, relativePath), "utf8");

test("admin resource mutations require resource-specific permission checks", () => {
  const coupons = read("src/app/(authorized)/admin/components/CouponsAdmin.tsx");
  const calendar = read("src/app/(authorized)/admin/components/Calendar.tsx");
  const notifications = read("src/app/(authorized)/admin/components/NotificationsAdmin.tsx");
  const schools = read("src/app/(authorized)/admin/components/SchoolsAdmin.tsx");
  const classes = read("src/app/(authorized)/admin/components/ClassesAdmin.tsx");
  const rbacManager = read("src/app/(authorized)/admin/components/RbacManager.tsx");
  const adminPage = read("src/app/(authorized)/admin/page.tsx");

  assert.match(coupons, /apiRequest<PermissionResponse>\("\/rbac\/me\/permissions\/coupons"/);
  assert.match(coupons, /if \(!permissions\?\.delete\) return;/);
  assert.match(calendar, /apiRequest<CalendarPermissions>\("\/rbac\/me\/permissions\/calendar"/);
  assert.match(calendar, /const canCreateItem = !!permissions\?\.create && \(personalEditsOnly \|\| !!permissions\.publish\);/);
  assert.match(calendar, /if \(!permissions\?\.delete \|\| !editingEventId/);
  assert.match(calendar, /if \(!permissions\?\.delete \|\| !editingReminderId/);
  assert.match(notifications, /apiRequest<PermissionResponse>\("\/rbac\/me\/permissions\/notifications"/);
  assert.match(notifications, /if \(!permissions\?\.delete \|\| busy\) return;/);
  assert.match(rbacManager, /apiRequest<Catalog>\("\/rbac\/admin\/manager\/catalog"/);
  assert.match(adminPage, /const sections: NavItem\[\] = \[/);
  assert.doesNotMatch(adminPage, /visibleSectionIds|sectionResources|permissionsLoading/);
  for (const section of ["Calendar", "Coupons", "Notifications", "RBAC Viewer", "RBAC Manager"]) {
    assert.match(adminPage, new RegExp(`name: "${section}"`));
  }
  for (const section of ["Schools", "Classes"]) assert.match(adminPage, new RegExp(`name: "${section}"`));
  assert.match(calendar, /You don't have permission to view the admin calendar/);
  assert.match(coupons, /if \(!access\.actions\.view\)/);
  assert.match(notifications, /if \(!access\.actions\.view\)/);
  assert.match(schools, /\/rbac\/me\/permissions\/schools/);
  assert.match(schools, /if \(!access\.actions\.view\)/);
  assert.match(schools, /async function beginEdit\(school: School\)/);
  assert.match(schools, /principal: \(current\.principals \?\? \[\]\)\.map/);
  assert.match(schools, /if \(editingId\) \{[\s\S]*?assignment\.path/);
  assert.match(schools, /assignmentOptions\.map\(\(\[persona, label, allowed\]\) => allowed && <fieldset/);
  assert.match(classes, /\/rbac\/me\/permissions\/classes/);
  assert.match(classes, /if \(!access\.actions\.view\)/);
  assert.match(classes, /"students"/);
  assert.match(classes, /"teachers"/);
  assert.match(classes, /async function beginEdit\(item: ClassRecord\)/);
  assert.match(classes, /teacher: \(current\.teachers \?\? \[\]\)\.map/);
  assert.match(classes, /if \(editingId\) \{[\s\S]*?assignment\.path/);
  assert.match(classes, /\{permissions\.add_teachers && <fieldset/);
  assert.match(classes, /\{permissions\.add_students && <fieldset/);
  assert.match(coupons, /: \(\s*<section className="panel"><div className="empty-state">You don&apos;t have permission to view coupons\./);
  assert.match(calendar, /setEvents\(\[\]\);\s*setStandaloneReminders\(\[\]\);\s*setLoading\(false\);/);
});

test("RBAC viewer and manager are separately permission-gated", () => {
  const adminPage = read("src/app/(authorized)/admin/page.tsx");
  const rbacManager = read("src/app/(authorized)/admin/components/RbacManager.tsx");
  const migration = readFileSync(
    path.resolve(root, "../tdpr-backend/drizzle/0029_separate_admin_resource_permissions.sql"),
    "utf8",
  );
  const controller = readFileSync(
    path.resolve(root, "../tdpr-backend/src/http/rbacMgr/rbacMgr.controller.ts"),
    "utf8",
  );
  const permissionsMigration = readFileSync(
    path.resolve(root, "../tdpr-backend/drizzle/0030_remove_default_admin_content_views.sql"),
    "utf8",
  );
  const schoolClassMigration = readFileSync(
    path.resolve(root, "../tdpr-backend/drizzle/0033_remove_default_school_class_grants.sql"),
    "utf8",
  );
  const principalAssignmentMigration = readFileSync(
    path.resolve(root, "../tdpr-backend/drizzle/0034_principal_school_assignment_permission.sql"),
    "utf8",
  );

  assert.match(permissionsMigration, /'student_role', 'teacher_role', 'parent_role', 'admin_role'/);
  assert.match(permissionsMigration, /'calendar', 'coupons', 'notifications'/);
  assert.match(permissionsMigration, /p\."action_id" = 'view'/);
  assert.match(schoolClassMigration, /r\."code" = 'admin_role'/);
  assert.match(schoolClassMigration, /p\."resource_id" IN \('schools', 'classes'\)/);
  assert.match(principalAssignmentMigration, /r\."code" = 'principal_role'/);
  assert.match(principalAssignmentMigration, /p\."code" = 'schools_add_principals'/);
  assert.match(principalAssignmentMigration, /'add_principals', 'school'/);
  assert.match(migration, /'rbac_view'/);
  assert.match(migration, /'rbac_manager_' \|\| a\."id"/);
  assert.match(migration, /DELETE FROM "user_personas"/);
  assert.match(controller, /const view = authorize\("rbac", "view"\);/);
  assert.match(controller, /const managerView = authorizeRbacManager\("view"\);/);
  assert.match(controller, /const create = authorizeRbacManager\("create"\);/);
  assert.match(controller, /const edit = authorizeRbacManager\("edit"\);/);
  assert.match(controller, /\/admin\/manager\/catalog/);
  const authMiddleware = readFileSync(path.resolve(root, "../tdpr-backend/src/middleware/authMiddleware.ts"), "utf8");
  assert.match(authMiddleware, /hasPersona\(context\.userId, "admin"\)/);

  const coupons = readFileSync(path.resolve(root, "../tdpr-backend/src/http/couponMgr/couponMgr.controller.ts"), "utf8");
  const notifications = readFileSync(path.resolve(root, "../tdpr-backend/src/http/notificationMgr/notificationMgr.controller.ts"), "utf8");
  const schools = readFileSync(path.resolve(root, "../tdpr-backend/src/http/schoolMgr/schoolMgr.controller.ts"), "utf8");
  const classes = readFileSync(path.resolve(root, "../tdpr-backend/src/http/classMgr/classMgr.controller.ts"), "utf8");
  assert.match(coupons, /authorize\("coupons", "delete"\)/);
  assert.match(notifications, /authorize\("notifications", "delete"\)/);
  assert.match(schools, /authorize\("schools", "add_principals"\)/);
  assert.match(classes, /authorize\("classes", "add_students"\)/);
});

test("RBAC permissions can be edited from the manager", () => {
  const rbacManager = read("src/app/(authorized)/admin/components/RbacManager.tsx");
  const controller = readFileSync(path.resolve(root, "../tdpr-backend/src/http/rbacMgr/rbacMgr.controller.ts"), "utf8");
  const handler = readFileSync(path.resolve(root, "../tdpr-backend/src/http/rbacMgr/rbacMgr.handler.ts"), "utf8");
  const service = readFileSync(path.resolve(root, "../tdpr-backend/src/services/rbacMgr.service.ts"), "utf8");
  const repo = readFileSync(path.resolve(root, "../tdpr-backend/src/repositories/rbac.repo.ts"), "utf8");

  assert.match(rbacManager, /function startEdit\(row: PermissionRow\)/);
  assert.match(rbacManager, /"Edit permission"/);
  assert.match(rbacManager, /apiRequest\(`\/rbac\/admin\/permissions\/\$\{encodeURIComponent\(editing\)\}`, \{ method: "PUT"/);
  assert.match(controller, /\.put\("\/admin\/permissions\/:id", handler\.updatePermission/);
  assert.match(handler, /updatePermission = async/);
  assert.match(service, /async updatePermission\(id: string, body: any\)/);
  assert.match(repo, /async updatePermission\(/);
  assert.match(repo, /async findPermissionByResourceAction\(/);
});

test("RBAC catalog lists are sorted before reaching the manager", () => {
  const repo = readFileSync(path.resolve(root, "../tdpr-backend/src/repositories/rbac.repo.ts"), "utf8");
  const catalog = repo.slice(repo.indexOf("async fetchCatalogData"));

  assert.match(catalog, /\.from\(resources\)\.orderBy\(asc\(resources\.name\)/);
  assert.match(catalog, /\.from\(actions\)\.orderBy\(asc\(actions\.name\)/);
  assert.match(catalog, /\.from\(permissions\)[\s\S]*?\.orderBy\(asc\(permissions\.resourceId\), asc\(permissions\.actionId\)\)/);
  assert.match(catalog, /\.from\(roles\)\.orderBy\(asc\(roles\.name\)/);
  assert.match(catalog, /\.from\(personas\)\.orderBy\(asc\(personas\.name\)/);
  assert.match(catalog, /\.from\(user\)[\s\S]*?\.orderBy\(asc\(user\.fullName\)\)/);
});
