// extensions.js

export const FileUploadExtension = {
  name: 'FileUpload',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_fileUpload' || trace.payload.name === 'ext_fileUpload',
  render: ({ trace, element }) => {
    const fileUploadContainer = document.createElement('div')
    fileUploadContainer.innerHTML = `
      <style>
        .my-file-upload {
          border: 2px dashed rgba(46, 110, 225, 0.3);
          padding: 20px;
          text-align: center;
          cursor: pointer;
        }
      </style>
      <div class='my-file-upload'>Drag and drop a file here or click to upload</div>
      <input type='file' style='display: none;'>
    `

    const fileInput = fileUploadContainer.querySelector('input[type=file]')
    const fileUploadBox = fileUploadContainer.querySelector('.my-file-upload')

    fileUploadBox.addEventListener('click', function () {
      fileInput.click()
    })

    fileInput.addEventListener('change', function () {
      const file = fileInput.files[0]
      console.log('File selected:', file)

      fileUploadContainer.innerHTML = `<img src="https://s3.amazonaws.com/com.voiceflow.studio/share/upload/upload.gif" alt="Upload" width="50" height="50">`

      var data = new FormData()
      data.append('file', file)

      fetch('https://script.google.com/macros/s/AKfycbwD3liiURpZfQwE3KJPoBFFpgbDtyVsUolv6dZkS6fvXxmn7Uio90fuo5R-iYNAATz2/exec', {
        method: 'POST',
        body: data,
      })
        .then((response) => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error('Upload failed: ' + response.statusText)
          }
        })
        .then((result) => {
          fileUploadContainer.innerHTML =
            '<img src="https://s3.amazonaws.com/com.voiceflow.studio/share/check/check.gif" alt="Done" width="50" height="50">'
          console.log('File uploaded:', result.url)
          window.voiceflow.chat.interact({
            type: 'complete',
            payload: {
              file: result.url,
            },
          })
        })
        .catch((error) => {
          console.error(error)
          fileUploadContainer.innerHTML = '<div>Error during upload</div>'
        })
    })

    element.appendChild(fileUploadContainer)
  },
}

// Initialize custom commands and extensions
function handleCustomCommand(command) {
  console.log('Handling custom command:', command);
  if (command === 'showUploadButton') {
    const fileUploadBox = document.querySelector('.my-file-upload');
    if (fileUploadBox) {
      fileUploadBox.style.display = 'block';
      console.log('Upload button displayed.');
    } else {
      console.log('Upload button not found.');
    }
  } else {
    console.log('Unknown command:', command);
  }
}

// Listen for custom commands from Voiceflow via postMessage
window.addEventListener('message', (event) => {
  console.log('Received message:', event.data);
  if (event.data && event.data.command) {
    handleCustomCommand(event.data.command);
  } else {
    console.log('No command in message:', event.data);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  console.log('Document loaded.');
  const checkChatLoaded = setInterval(() => {
    const chatIframe = document.querySelector('#voiceflow-chat iframe');
    if (chatIframe) {
      clearInterval(checkChatLoaded);
      console.log('Chat iframe loaded.');
    }
  }, 1000);
});
