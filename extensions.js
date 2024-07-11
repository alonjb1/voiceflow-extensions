// extensions.js

// Function to handle file upload
function handleFileUpload(event) {
  const fileInput = event.target.files[0];
  
  if (fileInput) {
    const reader = new FileReader();
    reader.onload = function() {
      const base64Data = reader.result.split(',')[1];
      const formData = new URLSearchParams();
      formData.append('file', base64Data);
      formData.append('mimeType', fileInput.type);
      formData.append('fileName', fileInput.name);

      fetch('https://script.google.com/macros/s/AKfycbwD3liiURpZfQwE3KJPoBFFpgbDtyVsUolv6dZkS6fvXxmn7Uio90fuo5R-iYNAATz2/exec', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.url) {
          console.log('File uploaded successfully:', data.url);
          window.voiceflow.chat.sendText('File uploaded successfully!');
        } else {
          console.error('Error uploading file:', data.error);
          window.voiceflow.chat.sendText('Error uploading file.');
        }
      })
      .catch(error => {
        console.error('Error uploading file:', error);
        window.voiceflow.chat.sendText('Error uploading file.');
      });
    };
    reader.readAsDataURL(fileInput);
  }
}

// Function to initialize the file input and handle file selection
function initFileUpload() {
  const chatWindow = document.querySelector('#voiceflow-chat');
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.style.display = 'none';
  fileInput.addEventListener('change', handleFileUpload);

  const uploadButton = document.createElement('button');
  uploadButton.textContent = 'Upload File';
  uploadButton.style.display = 'none'; // Initially hidden
  uploadButton.addEventListener('click', () => fileInput.click());
  uploadButton.id = 'upload-file-button';

  chatWindow.appendChild(fileInput);
  chatWindow.appendChild(uploadButton);
}

// Show the upload button when a specific message is received
function handleCustomCommand(command) {
  if (command === 'showUploadButton') {
    const uploadButton = document.getElementById('upload-file-button');
    if (uploadButton) {
      uploadButton.style.display = 'block';
    }
  }
}

// Wait for the Voiceflow chat widget to load and then initialize the file upload
document.addEventListener('DOMContentLoaded', () => {
  const checkChatLoaded = setInterval(() => {
    if (window.voiceflow && window.voiceflow.chat) {
      clearInterval(checkChatLoaded);
      initFileUpload();

      // Listen for custom commands from Voiceflow
      window.voiceflow.chat.on('customCommand', (data) => {
        if (data.command) {
          handleCustomCommand(data.command);
        }
      });
    }
  }, 1000);
});
