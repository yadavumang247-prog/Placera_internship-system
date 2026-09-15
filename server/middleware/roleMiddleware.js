/**
 * Role-Based Access Control Middleware
 * 
 * Verifies that the authenticated user possesses one of the authorized roles.
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access.',
      });
    }
    const hasRole = roles.includes(req.user.role) || (roles.includes('ADMIN') && req.user.role === 'COLLEGE_ADMIN');
    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires one of the following roles: [${roles.join(', ')}].`,
      });
    }
    next();
  };
};

/**
 * Verification Guard Middleware
 * Restricts unverified users from creating live opportunities or participating in drives.
 */
export const requireVerified = (req, res, next) => {
  if (req.user.status !== 'VERIFIED' && req.user.role !== 'ADMIN' && req.user.role !== 'COLLEGE_ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Your account is pending verification by the Placement Administration.',
    });
  }
  next();
};
