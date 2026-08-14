export const initialDashboardState = {
  stats: null,
  employees: [],
  attendanceMap: {}, // { [empId]: 'Present' | 'Absent' | 'On Leave' }
  selectedDate: new Date().toISOString().split('T')[0],
  filters: {
    search: '',
    department: '',
    status: '',
  },
  loading: {
    stats: true,
    employees: true,
    attendance: true,
  },
  toast: null, // { msg, type: 'success' | 'error' }
  error: null,
};

export const DASHBOARD_ACTIONS = {
  SET_STATS: 'SET_STATS',
  SET_EMPLOYEES: 'SET_EMPLOYEES',
  ADD_EMPLOYEE: 'ADD_EMPLOYEE',
  UPDATE_EMPLOYEE: 'UPDATE_EMPLOYEE',
  DELETE_EMPLOYEE: 'DELETE_EMPLOYEE',
  SET_ATTENDANCE: 'SET_ATTENDANCE',
  MARK_ATTENDANCE: 'MARK_ATTENDANCE',
  SET_DATE: 'SET_DATE',
  SET_FILTER: 'SET_FILTER',
  RESET_FILTERS: 'RESET_FILTERS',
  SET_LOADING: 'SET_LOADING',
  SET_TOAST: 'SET_TOAST',
  CLEAR_TOAST: 'CLEAR_TOAST',
  SET_ERROR: 'SET_ERROR',
};

export function dashboardReducer(state, action) {
  switch (action.type) {
    case DASHBOARD_ACTIONS.SET_STATS:
      return {
        ...state,
        stats: action.payload,
        loading: { ...state.loading, stats: false },
        error: null,
      };

    case DASHBOARD_ACTIONS.SET_EMPLOYEES:
      return {
        ...state,
        employees: action.payload,
        loading: { ...state.loading, employees: false },
      };

    case DASHBOARD_ACTIONS.ADD_EMPLOYEE:
      return {
        ...state,
        employees: [action.payload, ...state.employees],
      };

    case DASHBOARD_ACTIONS.UPDATE_EMPLOYEE:
      return {
        ...state,
        employees: state.employees.map((emp) =>
          emp._id === action.payload._id ? action.payload : emp
        ),
      };

    case DASHBOARD_ACTIONS.DELETE_EMPLOYEE:
      return {
        ...state,
        employees: state.employees.filter((emp) => emp._id !== action.payload),
      };

    case DASHBOARD_ACTIONS.SET_ATTENDANCE:
      return {
        ...state,
        attendanceMap: action.payload,
        loading: { ...state.loading, attendance: false },
      };

    case DASHBOARD_ACTIONS.MARK_ATTENDANCE:
      return {
        ...state,
        attendanceMap: {
          ...state.attendanceMap,
          [action.payload.employeeId]: action.payload.status,
        },
      };

    case DASHBOARD_ACTIONS.SET_DATE:
      return {
        ...state,
        selectedDate: action.payload,
        loading: { ...state.loading, attendance: true },
      };

    case DASHBOARD_ACTIONS.SET_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.key]: action.payload.value,
        },
      };

    case DASHBOARD_ACTIONS.RESET_FILTERS:
      return {
        ...state,
        filters: {
          search: '',
          department: '',
          status: '',
        },
      };

    case DASHBOARD_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value,
        },
      };

    case DASHBOARD_ACTIONS.SET_TOAST:
      return {
        ...state,
        toast: action.payload,
      };

    case DASHBOARD_ACTIONS.CLEAR_TOAST:
      return {
        ...state,
        toast: null,
      };

    case DASHBOARD_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: { stats: false, employees: false, attendance: false },
      };

    default:
      return state;
  }
}
