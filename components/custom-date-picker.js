document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    flatpickr("#checkin", {
        altInput: true,
        altFormat: "F j, Y", // Format to show in the input box
        dateFormat: "Y-m-d", // Format used internally for data
        minDate: today // Disable all dates before today
    });

    flatpickr("#checkout", {
        altInput: true,
        altFormat: "F j, Y", // Format to show in the input box
        dateFormat: "Y-m-d", // Format used internally for data
        minDate: today // Disable all dates before today
    });
});
