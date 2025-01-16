const geoip = require('geoip-lite');
const Url = require('../models/Url');
const getRedisClient = require('../redisClient');
const Analytics = require('../models/Analytics');
const redisClient = getRedisClient();

exports.createShortUrl = async (req, res) => {
    const { longUrl, customAlias, topic } = req.body;
    try {
      let alias = customAlias || shortid.generate();
      const shortUrl = `${process.env.BASE_URL}/${alias}`;
  
      // Check if alias already exists
      const existing = await Url.findOne({ alias });
      if (existing) {
        return res.status(400).json({ message: 'Custom alias already exists.' });
      }
  
      const url = await Url.create({
        longUrl,
        alias,
        shortUrl,
        topic,
      });
  
      // Cache the new URL
      await redisClient.set(alias, longUrl);
  
      res.status(201).json({
        shortUrl: url.shortUrl,
        createdAt: url.createdAt,
      });
    } catch (error) {
      console.error('Error creating short URL:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  };

  
  exports.redirectUrl = async (req, res) => {
    const { alias } = req.params;
    console.log(alias)
    try {
      let longUrl = await redisClient.get(alias);
      console.log(longUrl)
      if (!longUrl) {
        const url = await Url.findOne({ alias:alias });
        if (!url) return res.status(404).json({ message: 'URL not found.' });
        longUrl = url.longUrl;
        await redisClient.set(alias, longUrl);
      }
  
      // Log analytics
      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip || req.connection.remoteAddress;
      const location = geoip.lookup(ipAddress);
      const osType = userAgent.includes('Windows') ? 'Windows' : userAgent.includes('Mac') ? 'macOS' : 'Other';
      const deviceType = /mobile/i.test(userAgent) ? 'Mobile' : 'Desktop';
  
      const analyticsData = {
        alias,
        userAgent,
        ipAddress,
        osType,
        deviceType,
        location: location ? `${location.city}, ${location.country}` : 'Unknown',
      };
  
      await Analytics.create(analyticsData);
  
      res.redirect(longUrl);
    } catch (error) {
      console.error('Error redirecting URL:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  };
  
