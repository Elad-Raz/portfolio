document.getElementById("fetchBtn").addEventListener("click", () => {
  const apiKey = document.getElementById("apiKey").value.trim();
  const selectedAPI = document.getElementById("apiSelect").value;
  const selectedDate = document.getElementById("dateInput").value;
  const resultDiv = document.getElementById("result");

  resultDiv.innerHTML = "";

  if (!apiKey) {
    resultDiv.innerText = "Please enter a valid API key.";
    return;
  }

  if (!selectedDate) {
    resultDiv.innerText = "Please select a date.";
    return;
  }

  let url = "";

  if (selectedAPI === "apod") {
    url = `https://api.nasa.gov/planetary/apod?date=${selectedDate}&api_key=${apiKey}`;
  } else if (selectedAPI === "mars") {
    url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${selectedDate}&api_key=${apiKey}`;
  } else if (selectedAPI === "epic") {
    const formattedDate = selectedDate.replaceAll("-", "/");
    url = `https://api.nasa.gov/EPIC/api/natural/date/${selectedDate}?api_key=${apiKey}`;
  }

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (selectedAPI === "apod") {
        if (data.url) {
          resultDiv.innerHTML = `<h3>${data.title}</h3><p>${data.date}</p><img src="${data.url}" alt="APOD Image">`;
        } else {
          resultDiv.innerText = "No image found.";
        }
      } else if (selectedAPI === "mars") {
        if (data.photos && data.photos.length > 0) {
          const photo = data.photos[0];
          resultDiv.innerHTML = `<h3>Mars Rover Image</h3><p>${photo.earth_date}</p><img src="${photo.img_src}" alt="Mars Image">`;
        } else {
          resultDiv.innerText = "No Mars images found for this date.";
        }
      } else if (selectedAPI === "epic") {
        if (data.length > 0) {
          const imageName = data[0].image;
          const dateParts = selectedDate.split("-");
          const imageUrl = `https://epic.gsfc.nasa.gov/archive/natural/${dateParts[0]}/${dateParts[1]}/${dateParts[2]}/jpg/${imageName}.jpg`;
          resultDiv.innerHTML = `<h3>Earth Image (EPIC)</h3><p>${selectedDate}</p><img src="${imageUrl}" alt="Earth Image">`;
        } else {
          resultDiv.innerText = "No EPIC images found for this date.";
        }
      }
    })
    .catch((error) => {
      resultDiv.innerText = "An error occurred while fetching data.";
    });
});
