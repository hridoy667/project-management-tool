exports.authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
      if (!allowedRoles.includes(req.user.role.name)) {
        return res.status(403).json({ success: false, message: "Not authorized" });
      }
      next();
    };
  };
  