export const settingsPage = {
  settings: {
    title: 'Account Settings',
    description: 'Manage your account information and preferences',
    errors: {
      loadFailed: 'Unable to load settings',
      tryRefresh: 'Please try refreshing the page'
    },
    username: {
      title: 'Username Settings',
      current: 'Current Username',
      change: 'Change Username',
      placeholder: 'Enter new username',
      hint: 'After changing your username, your old username will be saved in history',
      save: 'Save',
      saving: 'Saving...',
      cancel: 'Cancel',
      success: 'Username changed successfully!',
      errors: {
        empty: 'Username cannot be empty',
        sameAsOld: 'New username is the same as current username',
        taken: 'Username is taken, please choose another one',
        userNotFound: 'User not found',
        failed: 'Failed to change username, please try again later'
      }
    },
    avatar: {
      title: 'Avatar Settings',
      current: 'Current Avatar',
      change: 'Change Avatar',
      hint: 'Supports PNG, JPEG, GIF formats, recommended size 256x256 pixels, max 5MB',
      success: 'Avatar changed successfully!'
    },
    cover: {
      title: 'Cover Settings',
      label: 'Profile Cover Image',
      hint: 'Recommended size: 2000x500 pixels (4:1 ratio recommended), supports PNG, JPEG, GIF formats, max 10MB'
    },
    account: {
      title: 'Account Information',
      userId: 'User ID',
      joinDate: 'Join Date',
      country: 'Country/Region',
      lastVisit: 'Last Visit'
    }
  },
} as const;
