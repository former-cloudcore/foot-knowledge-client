import data from './defaultPresets.json';
import { filterSchema } from './api.interfaces';

export const API_BASE = import.meta.env.MODE === 'development' ? 'http://localhost:80' : '';
export const AUTH_API_BASE = import.meta.env.MODE === 'development' ? 'http://localhost:4000/api' : '';

export const top_left_image = 'https://www.the-sun.com/wp-content/uploads/sites/6/2022/01/NINTCHDBPICT000283898937.jpg';

export const defaultPresets: { [key: string]: filterSchema[] } = data;

// dev = development
// build = production
