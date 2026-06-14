/**
 * Issues a JWT, stores it in an httpOnly cookie, and returns a sanitised user.
 * Works for any role since auth is unified on the User model.
 */
const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  const cookieExpire = parseInt(process.env.COOKIE_EXPIRE, 10) || 7;

  const options = {
    expires: new Date(Date.now() + cookieExpire * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  };

  // Never leak the password hash, even though `select: false` should cover it.
  const safeUser = user.toObject ? user.toObject() : { ...user };
  delete safeUser.password;
  delete safeUser.resetPasswordToken;
  delete safeUser.resetPasswordExpire;

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user: safeUser,
    token,
  });
};

export default sendToken;
