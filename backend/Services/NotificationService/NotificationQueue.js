const io = require('../../Config/Socket'); // Assuming you have socket.io set up

class NotificationQueue {
    constructor(io) {
        this.io = io; // Store the io instance
        this.queue = [];
        this.isProcessing = false;
    }

    // Method to add a notification to the queue
    addNotification(notification) {
        console.log(`Adding notification: ${notification.event}`);
        this.queue.push(notification);
        this.processQueue();
    }

    // Method to process the notification queue
    async processQueue() {
        if (this.isProcessing) return; // Prevent concurrent processing
        this.isProcessing = true;

        while (this.queue.length > 0) {
            const notification = this.queue.shift(); // Get the first notification
            console.log(`Processing notification: ${notification.event}`);
            await this.sendNotification(notification); // Send the notification
        }

        this.isProcessing = false; // Reset processing flag
    }

    // Method to send a notification
    sendNotification({ event, data }) {
        return new Promise((resolve) => {
            this.io.emit(event, data); // Use the stored io instance
            console.log(`Notification sent: ${event}`, data);
            resolve();
        });
    }
}

module.exports = NotificationQueue; // Ensure this is correct
