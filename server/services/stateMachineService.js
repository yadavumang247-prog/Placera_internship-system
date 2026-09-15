/**
 * Recruitment Lifecycle State Machine Service
 * 
 * Enforces strict, deterministic state transitions for candidate applications.
 * Prevents unauthorized or invalid status skips (e.g. directly moving from APPLIED to SELECTED).
 */

export const APPLICATION_STATUSES = {
  APPLIED: 'APPLIED',
  SHORTLISTED: 'SHORTLISTED',
  ROUND_PENDING: 'ROUND_PENDING',
  ROUND_IN_PROGRESS: 'ROUND_IN_PROGRESS',
  ROUND_PASSED: 'ROUND_PASSED',
  ROUND_FAILED: 'ROUND_FAILED',
  INTERVIEW_SCHEDULED: 'INTERVIEW_SCHEDULED',
  SELECTED: 'SELECTED',
  REJECTED: 'REJECTED',
  WITHDRAWN: 'WITHDRAWN',
  DISQUALIFIED: 'DISQUALIFIED',
  OFFER_RELEASED: 'OFFER_RELEASED',
};

// Map of valid source state -> allowed target states
const VALID_TRANSITIONS = {
  [APPLICATION_STATUSES.APPLIED]: [
    APPLICATION_STATUSES.SHORTLISTED,
    APPLICATION_STATUSES.REJECTED,
    APPLICATION_STATUSES.WITHDRAWN,
    APPLICATION_STATUSES.DISQUALIFIED,
  ],
  [APPLICATION_STATUSES.SHORTLISTED]: [
    APPLICATION_STATUSES.ROUND_PENDING,
    APPLICATION_STATUSES.INTERVIEW_SCHEDULED,
    APPLICATION_STATUSES.REJECTED,
    APPLICATION_STATUSES.WITHDRAWN,
    APPLICATION_STATUSES.DISQUALIFIED,
  ],
  [APPLICATION_STATUSES.ROUND_PENDING]: [
    APPLICATION_STATUSES.ROUND_IN_PROGRESS,
    APPLICATION_STATUSES.REJECTED,
    APPLICATION_STATUSES.WITHDRAWN,
    APPLICATION_STATUSES.DISQUALIFIED,
  ],
  [APPLICATION_STATUSES.ROUND_IN_PROGRESS]: [
    APPLICATION_STATUSES.ROUND_PASSED,
    APPLICATION_STATUSES.ROUND_FAILED,
    APPLICATION_STATUSES.DISQUALIFIED,
  ],
  [APPLICATION_STATUSES.ROUND_PASSED]: [
    APPLICATION_STATUSES.ROUND_PENDING,       // Advance to next assessment round
    APPLICATION_STATUSES.INTERVIEW_SCHEDULED, // Advance to interview round
    APPLICATION_STATUSES.SELECTED,           // Final round passed
    APPLICATION_STATUSES.REJECTED,
    APPLICATION_STATUSES.WITHDRAWN,
    APPLICATION_STATUSES.DISQUALIFIED,
  ],
  [APPLICATION_STATUSES.ROUND_FAILED]: [
    APPLICATION_STATUSES.REJECTED,
    APPLICATION_STATUSES.WITHDRAWN,
  ],
  [APPLICATION_STATUSES.INTERVIEW_SCHEDULED]: [
    APPLICATION_STATUSES.ROUND_PASSED,        // Interview passed
    APPLICATION_STATUSES.ROUND_FAILED,        // Interview failed
    APPLICATION_STATUSES.SELECTED,            // Final interview passed
    APPLICATION_STATUSES.REJECTED,
    APPLICATION_STATUSES.WITHDRAWN,
    APPLICATION_STATUSES.DISQUALIFIED,
  ],
  [APPLICATION_STATUSES.SELECTED]: [
    APPLICATION_STATUSES.OFFER_RELEASED,
    APPLICATION_STATUSES.REJECTED,
    APPLICATION_STATUSES.WITHDRAWN,
  ],
  [APPLICATION_STATUSES.OFFER_RELEASED]: [
    APPLICATION_STATUSES.WITHDRAWN,
  ],
  // Terminal states allow no further standard transitions
  [APPLICATION_STATUSES.REJECTED]: [],
  [APPLICATION_STATUSES.WITHDRAWN]: [],
  [APPLICATION_STATUSES.DISQUALIFIED]: [],
};

/**
 * Validates whether transition from currentStatus to targetStatus is permitted.
 * 
 * @param {String} currentStatus - Current state of the application
 * @param {String} targetStatus - Requested destination state
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export function validateStateTransition(currentStatus, targetStatus) {
  if (!currentStatus || !targetStatus) {
    return { isValid: false, error: 'Current status and target status are required.' };
  }

  if (currentStatus === targetStatus) {
    return { isValid: true, error: null };
  }

  const allowedTargets = VALID_TRANSITIONS[currentStatus] || [];
  if (!allowedTargets.includes(targetStatus)) {
    return {
      isValid: false,
      error: `Illegal recruitment pipeline transition: Cannot move directly from '${currentStatus}' to '${targetStatus}'.`,
    };
  }

  return { isValid: true, error: null };
}

/**
 * Advances candidate to the next sequential round or sets to SELECTED if no more rounds.
 */
export function advanceToNextRound(application, totalRoundsCount) {
  const nextIndex = (application.currentRoundIndex || 0) + 1;

  if (nextIndex >= totalRoundsCount) {
    return {
      status: APPLICATION_STATUSES.SELECTED,
      currentRoundIndex: nextIndex,
      isFinalSelection: true,
    };
  }

  return {
    status: APPLICATION_STATUSES.ROUND_PENDING,
    currentRoundIndex: nextIndex,
    isFinalSelection: false,
  };
}
