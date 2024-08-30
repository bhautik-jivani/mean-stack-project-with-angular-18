const mongoose = require("mongoose")
const Schema = mongoose.Schema

const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    imagePath: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
})

module.exports = mongoose.model('Post', postSchema)