const photoContainer = document.getElementById('photo-container');
const photographerLink = document.getElementById('photographer-link');
const infoOverlay = document.getElementById('info-overlay');

// Get references to all the info elements
const photoDescription = document.getElementById('photo-description');
const infoLocation = document.getElementById('info-location');
const infoCamera = document.getElementById('info-camera');
const infoAperture = document.getElementById('info-aperture');
const infoFocalLength = document.getElementById('info-focal-length');
const infoExposure = document.getElementById('info-exposure');
const infoIso = document.getElementById('info-iso');

async function fetchConfig() {
  try {
    const response = await fetch('/api/config');
    const config = await response.json();
    return config.refreshInterval * 1000; // convert to milliseconds
  } catch (error) {
    console.error('Error fetching config:', error);
    return 900 * 1000; // default to 15 minutes
  }
}

// Helper to set content if data exists
function setInfo(element, prefix, value, suffix = '') {
  if (value) {
    element.textContent = `${prefix}${value}${suffix}`;
  } else {
    element.textContent = '';
  }
}

async function fetchAndDisplayPhoto() {
  try {
    infoOverlay.classList.remove('visible');
    const response = await fetch('/api/random-photo');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    const img = new Image();
    img.src = data.imageUrl;
    img.onload = () => {
      photoContainer.style.backgroundImage = `url(${data.imageUrl})`;
      photographerLink.href = data.profileUrl;
      photographerLink.textContent = data.photographer;

      // Populate the info overlay
      const { description, location, exif } = data;
      setInfo(photoDescription, '', description);
      setInfo(infoLocation, 'Location: ', location ? location.name : null);
      if (exif) {
        setInfo(infoCamera, 'Camera: ', `${exif.make || ''} ${exif.model || ''}`.trim());
        setInfo(infoAperture, 'Aperture: ', exif.aperture);
        setInfo(infoFocalLength, 'Focal Length: ', exif.focal_length, 'mm');
        setInfo(infoExposure, 'Exposure: ', exif.exposure_time, 's');
        setInfo(infoIso, 'ISO: ', exif.iso);
      }

      // Show the overlay if it has content
      if (description || location || exif) {
        infoOverlay.classList.add('visible');
      }
    };

  } catch (error) {
    console.error('Error fetching photo:', error);
  }
}

async function init() {
  const refreshInterval = await fetchConfig();
  fetchAndDisplayPhoto(); // Initial load
  setInterval(fetchAndDisplayPhoto, refreshInterval);
}

init();