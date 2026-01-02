// Wrap in try-catch to handle initialization errors gracefully
try {
  const app = require("../index");
  module.exports = app;
} catch (error) {
  console.error('Failed to load application:', error);
  console.error('Error stack:', error.stack);
  
  // Export a minimal error handler
  const express = require("express");
  const errorApp = express();
  
  errorApp.use((req, res) => {
    res.status(500).json({
      error: 'Application initialization failed',
      message: error.message,
    });
  });
  
  module.exports = errorApp;
}
