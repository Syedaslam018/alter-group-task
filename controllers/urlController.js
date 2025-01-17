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
    try {
      let longUrl = await redisClient.get(alias);
  
      if (!longUrl) {
        const url = await Url.findOneAndUpdate(
          { alias },
          { $inc: { clickCount: 1 } }, // Increment click count
          { new: true }
        );
        if (!url) {
          return res.status(404).json({ message: 'URL not found.' });
        }
        longUrl = url.longUrl;
  
        // Cache the long URL
        await redisClient.set(alias, longUrl);
      } else {
        // Increment click count directly in DB
        await Url.findOneAndUpdate({ alias }, { $inc: { clickCount: 1 } });
      }
  
      res.redirect(longUrl);
    } catch (error) {
      console.error('Error redirecting URL:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  };
  
  
