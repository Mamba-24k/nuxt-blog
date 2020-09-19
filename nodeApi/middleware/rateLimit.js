
    const rateLimit = require("express-rate-limit");
    const apiLimiter = rateLimit({
      windowMs: 60 * 1000, // 1 minutes
      max: 3, // start blocking after 3 requests
      message:
        "您评论过于频繁，请稍后再试！"
    })
    module.exports = apiLimiter