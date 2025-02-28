const express = require("express");
const cors = require("cors");
const path = require('path');
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = 4000;

// Enable CORS
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'public' folder
app.use(express.static("public"));

// Serve static files from the node_modules directory
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Ensure the bookings.txt file exists
const filePath = "bookings.txt";
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, "");
}

// API Route to Save Booking Details
app.post("/api/book", (req, res) => {
  console.log("Booking Data:", req.body); // Log the incoming data for debugging

  const booking = req.body;
  const data = `Name: ${booking.name}\nPhone: ${booking.phone}\nClasses: ${JSON.stringify(
    booking.cart
  )}\n\n`;

  fs.appendFile(filePath, data, (err) => {
    if (err) {
      console.error("Error saving booking:", err); // Log the error
      res.status(500).send("Failed to save booking");
    } else {
      res.send("Booking Saved Successfully!");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
