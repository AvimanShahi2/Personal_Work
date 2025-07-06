window.initAlertsPage = function () {
    // Mockup data for alerts
    const alertsData = [
        {
            id: 1, type: "Intrusion Detected", photo: "#FF9999",
            timestamp: "6/19/2025 13:05 PM", location: "Main Entrance",
            notifyBy: "SMS", description: "A person entered restricted area", status: "valid"
        },
        {
            id: 2, type: "Intrusion Detected", photo: "#FFFF99",
            timestamp: "6/19/2025 13:05 PM", location: "Main Entrance",
            notifyBy: "SMS", description: "A person entered restricted area", status: "error"
        },
        {
            id: 3, type: "Motion Detected", photo: "#FF9999",
            timestamp: "6/19/2025 12:45 PM", location: "Parking Area",
            notifyBy: "Email", description: "Unusual movement detected in parking zone", status: "pending"
        },
        {
            id: 4, type: "Intrusion Detected", photo: "#9999FF",
            timestamp: "6/19/2025 12:30 PM", location: "Side Gate",
            notifyBy: "SMS", description: "Unauthorized access attempt", status: "valid"
        },
        {
            id: 5, type: "Fire Alarm", photo: "#FF99FF",
            timestamp: "6/19/2025 11:15 AM", location: "Storage Room",
            notifyBy: "Push", description: "Smoke detected in storage area", status: "error"
        },
        {
            id: 6, type: "Vandalism Detected", photo: "#99FFFF",
            timestamp: "6/19/2025 10:20 AM", location: "Building Wall",
            notifyBy: "SMS", description: "Graffiti activity detected", status: "valid"
        },
        {
            id: 7, type: "Vehicle Alert", photo: "#99FF99",
            timestamp: "6/19/2025 09:30 AM", location: "Driveway",
            notifyBy: "Email", description: "Unregistered vehicle detected", status: "pending"
        },
        {
            id: 8, type: "Intrusion Detected", photo: "#FFB366",
            timestamp: "6/19/2025 08:45 AM", location: "Rear Exit",
            notifyBy: "Push", description: "Person detected at restricted exit", status: "error"
        },
        {
            id: 9, type: "Noise Alert", photo: "#B366FF",
            timestamp: "6/19/2025 07:15 AM", location: "Conference Room",
            notifyBy: "SMS", description: "Loud noise detected after hours", status: "valid"
        },
        {
            id: 10, type: "Equipment Malfunction", photo: "#66FFB3",
            timestamp: "6/19/2025 06:00 AM", location: "Security Panel",
            notifyBy: "Email", description: "Camera #3 offline for maintenance", status: "pending"
        },
        {
            id: 11, type: "Perimeter Breach", photo: "#FF6666",
            timestamp: "6/18/2025 23:30 PM", location: "North Fence",
            notifyBy: "SMS", description: "Motion detected near perimeter fence", status: "error"
        },
        {
            id: 12, type: "Access Denied", photo: "#6666FF",
            timestamp: "6/18/2025 22:15 PM", location: "Server Room",
            notifyBy: "Push", description: "Invalid keycard access attempt", status: "valid"
        }
    ];

    // Global state
    let currentData = [...alertsData];
    let filteredData = [...alertsData];
    let currentPage = 1;
    const itemsPerPage = 6;

    // DOM Elements
    const tableBody = document.getElementById('alertsTableBody');
    const searchInput = document.getElementById('locationSearch');
    const sortSelect = document.getElementById('sortOrder');
    const filterBtn = document.getElementById('filterBtn');
    const modal = document.getElementById('dateFilterModal');
    const closeModal = modal?.querySelector('.close');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const paginationInfo = document.getElementById('paginationInfo');
    const detailModal = document.getElementById('detailModal');
    const detailClose = document.getElementById('detailClose');

    function setupEventListeners() {
        searchInput?.addEventListener('input', handleSearch);
        sortSelect?.addEventListener('change', handleSort);
        filterBtn?.addEventListener('click', openModal);
        closeModal?.addEventListener('click', closeModalHandler);
        detailClose?.addEventListener('click', closeDetailModal);
        window.addEventListener('click', outsideClickHandler);
        prevBtn?.addEventListener('click', () => changePage(-1));
        nextBtn?.addEventListener('click', () => changePage(1));
        document.getElementById('applyFilter')?.addEventListener('click', applyDateFilter);
        document.getElementById('clearFilter')?.addEventListener('click', clearDateFilter);
    }

    function renderTable() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageData = filteredData.slice(startIndex, endIndex);

        tableBody.innerHTML = '';
        pageData.forEach(alert => {
            const row = createTableRow(alert);
            tableBody.appendChild(row);
        });

        updatePagination();
    }

    function createTableRow(alert) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${alert.type}</td>
            <td><div class="photo-placeholder" style="background-color: ${alert.photo};">IMG</div></td>
            <td>${alert.timestamp}</td>
            <td>${alert.location}</td>
            <td>${alert.notifyBy}</td>
            <td>${alert.description}</td>
            <td><span class="status-badge status-${alert.status}">${alert.status}</span></td>
            <td><button class="action-btn" onclick="window.alertsModule?.viewAlert(${alert.id})">👁 View</button></td>
        `;
        return row;
    }

    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        filteredData = currentData.filter(alert =>
            alert.location.toLowerCase().includes(searchTerm) ||
            alert.type.toLowerCase().includes(searchTerm) ||
            alert.description.toLowerCase().includes(searchTerm)
        );
        currentPage = 1;
        renderTable();
    }

    function handleSort() {
        const sortBy = sortSelect.value;
        filteredData.sort((a, b) => {
            switch (sortBy) {
                case 'alphabetical': return a.location.localeCompare(b.location);
                case 'timestamp': return new Date(a.timestamp) - new Date(b.timestamp);
                case 'status': return a.status.localeCompare(b.status);
                default: return 0;
            }
        });
        currentPage = 1;
        renderTable();
    }

    function openModal() {
        modal.style.display = 'block';
    }

    function closeModalHandler() {
        modal.style.display = 'none';
    }

    function closeDetailModal() {
        detailModal.style.display = 'none';
    }

    function outsideClickHandler(e) {
        if (e.target === modal) modal.style.display = 'none';
        if (e.target === detailModal) detailModal.style.display = 'none';
    }

    function applyDateFilter() {
        const fromDate = document.getElementById('dateFrom').value;
        const toDate = document.getElementById('dateTo').value;

        if (fromDate || toDate) {
            filteredData = currentData.filter(alert => {
                const alertDate = new Date(alert.timestamp);
                const from = fromDate ? new Date(fromDate) : new Date('1900-01-01');
                const to = toDate ? new Date(toDate) : new Date('2100-12-31');
                return alertDate >= from && alertDate <= to;
            });
        } else {
            filteredData = [...currentData];
        }

        currentPage = 1;
        renderTable();
        modal.style.display = 'none';
    }

    function clearDateFilter() {
        document.getElementById('dateFrom').value = '';
        document.getElementById('dateTo').value = '';
        filteredData = [...currentData];
        currentPage = 1;
        renderTable();
        modal.style.display = 'none';
    }

    function changePage(direction) {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        if ((direction === 1 && currentPage < totalPages) || (direction === -1 && currentPage > 1)) {
            currentPage += direction;
            renderTable();
        }
    }

    function updatePagination() {
        const totalItems = filteredData.length;
        const startItem = (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, totalItems);
        paginationInfo.textContent = `${startItem}-${endItem} of ${totalItems}`;
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === Math.ceil(totalItems / itemsPerPage) || totalItems === 0;
    }

    function showDetailView(alertId) {
        // This is where you would fetch real data from your API
        // For now, using dummy data that matches the design
        const alert = alertsData.find(a => a.id === alertId);
        
        if (!alert) return;

        // Populate modal with alert data (using dummy data for now)
        document.getElementById('detailTitle').textContent = alert.type;
        document.getElementById('cameraInfo').textContent = `Camera 1 | ${alert.location} | ${alert.timestamp}`;
        document.getElementById('detailAlertType').textContent = alert.type;
        document.getElementById('detailTimestamp').textContent = alert.timestamp;
        document.getElementById('detailLocation').textContent = alert.location;
        document.getElementById('detailStatus').textContent = alert.status;
        document.getElementById('detailNotifyBy').textContent = alert.notifyBy;
        document.getElementById('detailAlertId').textContent = `#${String(alert.id).padStart(3, '0')}`;
        document.getElementById('detailDescription').textContent = alert.description + '. The AI detection system identified unauthorized personnel attempting to access a secured zone during restricted hours.';

        // TODO: Replace this section with real API call
        // fetchAlertDetails(alertId).then(data => {
        //     // Update modal with real data
        //     document.getElementById('detailTitle').textContent = data.alertType;
        //     document.getElementById('cameraInfo').textContent = `${data.cameraName} | ${data.location} | ${data.timestamp}`;
        //     // ... populate other fields
        // });

        detailModal.style.display = 'block';
    }

    // Export utility functions
    window.alertsModule = {
        refreshData: function (newData) {
            currentData = [...newData];
            filteredData = [...newData];
            currentPage = 1;
            renderTable();
        },
        addAlert: function (newAlert) {
            currentData.unshift(newAlert);
            filteredData = [...currentData];
            renderTable();
        },
        removeAlert: function (alertId) {
            currentData = currentData.filter(alert => alert.id !== alertId);
            filteredData = [...currentData];
            renderTable();
        },
        viewAlert: function (alertId) {
            showDetailView(alertId);
        },
        // Method to update alert details from API
        updateAlertDetails: function(alertId, detailData) {
            // This method can be called after fetching real data
            document.getElementById('detailTitle').textContent = detailData.alertType || 'Alert Details';
            document.getElementById('cameraInfo').textContent = `${detailData.cameraName || 'Camera'} | ${detailData.location || 'Unknown'} | ${detailData.timestamp || 'N/A'}`;
            document.getElementById('detailAlertType').textContent = detailData.alertType || 'N/A';
            document.getElementById('detailTimestamp').textContent = detailData.timestamp || 'N/A';
            document.getElementById('detailLocation').textContent = detailData.location || 'N/A';
            document.getElementById('detailStatus').textContent = detailData.status || 'N/A';
            document.getElementById('detailNotifyBy').textContent = detailData.notifyBy || 'N/A';
            document.getElementById('detailAlertId').textContent = detailData.alertId || '#000';
            document.getElementById('detailDescription').textContent = detailData.description || 'No description available';
            
            // Update detection counts if provided
            if (detailData.detections) {
                const detectionItems = document.querySelectorAll('.detection-count');
                if (detectionItems.length >= 3) {
                    detectionItems[0].textContent = detailData.detections.persons || '0';
                    detectionItems[1].textContent = detailData.detections.vehicles || '0';
                    detectionItems[2].textContent = detailData.detections.objects || '0';
                }
            }
            
            // Update analysis stats if provided
            if (detailData.analysis) {
                const analysisItems = document.querySelectorAll('.detection-count');
                if (analysisItems.length >= 6) {
                    analysisItems[3].textContent = detailData.analysis.confidence || '0%';
                    analysisItems[4].textContent = detailData.analysis.processingTime || '0s';
                    analysisItems[5].textContent = detailData.analysis.itemsAnalyzed || '0';
                }
            }
        }
    };

    // Init
    renderTable();
    setupEventListeners();
};

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.initAlertsPage();
});
