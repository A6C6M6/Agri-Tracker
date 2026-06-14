const ctx = document.getElementById('yieldChart').getContext('2d');
new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr'],
        datasets: [{
            label: 'Crop Yield',
            data: [12, 19, 3, 5],
            borderColor: '#22c55e',
            tension: 0.4
        }]
    },
    options: { responsive: true, maintainAspectRatio: false }
});