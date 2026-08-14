const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');

// @desc    Get aggregated dashboard workforce metrics including 7-day and 28-day company trends
// @route   GET /api/dashboard/stats
exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ status: 'Active' });
    const inactiveEmployees = await Employee.countDocuments({ status: 'Inactive' });

    // Department-wise headcount
    const deptBreakdown = await Employee.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Today's attendance stats
    const todayAttendance = await Attendance.aggregate([
      { $match: { date: today } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const todayStats = { Present: 0, Absent: 0, 'On Leave': 0 };
    todayAttendance.forEach((t) => {
      todayStats[t._id] = t.count;
    });

    // Compute past 28-day daily company attendance records
    const twentyEightDaysAgo = new Date();
    twentyEightDaysAgo.setDate(twentyEightDaysAgo.getDate() - 28);
    const twentyEightDaysAgoStr = twentyEightDaysAgo.toISOString().split('T')[0];

    const raw28d = await Attendance.aggregate([
      { $match: { date: { $gte: twentyEightDaysAgoStr, $lte: today } } },
      {
        $group: {
          _id: { date: '$date', status: '$status' },
          count: { $sum: 1 },
        },
      },
    ]);

    const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Build 28-day lookup
    const dateMap28 = {};
    const daysArr28 = [];

    for (let i = 27; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const dayName = DAY_NAMES[d.getDay()];
      const monthName = MONTH_NAMES[d.getMonth()];

      dateMap28[dStr] = {
        date: dStr,
        day: dayName,
        label: `${monthName} ${d.getDate()}`,
        shortLabel: `${d.getDate()} ${monthName}`,
        dayLabel: `${dayName} ${d.getDate()}`,
        Present: 0,
        'On Leave': 0,
        Absent: 0,
        total: 0,
        rate: 0,
      };
      daysArr28.push(dStr);
    }

    raw28d.forEach((item) => {
      const { date, status } = item._id;
      if (dateMap28[date]) {
        dateMap28[date][status] = item.count;
      }
    });

    let sumRate28 = 0;
    let daysWithLogs28 = 0;
    let totalPresent28 = 0;
    let totalLeaves28 = 0;
    let totalAbsent28 = 0;
    let peakDay28 = { day: '—', rate: 0 };

    const trend28 = daysArr28.map((dStr) => {
      const entry = dateMap28[dStr];
      const total = entry.Present + entry['On Leave'] + entry.Absent;
      const rate = total > 0 ? Math.round((entry.Present / total) * 100) : 0;
      entry.total = total;
      entry.rate = rate;

      totalPresent28 += entry.Present;
      totalLeaves28 += entry['On Leave'];
      totalAbsent28 += entry.Absent;

      if (total > 0) {
        sumRate28 += rate;
        daysWithLogs28 += 1;
        if (rate >= peakDay28.rate) {
          peakDay28 = { day: `${entry.label} (${rate}%)`, rate };
        }
      }
      return entry;
    });

    const avgRate28 = daysWithLogs28 > 0 ? Math.round(sumRate28 / daysWithLogs28) : 0;

    // Past 7 Days Slice
    const weeklyTrend = trend28.slice(-7);
    let sumRateWeek = 0;
    let daysWithLogsWeek = 0;
    let totalPresentWeek = 0;
    let totalLeavesWeek = 0;
    let totalAbsentWeek = 0;
    let peakDayWeek = { day: '—', rate: 0 };

    weeklyTrend.forEach((entry) => {
      totalPresentWeek += entry.Present;
      totalLeavesWeek += entry['On Leave'];
      totalAbsentWeek += entry.Absent;
      if (entry.total > 0) {
        sumRateWeek += entry.rate;
        daysWithLogsWeek += 1;
        if (entry.rate >= peakDayWeek.rate) {
          peakDayWeek = { day: `${entry.day} (${entry.rate}%)`, rate: entry.rate };
        }
      }
    });

    const weeklyAvgRate = daysWithLogsWeek > 0 ? Math.round(sumRateWeek / daysWithLogsWeek) : 0;

    const activeRate = totalEmployees > 0 ? Math.round((activeEmployees / totalEmployees) * 100) : 0;
    const inactiveRate = totalEmployees > 0 ? Math.round((inactiveEmployees / totalEmployees) * 100) : 0;
    const totalMarkedToday = todayStats.Present + todayStats.Absent + todayStats['On Leave'];
    const todayAttendanceRate = totalMarkedToday > 0 ? Math.round((todayStats.Present / totalMarkedToday) * 100) : 0;

    return res.json({
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      activeRate,
      inactiveRate,
      todayAttendanceRate,
      departmentBreakdown: deptBreakdown.map((d) => ({ department: d._id, count: d.count })),
      todayAttendance: todayStats,
      pastWeekData: {
        trend: weeklyTrend,
        weeklyAvgRate,
        totalPresentWeek,
        totalLeavesWeek,
        totalAbsentWeek,
        peakDay: peakDayWeek.day,
        daysWithLogs: daysWithLogsWeek,
      },
      past28DaysData: {
        trend: trend28,
        avgRate28,
        totalPresent28,
        totalLeaves28,
        totalAbsent28,
        peakDay: peakDay28.day,
        daysWithLogs: daysWithLogs28,
      },
      today,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error computing dashboard metrics', error: error.message });
  }
};
