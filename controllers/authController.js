const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.login = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: 'Token is required.' });
  }
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const googleId = payload.sub;

    // Find or create user
    let user = await User.findOne({ googleId });
    if (!user) {
      user = await User.create({
        googleId,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      });
    }

    // Create JWT token
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token: jwtToken });
  } catch (error) {
    console.error('Google Sign-In error:', error);
    res.status(400).json({ message: 'Invalid Google ID token.' });
  }
};