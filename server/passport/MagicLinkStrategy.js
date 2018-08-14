const passport = require('passport-strategy')
const util = require('util')

function MagicLinkStrategy(options, verify) {
    if (typeof options == 'function') {
        verify = options
        options = {}
    }
    if (!verify) { throw new TypeError('MagicLinkStrategy requires a verify callback') }

    passport.Strategy.call(this)
    this.name = 'magic-link'
    this._verify = verify
    this._passReqToCallback = false
    this.paramName = options.paramName
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(MagicLinkStrategy, passport.Strategy);

MagicLinkStrategy.prototype.authenticate = function(req, options) {
    var self = this
    
    this._verify(req.params[this.paramName], (err, user, info) => {
        if (err) { return self.error(err) }
        
        self.success(user, info)
    })
}

module.exports = MagicLinkStrategy