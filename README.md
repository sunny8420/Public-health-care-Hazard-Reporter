# HealthCheckr - Public Health Hazard Reporter

A comprehensive web application that enables citizens to report health-related civic issues such as stagnant water (dengue risk), open drains, sanitation problems, and other public health hazards.

## Features

### 🏥 Core Features
- **Location-based Reporting**: Citizens can report health hazards with precise location data
- **Category Filters**: Organized reporting with categories like Mosquito Zones, Sanitation, Water Contamination, Air Quality, and Waste Management
- **Severity Levels**: Reports can be classified as Low, Medium, High, or Critical
- **Interactive Map**: Visual representation of all reported hazards with location markers
- **Real-time Alerts**: Get notified about health hazards in your immediate area

### 👨‍💼 Admin Features
- **Admin Dashboard**: Comprehensive insights for health departments
- **Status Management**: Track report progress from "Reported" to "Resolved"
- **Statistics Overview**: View total reports, category breakdowns, and status summaries
- **Bulk Management**: Efficiently manage multiple reports

### 🌍 Location Features
- **GPS Integration**: Automatic location detection
- **Radius-based Filtering**: View reports within specified distance
- **Address Geocoding**: Convert coordinates to readable addresses
- **Distance Calculation**: Show distance from user's location

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Mapping**: Leaflet.js with OpenStreetMap
- **UI/UX**: Modern responsive design with CSS Grid and Flexbox

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Modern web browser with geolocation support

### Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   - Install MongoDB locally or use MongoDB Atlas
   - The application will connect to `mongodb://localhost:27017/healthcheckr` by default
   - Update the connection string in `.env` if needed

3. **Environment Configuration**
   - Copy `.env.example` to `.env` (if exists)
   - Update environment variables as needed
   - The default port is 3000

4. **Start the Application**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Access the Application**
   - Open your browser and navigate to `http://localhost:3000`
   - Allow location access for full functionality

## Usage Guide

### For Citizens

1. **Report a Health Hazard**
   - Click "Report Hazard" button
   - Fill in the required details (title, description, category)
   - Use "Get Current Location" or manually enter address
   - Select appropriate severity level
   - Submit the report

2. **View Nearby Reports**
   - Click "View Nearby Reports" to see hazards in your area
   - Use filters to narrow down by category, severity, or status
   - Adjust radius to expand or limit search area

3. **Check Health Alerts**
   - View the alerts section for high-priority hazards near you
   - Alerts show critical and high-severity reports within 2km

### For Administrators

1. **Access Admin Dashboard**
   - Click "Admin Dashboard" in the navigation
   - View comprehensive statistics and metrics
   - See all reports with management options

2. **Manage Reports**
   - Update report status as work progresses
   - Track resolution progress
   - Monitor category-wise distribution

## API Endpoints

### Reports
- `GET /api/reports` - Get all reports with optional filtering
- `POST /api/reports` - Create a new report
- `GET /api/reports/:id` - Get specific report
- `PATCH /api/reports/:id` - Update report status

### Admin
- `GET /api/admin/stats` - Get dashboard statistics

### Alerts
- `GET /api/alerts` - Get nearby health hazard alerts

## Data Model

### Report Schema
```javascript
{
  title: String (required),
  description: String (required),
  category: Enum ['Mosquito Zones', 'Sanitation', 'Water Contamination', 'Air Quality', 'Waste Management', 'Other'],
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  severity: Enum ['Low', 'Medium', 'High', 'Critical'],
  status: Enum ['Reported', 'Under Review', 'In Progress', 'Resolved'],
  reportedBy: {
    name: String,
    email: String,
    phone: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Security Considerations

- Input validation on all form submissions
- Sanitization of user-generated content
- Rate limiting for API endpoints (recommended for production)
- HTTPS enforcement in production
- Environment variable protection

## Future Enhancements

- User authentication and profiles
- Image upload for reports
- Email notifications for status updates
- Mobile app development
- Integration with government health APIs
- Automated hazard detection using IoT sensors
- Multi-language support
- Advanced analytics and reporting

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please create an issue in the repository or contact the development team.

---

**HealthCheckr** - Making communities safer, one report at a time! 🏥🌍
