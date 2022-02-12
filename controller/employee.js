const Employee = require('../models/employee');
const Organization = require('../models/organization');
const Department = require('../models/department');
const logger = require('../config/logger');

// create employees under a department
const addEmployee = async (req, res) => {
    try {
        const organization = await Organization.findOne({ "organizationName": req.body.organizationName });
        const department = await Department.findOne({ "department": req.body.department });
        if (organization && organization._id && department && department._id) {
            if (Array.isArray(req.body.employee)) {
                await Promise.all(Array.from(req.body.employee).map(async (employee) => {
                    const data = {
                        firstname: employee.firstname,
                        lastname: employee.lastname,
                        age: employee.age,
                        experience: employee.experience,
                        organization: organization._id,
                        department: department._id
                    }
                    await Employee.findOneAndUpdate(data, data, { upsert: true, new: true, setDefaultsOnInsert: true }, (err, employee) => {
                        if (err) {
                            res.status(504).json('Something went wrong!')
                        }
                    }).clone();
                }))
                    .then((response) => {
                        logger.info(`Response while adding multiple employees ${response}.`)
                        res.status(200).json("Employees saved");
                    })
                    .catch((err) => {
                        logger.error(`Error in add many employees ${err}`);
                        res.status(504).json('Something went wrong!')
                    })
            } else {
                const employee = {
                    firstname: req.body.employee.firstname,
                    lastname: req.body.employee.lastname,
                    age: req.body.employee.age,
                    experience: req.body.employee.experience,
                    organization: organization._id,
                    department: department._id
                };
                // save model to database
                Employee.findOneAndUpdate(employee, employee, { multi: true, upsert: true, new: true, setDefaultsOnInsert: true }, (err, employee) => {
                    if (err) {
                        logger.error(`Error in addEmployee:: findOneandUpdate ${err}`);
                        res.status(504).json('Something went wrong!')
                    }
                    res.status(200).json(employee.firstname + employee.lastname + " saved to Employee collection.");
                });
            }
        } else {
            res.status(504).json('Something went wrong!')
        }
    } catch (error) {
        logger.error(`Erorr in addEmployee ${error}`);
        res.status(504).json('Something went wrong!')
    }
}

// retrieve employees under a department
const getAllEmployee = async (req) => {
    return new Promise(async (resolve, reject) => {
        if (req.query.Organization) {
            const organization = await Organization.findOne({ "organizationName": req.query.Organization });
            if (req.query.Department) {
                const department = await Department.findOne({ "department": req.query.Department });
                if (req.query.FirstName) {
                    Employee.find({ $and: [{ "department": department._id }, { "organization": organization._id }, { "firstname": req.query.FirstName }] }, (err, employees) => {
                        if (err) {
                            logger.error(`Error in getAllEmployee::find with FirstName, Department, Organization ${err}`);
                            reject(err);
                        }
                        resolve(employees);
                    })
                } else {
                    Employee.find({ $and: [{ "department": department._id }, { "organization": organization._id }] }, (err, employees) => {
                        if (err) {
                            logger.error(`Error in getAllEmployee::find with Department, Organization ${err}`);
                            reject(err);
                        }
                        resolve(employees);
                    })
                }
            } else {
                Employee.find({ "organization": organization._id }, (err, employees) => {
                    if (err) {
                        logger.error(`Error in getAllEmployee::find with only Organization ${err}`);
                        reject(err);
                    }
                    resolve(employees);
                })
            }
        } else {
            Employee.find({}, (err, employees) => {
                if (err) {
                    logger.error(`Error in getAllEmployee::find (No parameters passed) ${err}`);
                    reject(err);
                }
                resolve(employees);
            })
        }
    })
}

module.exports = { addEmployee, getAllEmployee };