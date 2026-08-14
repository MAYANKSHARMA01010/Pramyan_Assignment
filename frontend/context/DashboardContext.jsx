'use client';
import { createContext, useContext, useReducer, useCallback, useRef } from 'react';
import api from '@/lib/api';
import {
  dashboardReducer,
  initialDashboardState,
  DASHBOARD_ACTIONS,
} from '@/reducers/dashboardReducer';

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialDashboardState);

  const filtersRef = useRef(state.filters);
  filtersRef.current = state.filters;

  const selectedDateRef = useRef(state.selectedDate);
  selectedDateRef.current = state.selectedDate;

  const showToast = useCallback((msg, type = 'success') => {
    dispatch({ type: DASHBOARD_ACTIONS.SET_TOAST, payload: { msg, type } });
    setTimeout(() => {
      dispatch({ type: DASHBOARD_ACTIONS.CLEAR_TOAST });
    }, 3500);
  }, []);

  // Fetch telemetry metrics
  const fetchStats = useCallback(async () => {
    dispatch({
      type: DASHBOARD_ACTIONS.SET_LOADING,
      payload: { key: 'stats', value: true },
    });
    try {
      const { data } = await api.get('/dashboard/stats');
      dispatch({ type: DASHBOARD_ACTIONS.SET_STATS, payload: data });
    } catch {
      dispatch({
        type: DASHBOARD_ACTIONS.SET_ERROR,
        payload: 'Unable to retrieve dashboard analytics.',
      });
    }
  }, []);

  // Fetch employees list
  const fetchEmployees = useCallback(
    async (overrideFilters) => {
      dispatch({
        type: DASHBOARD_ACTIONS.SET_LOADING,
        payload: { key: 'employees', value: true },
      });
      try {
        const filters = overrideFilters || filtersRef.current;
        const params = {};
        if (filters?.search) params.search = filters.search;
        if (filters?.department) params.department = filters.department;
        if (filters?.status) params.status = filters.status;

        const { data } = await api.get('/employees', { params });
        dispatch({ type: DASHBOARD_ACTIONS.SET_EMPLOYEES, payload: data });
      } catch {
        showToast('Failed to retrieve employee directory', 'error');
      }
    },
    [showToast]
  );

  // Save or update employee
  const saveEmployee = async (formData, editId = null) => {
    if (editId) {
      const { data } = await api.put(`/employees/${editId}`, formData);
      dispatch({ type: DASHBOARD_ACTIONS.UPDATE_EMPLOYEE, payload: data });
      showToast(`Updated record for ${formData.name}`);
      fetchStats();
      return data;
    } else {
      const { data } = await api.post('/employees', formData);
      dispatch({ type: DASHBOARD_ACTIONS.ADD_EMPLOYEE, payload: data });
      showToast(`Registered new employee: ${formData.name}`);
      fetchStats();
      return data;
    }
  };

  // Delete employee
  const deleteEmployee = async (id, name) => {
    await api.delete(`/employees/${id}`);
    dispatch({ type: DASHBOARD_ACTIONS.DELETE_EMPLOYEE, payload: id });
    showToast(`Deleted employee ${name}`);
    fetchStats();
  };

  // Fetch attendance for selected date
  const fetchAttendance = useCallback(
    async (date) => {
      dispatch({
        type: DASHBOARD_ACTIONS.SET_LOADING,
        payload: { key: 'attendance', value: true },
      });
      try {
        const targetDate = date || selectedDateRef.current;
        const { data } = await api.get('/attendance', { params: { date: targetDate } });
        const map = {};
        data.forEach((r) => {
          if (r.employeeId?._id) {
            map[r.employeeId._id] = r.status;
          }
        });
        dispatch({ type: DASHBOARD_ACTIONS.SET_ATTENDANCE, payload: map });
      } catch {
        showToast('Failed to load attendance logs', 'error');
      }
    },
    [showToast]
  );

  // Mark attendance
  const markAttendance = async (employeeId, status, employeeName) => {
    try {
      await api.post('/attendance', {
        employeeId,
        date: selectedDateRef.current,
        status,
      });
      dispatch({
        type: DASHBOARD_ACTIONS.MARK_ATTENDANCE,
        payload: { employeeId, status },
      });
      showToast(`Marked ${employeeName} as ${status}`);
      fetchStats();
    } catch {
      showToast('Failed to save attendance record', 'error');
    }
  };

  // Set date
  const setDate = (date) => {
    dispatch({ type: DASHBOARD_ACTIONS.SET_DATE, payload: date });
  };

  // Set filter
  const setFilter = (key, value) => {
    dispatch({ type: DASHBOARD_ACTIONS.SET_FILTER, payload: { key, value } });
  };

  // Reset filters
  const resetFilters = () => {
    dispatch({ type: DASHBOARD_ACTIONS.RESET_FILTERS });
  };

  return (
    <DashboardContext.Provider
      value={{
        ...state,
        showToast,
        fetchStats,
        fetchEmployees,
        saveEmployee,
        deleteEmployee,
        fetchAttendance,
        markAttendance,
        setDate,
        setFilter,
        resetFilters,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
