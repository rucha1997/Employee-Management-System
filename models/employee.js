const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    firstname : { type : String, required : true, max : [127, "Max Length is 127 characters"] },
    lastname : { type : String, required : true, max : [127, "Max Length is 127 characters"] },
    age : { type : Number, required : true},
    experience : { type : Number, required : true},
    department: [{ type: Schema.Types.ObjectId, ref: 'Department'}],
    organization: [{ type: Schema.Types.ObjectId, ref: 'Organization'}]

});

module.exports = mongoose.model('Employee', employeeSchema);