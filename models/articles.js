
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticlesSchema = new Schema ({
    title: {
        type: String,
        required: true,
        index: { unique: true }
    },
    source: {
        type: String,
    },
    teaser: {
        type: String,
    },
    link: {
        type: String,
    },
    img: {
        type: String,
    },
    status: {
        type: Number,
        default: 0
    },
    notes: {
        type: Schema.Types.ObjectId,
        ref: "Notes"
    }
});

var Articles = mongoose.model("Articles", ArticlesSchema);

module.exports = Articles;