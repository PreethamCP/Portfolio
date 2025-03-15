let imageArray = [
  "./attachments/images/projects/portfolio.jpg",
  "./attachments/images/projects/project2.jpg",
  "./attachments/images/projects/project3.png",
];

let index = 0;
let first = document.getElementById("first");
let second = document.getElementById("second");

// Initially set images
first.src = imageArray[0];
second.src = imageArray[1];

setInterval(() => {
  index = (index + 1) % imageArray.length; // Rotate index
  first.src = imageArray[index];
  second.src = imageArray[(index + 1) % imageArray.length]; // Next image
}, 2000);
