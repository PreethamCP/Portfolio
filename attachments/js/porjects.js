let imageArray = [
  "./attachments/images/projects/portfolio.jpg",
  "./attachments/images/projects/project2.jpg",
];

let works = document.getElementById("works");

// Ensure the works div exists
if (works) {
  // Create two image elements if not already in HTML
  let first = document.createElement("img");
  first.id = "first";
  first.alt = "Project Image";
  works.appendChild(first);

  let second = document.createElement("img");
  second.id = "second";
  second.alt = "Project Image";
  works.appendChild(second);

  let index = 0;

  // Function to rotate images
  function rotateImages() {
    first.src = imageArray[index];
    index = (index + 1) % imageArray.length; // Rotate index
    second.src = imageArray[index];
  }

  rotateImages(); // Load initial images
  setInterval(rotateImages, 2000); // Change images every 2 seconds
}
