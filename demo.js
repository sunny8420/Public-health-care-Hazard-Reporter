// Global variables
let map;
let userLocation = null;
let reports = [];
let markers = [];

// Sample data for demonstration
const sampleReports = [
    {
        _id: '1',
        title: 'Stagnant Water Pool',
        description: 'Large pool of stagnant water near residential area, potential mosquito breeding ground',
        category: 'Mosquito Zones',
        severity: 'High',
        status: 'Reported',
        location: {
            latitude: 28.6139,
            longitude: 77.2090,
            address: 'Connaught Place, New Delhi'
        },
        reportedBy: { name: 'John Doe', email: 'john@example.com' },
        createdAt: new Date().toISOString()
    },
    {
        _id: '2',
        title: 'Open Drain',
        description: 'Uncovered drain with foul smell, health hazard for nearby residents',
        category: 'Sanitation',
        severity: 'Medium',
        status: 'Under Review',
        location: {
            latitude: 28.6129,
            longitude: 77.2295,
            address: 'India Gate, New Delhi'
        },
        reportedBy: { name: 'Jane Smith', email: 'jane@example.com' },
        createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
        _id: '3',
        title: 'Contaminated Water Source',
        description: 'Public water tap showing signs of contamination, needs immediate attention',
        category: 'Water Contamination',
        severity: 'Critical',
        status: 'In Progress',
        location: {
            latitude: 28.6562,
            longitude: 77.2410,
            address: 'Red Fort, New Delhi'
        },
        reportedBy: { name: 'Mike Johnson', email: 'mike@example.com' },
        createdAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
        _id: '4',
        title: 'Garbage Dump',
        description: 'Illegal garbage dumping site causing air pollution and attracting pests',
        category: 'Waste Management',
        severity: 'High',
        status: 'Reported',
        location: {
            latitude: 28.6304,
            longitude: 77.2177,
            address: 'Rajpath, New Delhi'
        },
        reportedBy: { name: 'Sarah Wilson', email: 'sarah@example.com' },
        createdAt: new Date(Date.now() - 259200000).toISOString()
    },
    {
        _id: '5',
        title: 'Air Quality Issue',
        description: 'Heavy smoke from nearby construction causing breathing problems',
        category: 'Air Quality',
        severity: 'Medium',
        status: 'Resolved',
        location: {
            latitude: 28.6448,
            longitude: 77.2167,
            address: 'Janpath, New Delhi'
        },
        reportedBy: { name: 'David Brown', email: 'david@example.com' },
        createdAt: new Date(Date.now() - 345600000).toISOString()
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    loadReports();
    
    // Set up form submission
    document.getElementById('reportForm').addEventListener('submit', handleReportSubmission);
});

// Initialize Leaflet map
function initializeMap() {
    map = L.map('map').setView([28.6139, 77.2090], 12); // Default to Delhi
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Try to get user's current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setView([userLocation.lat, userLocation.lng], 13);
            
            // Add user location marker
            L.marker([userLocation.lat, userLocation.lng])
                .addTo(map)
                .bindPopup('Your Location')
                .openPopup();
        });
    }
}

// Load and display reports
function loadReports() {
    reports = [...sampleReports];
    displayReports(reports);
    addMarkersToMap(reports);
}

// Display reports in the grid
function displayReports(reportsToShow) {
    const reportsList = document.getElementById('reportsList');
    reportsList.innerHTML = '';
    
    if (reportsToShow.length === 0) {
        reportsList.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1 / -1;">No reports found matching your criteria.</p>';
        return;
    }
    
    reportsToShow.forEach(report => {
        const reportCard = createReportCard(report);
        reportsList.appendChild(reportCard);
    });
}

// Create a report card element
function createReportCard(report) {
    const card = document.createElement('div');
    card.className = 'report-card';
    
    const createdDate = new Date(report.createdAt).toLocaleDateString();
    const distance = userLocation ? 
        calculateDistance(userLocation.lat, userLocation.lng, report.location.latitude, report.location.longitude) : null;
    
    card.innerHTML = `
        <div class="report-header">
            <div class="report-title">${report.title}</div>
            <span class="severity-badge severity-${report.severity.toLowerCase()}">${report.severity}</span>
        </div>
        <div class="report-category">${report.category}</div>
        <div class="report-description">${report.description}</div>
        <div class="report-location">
            <i class="fas fa-map-marker-alt"></i>
            ${report.location.address}
            ${distance ? `(${distance.toFixed(1)} km away)` : ''}
        </div>
        <div class="report-meta">
            <span>${createdDate}</span>
            <span class="status-badge status-${report.status.toLowerCase().replace(' ', '-')}">${report.status}</span>
        </div>
    `;
    
    return card;
}

// Add markers to map
function addMarkersToMap(reportsToShow) {
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    
    reportsToShow.forEach(report => {
        const iconColor = getSeverityColor(report.severity);
        
        const marker = L.marker([report.location.latitude, report.location.longitude])
            .addTo(map)
            .bindPopup(`
                <div style="max-width: 250px;">
                    <h4 style="margin-bottom: 8px; color: #333;">${report.title}</h4>
                    <p style="margin: 4px 0;"><strong>Category:</strong> ${report.category}</p>
                    <p style="margin: 4px 0;"><strong>Severity:</strong> <span style="color: ${iconColor};">${report.severity}</span></p>
                    <p style="margin: 4px 0;"><strong>Status:</strong> ${report.status}</p>
                    <p style="margin: 8px 0; color: #666;">${report.description}</p>
                    <p style="margin: 4px 0; font-size: 0.9em; color: #888;">${new Date(report.createdAt).toLocaleDateString()}</p>
                </div>
            `);
        
        markers.push(marker);
    });
}

// Get severity color
function getSeverityColor(severity) {
    const colors = {
        'Low': '#28a745',
        'Medium': '#ffc107',
        'High': '#fd7e14',
        'Critical': '#dc3545'
    };
    return colors[severity] || '#6c757d';
}

// Apply filters
function applyFilters() {
    const category = document.getElementById('categoryFilter').value;
    const severity = document.getElementById('severityFilter').value;
    const status = document.getElementById('statusFilter').value;
    const radius = parseFloat(document.getElementById('radiusFilter').value) || 50;
    
    let filteredReports = [...sampleReports];
    
    if (category) {
        filteredReports = filteredReports.filter(report => report.category === category);
    }
    
    if (severity) {
        filteredReports = filteredReports.filter(report => report.severity === severity);
    }
    
    if (status) {
        filteredReports = filteredReports.filter(report => report.status === status);
    }
    
    if (userLocation) {
        filteredReports = filteredReports.filter(report => {
            const distance = calculateDistance(
                userLocation.lat, userLocation.lng,
                report.location.latitude, report.location.longitude
            );
            return distance <= radius;
        });
    }
    
    displayReports(filteredReports);
    addMarkersToMap(filteredReports);
}

// Show report form modal
function showReportForm() {
    document.getElementById('reportModal').style.display = 'block';
}

// Show nearby reports
function showNearbyReports() {
    if (!userLocation) {
        showNotification('Please allow location access to view nearby reports', 'warning');
        return;
    }
    
    document.getElementById('radiusFilter').value = '5';
    applyFilters();
    
    // Scroll to reports section
    document.querySelector('.reports-section').scrollIntoView({ behavior: 'smooth' });
}

// Show statistics
function showStats() {
    const totalReports = sampleReports.length;
    const byCategory = {};
    const byStatus = {};
    const bySeverity = {};
    
    sampleReports.forEach(report => {
        byCategory[report.category] = (byCategory[report.category] || 0) + 1;
        byStatus[report.status] = (byStatus[report.status] || 0) + 1;
        bySeverity[report.severity] = (bySeverity[report.severity] || 0) + 1;
    });
    
    let statsMessage = `📊 HealthCheckr Statistics\n\n`;
    statsMessage += `Total Reports: ${totalReports}\n\n`;
    statsMessage += `By Category:\n${Object.entries(byCategory).map(([k,v]) => `• ${k}: ${v}`).join('\n')}\n\n`;
    statsMessage += `By Status:\n${Object.entries(byStatus).map(([k,v]) => `• ${k}: ${v}`).join('\n')}\n\n`;
    statsMessage += `By Severity:\n${Object.entries(bySeverity).map(([k,v]) => `• ${k}: ${v}`).join('\n')}`;
    
    alert(statsMessage);
}

// Get current location for form
function getCurrentLocation() {
    if (!navigator.geolocation) {
        showNotification('Geolocation is not supported by this browser', 'error');
        return;
    }
    
    showNotification('Getting your location...', 'info');
    
    navigator.geolocation.getCurrentPosition(
        function(position) {
            document.getElementById('latitude').value = position.coords.latitude;
            document.getElementById('longitude').value = position.coords.longitude;
            
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            document.getElementById('address').value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            
            showNotification('Location captured successfully', 'success');
        },
        function(error) {
            showNotification('Error getting location: ' + error.message, 'error');
        }
    );
}

// Handle report form submission
function handleReportSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const reportData = {
        _id: Date.now().toString(),
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category'),
        severity: formData.get('severity'),
        status: 'Reported',
        location: {
            latitude: parseFloat(formData.get('latitude')) || 0,
            longitude: parseFloat(formData.get('longitude')) || 0,
            address: formData.get('address')
        },
        reportedBy: {
            name: formData.get('reporterName') || 'Anonymous',
            email: formData.get('reporterEmail') || '',
            phone: formData.get('reporterPhone') || ''
        },
        createdAt: new Date().toISOString()
    };
    
    // Validate required fields
    if (!reportData.title || !reportData.description || !reportData.category || !reportData.location.address) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    if (!reportData.location.latitude || !reportData.location.longitude) {
        showNotification('Please provide location coordinates using "Use Current Location" button', 'error');
        return;
    }
    
    // Add to sample reports (in real app, this would be sent to server)
    sampleReports.unshift(reportData);
    
    showNotification('Report submitted successfully!', 'success');
    closeModal('reportModal');
    document.getElementById('reportForm').reset();
    loadReports(); // Refresh reports display
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: inherit; font-size: 1.2em; cursor: pointer; padding: 0; margin-left: 10px;">&times;</button>
    `;
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        color: white;
        z-index: 3000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease-out;
    `;
    
    // Set background color based on type
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add animation keyframes
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Calculate distance between two coordinates (Haversine formula)
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

// Close modal when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}
