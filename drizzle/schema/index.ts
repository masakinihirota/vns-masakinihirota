import * as authUsers from './root_accounts/auth_users';
import * as rootAccounts from './root_accounts/root_accounts';
import * as userProfiles from './user_profiles/user_profiles';
import * as accessControlEnums from './access_control/enums';
import * as accessControlRoles from './access_control/roles';
import * as accessControlPermissions from './access_control/permissions';
import * as accessControlRolePermissions from './access_control/rolePermissions';
import * as accessControlMemberships from './access_control/memberships';
import * as accessControlExceptionGrants from './access_control/exceptionGrants';
import * as accessControlViews from './access_control/views';

export const schema = {
  ...authUsers,
  ...rootAccounts,
  ...userProfiles,
  ...accessControlEnums,
  ...accessControlRoles,
  ...accessControlPermissions,
  ...accessControlRolePermissions,
  ...accessControlMemberships,
  ...accessControlExceptionGrants,
  ...accessControlViews,
};
