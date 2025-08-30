const authService = require('../../api/services/auth.service');
const adminApiService = require('../../api/services/admin.service');
const ApiError = require('../../utils/ApiError');

/**
 * Renders the admin login page.
 */
const renderLoginPage = (req, res) => {
  res.render('login', {
    layout: false,
    error: null,
  });
};

/**
 * Handles the login form submission for the admin.
 */
const handleLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.login(email, password);

    if (user.role !== 'admin') {
      throw new ApiError(403, 'Access denied. Admin privileges required.');
    }

    req.session.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    res.redirect('/admin/services');

  } catch (error) {
    res.render('login', {
      layout: false,
      error: error.message,
    });
  }
};

/**
 * Renders the services management page.
 */
const renderServicesPage = async (req, res) => {
  try {
    const services = await adminApiService.getServices();
    res.render('services', {
      services,
      user: req.session.user,
      error: null,
      input: {}
    });
  } catch (error) {
    res.render('services', { services: [], user: req.session.user, error: 'Could not fetch services.', input: {} });
  }
};

/**
 * Handles the creation of a new service from the admin form.
 */
const handleCreateService = async (req, res) => {
  try {
    const { serviceName, allowedOrigins, windowMs, max } = req.body;

    const originsArray = allowedOrigins.split(/\r?\n/).filter(origin => origin.trim() !== '');

    const serviceBody = {
      serviceName,
      allowedOrigins: originsArray,
      rateLimit: {
        windowMs: parseInt(windowMs, 10),
        max: parseInt(max, 10),
      }
    };

    await adminApiService.createService(serviceBody);
    res.redirect('/admin/services');
  } catch (error) {
    const services = await adminApiService.getServices();
    res.render('services', {
      services,
      user: req.session.user,
      error: error.message,
      input: req.body
    });
  }
};

/**
 * Handles admin logout.
 */
const handleLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/admin/services');
    }
    res.redirect('/admin/login');
  });
};

module.exports = {
  renderLoginPage,
  handleLogin,
  renderServicesPage,
  handleCreateService,
  handleLogout,
};
