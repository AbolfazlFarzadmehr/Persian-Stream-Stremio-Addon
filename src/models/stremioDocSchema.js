import mongoose from 'mongoose';

const streamSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const stremioDocShema = new mongoose.Schema({
  stremioId: {
    type: String,
    required: [true, 'A stremio document should have a stremioId'],
    unique: true,
  },
  name: {
    type: String,
    default: 'Unknown',
  },
  streams: {
    type: [streamSchema],
    default: [],
  },
  quality: {
    type: String,
    default: 'Unknown',
  },
  releasedYear: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expireAt: {
    type: Date,
    default: undefined,
    index: { expires: 0 },
  },
});

export default stremioDocShema;
