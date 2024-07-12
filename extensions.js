// extensions.js

export const FileUploadExtension = {
  name: 'FileUpload',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_fileUpload' || trace.payload.name === 'ext_fileUpload',
  render: ({ trace, element }) => {
    const fileUploadContainer = document.createElement('div');
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
      <input type='file' id='file-upload-input' name='file-upload-input' style='display: none;'>
    `;

    const fileInput = fileUploadContainer.querySelector('input[type=file]');
    const fileUploadBox = fileUploadContainer.querySelector('.my-file-upload');

    fileUploadBox.addEventListener('click', function () {
      fileInput.click();
    });

    fileInput.addEventListener('change', function () {
      const file = fileInput.files[0];
      console.log('File selected:', file);

      fileUploadContainer.innerHTML = `<img src="https://s3.amazonaws.com/com.voiceflow.studio/share/upload/upload.gif" alt="Upload" width="50" height="50">`;

      const data = new FormData();
      data.append('file', file);
      data.append('mimeType', file.type);
      data.append('fileName', file.name);

      fetch('https://script.google.com/macros/s/AKfycbxUtjdWDQ8nxs7VUII9RHuN_DPDCnFHwTPlv_22fY-D5widC9DXpVtfXS7xk9N90b5r/exec', {
        method: 'POST',
        body: data,
      })
      .then((response) => {
        console.log('Fetch response:', response);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Upload failed: ' + response.statusText);
        }
      })
      .then((result) => {
        console.log('Result:', result);
        if (result.url) {
          fileUploadContainer.innerHTML =
            '<img src="https://s3.amazonaws.com/com.voiceflow.studio/share/check/check.gif" alt​⬤
