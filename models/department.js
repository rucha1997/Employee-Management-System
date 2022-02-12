const mongoose = require('mongoose');
// const Organization = require('../models/organization');
const Schema = mongoose.Schema;

const departmentSchema = new Schema({
    department: { type: String, required: true, max: [127, "Max Length is 127 characters"] },
    organization: [{ type: Schema.Types.ObjectId, ref: 'Organization'}]
});

module.exports = mongoose.model('Department', departmentSchema);