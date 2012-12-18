/////////////////
// Title Model //
/////////////////

var mongoose = require('mongoose')
,	Schema = mongoose.Schema;


////////////
// Schema //
////////////

var TitleSchema = new Schema({

	id: { type: String, required: true, unique: true },
	title: {
		short: { type: String, required: true },
		regular: { type: String, require: true }
	},
	releaseYear: { type: Number, required: true },
	averageRating: { type: Number },
	updated: { type: Number, required: true },
	boxArt: [{ 
		title: { type: String, required: true },
		url: { type: String, required: true }
	}],
	synopsis: { type: String },
	synopsisShort: { type: String },
	people: [{ type: String }],
	similars: { type: String },
	categories: [{ type: String, index: true }]

}, { strict: true });

// export
module.exports = TitleSchema;