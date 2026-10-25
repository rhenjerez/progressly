/**
 * week.js - weekly tracking.
 * Weeks run Monday-Sunday. Each week has its own record in S.done, so checking a
 * task this week never marks it done in a future week, and past weeks are kept.
 */

// Midnight on the Monday that starts the current week.
const wk = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
};
// "YYYY-MM-DD" of that Monday: the key for this week's record in S.done.
const wkKey = () => {
  const d = wk();
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
};
