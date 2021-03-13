// Include fs module 
const fs = require('fs');

// Create readable stream 
const readable = fs.createReadStream("input/Война и мир. Том 1.txt");

// Handling data event 
readable.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);

  // Calling pause method 
  readable.pause();

  // After this any data will be displayed  
  // after 1 sec. 
  console.log('No further data will be displayed for 3 seconds.');

  // Using setTimeout function 
  setTimeout(() => {
    console.log('Now data starts flowing again.');
    readable.resume();
  }, 3000);
});

// Displays that program  
// is ended 
console.log("Program ends!!");