import * as authUsers from './root_accounts/auth_users';
import * as rootAccounts from './root_accounts/root_accounts';
import * as userProfiles from './user_profiles/user_profiles';

export const schema = {
  ...authUsers,
  ...rootAccounts,
  ...userProfiles,
};