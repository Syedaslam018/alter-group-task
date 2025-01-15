const geoip = require('geoip-lite');
const Url = require('../models/Url');
const redisClient = require('../redisClient');
const Analytics = require('../models/Analytics');

exports.redirectUrl = async (req, res) => {
  const { alias } = req.params;
  try {
    // Check Redis cache first
    let longUrl = await redisClient.get(alias);

    if (!longUrl) {
      const url = await Url.findOne({ alias });
      if (!url) {
        return res.status(404).json({ message: 'URL not found.' });
      }
      longUrl = url.longUrl;

      // Cache the long URL
      await redisClient.set(alias, longUrl);
    }

    // Collect analytics data
    const userAgent = req.headers['user-agent'];
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const geo = geoip.lookup(ip) || {};

    await Analytics.create({
      alias,
      timestamp: new Date(),
      userAgent,
      ip,
      country: geo.country || 'Unknown',
      region: geo.region || 'Unknown',
      city: geo.city || 'Unknown',
    });

    // Redirect to the long URL
    res.redirect(longUrl);
  } catch (error) {
    console.error('Error redirecting URL:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
