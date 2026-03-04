import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export default {
  datasource: {
    url: process.env.DB_MAIN_URL
  }
};
