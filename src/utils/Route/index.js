const Routes = {
  Home: "/",
  Login: "/login",
  MyAccount: "/my-account",
  Signup: "/signup",
  Friendship: (id) => `/friendship/${id}`,
  ClassManagement: "/class-management",
  AddStudentToClass: "/add-student-to-class",
  Subject: "/subject",
  SubjectScore: "/subject-score",
  Forum: "/forum",
  SystemSettingPage: "/system-setting-age",
  ClassSettingPage: "/class-settings",
};

export default Routes;
