const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB connection (using local MongoDB for development)
mongoose.connect('mongodb://localhost:27017/healthcheckr', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Health Hazard Report Schema
const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Mosquito Zones', 'Sanitation', 'Water Contamination', 'Air Quality', 'Waste Management', 'Other']
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true }
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Reported', 'Under Review', 'In Progress', 'Resolved'],
    default: 'Reported'
  },
  reportedBy: {
    name: String,
    email: String,
    phone: String
  },
  images: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Report = mongoose.model('Report', reportSchema);

// Routes

// Get all reports with optional filtering
app.get('/api/reports', async (req, res) => {
  try {
    const { category, severity, status, lat, lng, radius } = req.query;
    let query = {};
    
    if (category) query.category = category;
    if (severity) query.severity = severity;
    if (status) query.status = status;
    
    let reports = await Report.find(query).sort({ createdAt: -1 });
    
    // Filter by location if coordinates provided
    if (lat && lng && radius) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      const searchRadius = parseFloat(radius) || 5; // Default 5km radius
      
      reports = reports.filter(report => {
        const distance = calculateDistance(
          userLat, userLng,
          report.location.latitude, report.location.longitude
        );
        return distance <= searchRadius;
      });
    }
    
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new report
app.post('/api/reports', async (req, res) => {
  try {
    const report = new Report(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get report by ID
app.get('/api/reports/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update report status (for admin)
app.patch('/api/reports/:id', async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get reports statistics for admin dashboard
app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalReports = await Report.countDocuments();
    const reportsByCategory = await Report.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const reportsByStatus = await Report.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const reportsBySeverity = await Report.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);
    
    res.json({
      totalReports,
      reportsByCategory,
      reportsByStatus,
      reportsBySeverity
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get nearby hazard alerts
app.get('/api/alerts', async (req, res) => {
  try {
    const { lat, lng, radius = 2 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }
    
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const searchRadius = parseFloat(radius);
    
    // Get high severity and critical reports in the area
    const reports = await Report.find({
      severity: { $in: ['High', 'Critical'] },
      status: { $in: ['Reported', 'Under Review', 'In Progress'] }
    });
    
    const nearbyAlerts = reports.filter(report => {
      const distance = calculateDistance(
        userLat, userLng,
        report.location.latitude, report.location.longitude
      );
      return distance <= searchRadius;
    });
    
    res.json(nearbyAlerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance in kilometers
  return d;
}

// Database connection
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('MongoDB connection error:', err);
});

app.listen(PORT, () => {
  console.log(`HealthCheckr server running on port ${PORT}`);
});
