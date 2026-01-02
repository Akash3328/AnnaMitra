const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home.controller');
const { isNotAdminOrSuperAdmin } = require('../middlewares/auth.middleware');

// Route for the home page
router.get('/', homeController.renderHomePage);

// Route for the about page
router.get('/about', homeController.renderAboutPage);

// Route for testing purpose
router.get('/test', homeController.testRoute);

// Apply middleware to restrict access for Admin and Super Admin
router.use(isNotAdminOrSuperAdmin);

// Route for the contact page
router.get('/contact', homeController.renderContactPage);

// Mark All Notifications as Read
router.post('/notifications/mark-all-notifications-read', homeController.markAllNotificationsRead);

// Delete notifications route
router.delete('/notifications/:id', homeController.deleteNotification);

module.exports = router;