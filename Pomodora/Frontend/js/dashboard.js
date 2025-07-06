        // Update datetime
        function updateDateTime() {
            const now = new Date();
            const formatted = now.toLocaleString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            document.querySelector('.datetime').textContent = formatted;
        }

        // Initialize
        updateDateTime();
        setInterval(updateDateTime, 1000);

        // Add interactive elements
        document.addEventListener('DOMContentLoaded', function() {
            const dropdown = document.querySelector('.dropdown');
            dropdown.addEventListener('change', function() {
                console.log('Camera changed to:', this.value);
            });
        });