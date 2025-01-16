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
  