import mongoose from 'mongoose';
import stremioDocSchema from './stremioDocSchema.js';

export const Film2Media = mongoose.model('Film2Media', stremioDocSchema);
export const IranProvider = mongoose.model('IranProvider', stremioDocSchema);
export const DonyayeSerial = mongoose.model('DonyayeSerial', stremioDocSchema);
