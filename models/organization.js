const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const organizationSchema = new Schema({
    organizationName: { type: String, required: true, max: [127, "Max Length is 127 characters"], unique: true }
});

module.exports = mongoose.model('Organization', organizationSchema);