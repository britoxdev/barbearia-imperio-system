const WORK_START_MORNING = "08:00";
const WORK_END_MORNING = "11:30";
const WORK_START_AFTERNOON = "14:00";
const WORK_END_AFTERNOON = "18:30";
const SLOT_INTERVAL_MIN = 10;

function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function fromMinutes(total) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function addMinutes(time, amount) {
  return fromMinutes(toMinutes(time) + amount);
}

function overlaps(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

function isWithinRange(start, end, rangeStart, rangeEnd) {
  return start >= rangeStart && end <= rangeEnd;
}

function isWithinBusinessRules({ startTime, endTime }) {
  const start = toMinutes(startTime);
  const end = toMinutes(endTime);

  const morningStart = toMinutes(WORK_START_MORNING);
  const morningEnd = toMinutes(WORK_END_MORNING);
  const afternoonStart = toMinutes(WORK_START_AFTERNOON);
  const afternoonEnd = toMinutes(WORK_END_AFTERNOON);

  const inMorning = isWithinRange(start, end, morningStart, morningEnd);
  const inAfternoon = isWithinRange(start, end, afternoonStart, afternoonEnd);

  if (!inMorning && !inAfternoon) {
    return {
      valid: false,
      reason: "Horario fora do expediente ou atravessando intervalo de almoco."
    };
  }

  return { valid: true };
}

function hasConflict({ startTime, endTime, existingAppointments }) {
  const start = toMinutes(startTime);
  const end = toMinutes(endTime);

  return existingAppointments.some((a) => {
    const aStart = toMinutes(a.start_time);
    const aEnd = toMinutes(a.end_time);
    return overlaps(start, end, aStart, aEnd);
  });
}

function getCandidateStartTimes(durationMin) {
  const candidates = [];
  const windows = [
    [WORK_START_MORNING, WORK_END_MORNING],
    [WORK_START_AFTERNOON, WORK_END_AFTERNOON]
  ];

  for (const [windowStart, windowEnd] of windows) {
    const startMin = toMinutes(windowStart);
    const endMin = toMinutes(windowEnd);

    for (let t = startMin; t + durationMin <= endMin; t += SLOT_INTERVAL_MIN) {
      candidates.push(fromMinutes(t));
    }
  }

  return candidates;
}

function getAvailableStartTimes({ serviceDurationMin, existingAppointments }) {
  const candidates = getCandidateStartTimes(serviceDurationMin);

  return candidates.filter((startTime) => {
    const endTime = addMinutes(startTime, serviceDurationMin);
    const scheduleCheck = isWithinBusinessRules({ startTime, endTime });
    if (!scheduleCheck.valid) return false;

    return !hasConflict({
      startTime,
      endTime,
      existingAppointments
    });
  });
}

module.exports = {
  addMinutes,
  isWithinBusinessRules,
  hasConflict,
  getAvailableStartTimes
};
