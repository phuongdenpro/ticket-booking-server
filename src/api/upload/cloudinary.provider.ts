import { v2 } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'Cloudinary',
  useFactory() {
    return v2.config({
      cloud_name: 'dangdan2807',
      api_key: '275291133989876',
      api_secret: 'y9C2RPdrzLxPH4-p_Z-V3bKtsJs',
    });
  },
};
