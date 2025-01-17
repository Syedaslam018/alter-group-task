const Url = require('../models/Url');
exports.getUrlAnalytics = async (req, res) => {
    const { alias } = req.params;
    try {
      const analytics = await Analytics.find({ alias });
      const totalClicks = analytics.length;
      const uniqueUsers = new Set(analytics.map((a) => a.ipAddress)).size;
  
      const clicksByDate = analytics.reduce((acc, { timestamp }) => {
        const date = timestamp.toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
  
      const osType = analytics.reduce((acc, { osType }) => {
        acc[osType] = (acc[osType] || 0) + 1;
        return acc;
      }, {});
  
      const deviceType = analytics.reduce((acc, { deviceType }) => {
        acc[deviceType] = (acc[deviceType] || 0) + 1;
        return acc;
      }, {});
  
      res.status(200).json({
        totalClicks,
        uniqueUsers,
        clicksByDate,
        osType,
        deviceType,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  };

exports.getTopicAnalytics = async (req, res) => {
  const { topic } = req.params;
  try {
    const urls = await Url.find({ topic });
    if (!urls.length) {
      return res.status(404).json({ message: 'No analytics found for this topic.' });
    }

    const totalClicks = urls.reduce((sum, url) => sum + (url.clickCount || 0), 0);

    res.status(200).json({
      topic,
      totalUrls: urls.length,
      totalClicks,
    });
  } catch (error) {
    console.error('Error retrieving topic analytics:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.getOverallAnalytics = async (req, res) => {
  try {
    const urls = await Url.find({});
    const totalClicks = urls.reduce((sum, url) => sum + (url.clickCount || 0), 0);

    res.status(200).json({
      totalTopics: new Set(urls.map((url) => url.topic)).size,
      totalUrls: urls.length,
      totalClicks,
    });
  } catch (error) {
    console.error('Error retrieving overall analytics:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
