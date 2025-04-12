const API_ROOT = process.env.NEXT_PUBLIC_API_URL;

const API = {
  AUTH: {
    LOGIN: `${API_ROOT}/accounts/login/`,
    SIGNUP: `${API_ROOT}/accounts/register/phone/`,
    ACCOUNT_INFO: `${API_ROOT}/accounts/me/`,
    TOKEN_REFRESH: `${API_ROOT}/accounts/token/refresh/`,
    LIST_USER: `${API_ROOT}/accounts/user/`,
    LIST_STUDENT: `${API_ROOT}/accounts/user/list_student/`,
  },
  ROOM: {
    LIST_ROOM: `${API_ROOT}/accounts/rooms/`,
  },
  MESSAGE: {
    LIST_MESSAGES: `${API_ROOT}/accounts/messages/`,
    LIST_DIRECT_MESSAGES: `${API_ROOT}/accounts/direct_messages/`,
  },
  FRIENDSHIP: {
    REQUEST_FRIEND: `${API_ROOT}/accounts/friendship/`,
    FRIENDS_LIST: `${API_ROOT}/accounts/friendship/friends_list/`,
  },
  CLASS: {
    LEVELS: `${API_ROOT}/accounts/class_level/`,
    NAMES: `${API_ROOT}/accounts/class_name/`,
    CREATE_LEVEL: `${API_ROOT}/accounts/class_level/`,
    CREATE_NAME: `${API_ROOT}/accounts/class_name/`,
    ADD_STUDENT: `${API_ROOT}/accounts/add_student_to_class/`,
    CLASS_LIST: `${API_ROOT}/accounts/class_list/`,
  },
  SUBJECT: {
    LIST: `${API_ROOT}/accounts/subjects/`,
    CREATE: `${API_ROOT}/accounts/subjects/create/`,
    DETAIL: (id) => `${API_ROOT}/accounts/subjects/${id}/`,
  },
  SUBJECT_SCORE: {
    CREATE: `${API_ROOT}/accounts/subject_score/create_update/`,
    LIST: `${API_ROOT}/accounts/subject_score/`,
  },
  SUBJECT_REPORT: {
    LIST: `${API_ROOT}/accounts/subject_report/`,
  },
  SEMESTER_REPORT: {
    LIST: `${API_ROOT}/accounts/semester_report/`,
  },
  SETTING: {
    SYSTEM: `${API_ROOT}/accounts/system_setting/`,
  },
};

export default API;
