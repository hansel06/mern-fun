import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'Root',
  api_key: '119861137148874',
  api_secret: 'dIIBhLBLa1ucqacaORDAMOiaBeI'
});

async function testUpload() {
  try {
    const dataURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    await cloudinary.uploader.upload(dataURI);
    console.log('Success');
  } catch (error) {
    console.log('Error caught!');
    console.log('Message:', error.message);
    console.log('Name:', error.name);
    console.log('Full error:', JSON.stringify(error, null, 2));
  }
}

testUpload();
