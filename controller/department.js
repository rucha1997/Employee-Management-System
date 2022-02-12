const Department = require('../models/department');
const Organization = require('../models/organization');
const logger = require('../config/logger');

// Check if department already exist for given organization
const checkDepartmentExist = async (department, organizationId) => {
    const existingDepartment = await Department.findOne({ $and: [{ "department": department }, { "organization": organizationId._id }] });
    if (existingDepartment !== null) { return true }
    return false
}

// create departements under an organization
const addDepartment = async (req, res) => {
    try {
        const organizationId = await Organization.findOne({ "organizationName": req.body.organizationName });
        if (organizationId && organizationId._id) {
            if (Array.isArray(req.body.department)) {
                const departmentBody = []; const presentDepartments = [];
                await Promise.all(Array.from(req.body.department).map(async (departments) => {
                    if (await checkDepartmentExist(departments, organizationId)) {
                        presentDepartments.push(departments);
                    } else {
                        const data = {
                            department: departments,
                            organization: organizationId._id
                        }
                        departmentBody.push(data);
                    }
                }));
                if (presentDepartments.length > 0) {
                    res.status(502).json(presentDepartments + " departments already exists in " + req.body.organizationName + " organization.");
                }
                if (departmentBody.length > 0) {
                    Department.insertMany(departmentBody)
                        .then(() => {
                            res.status(200).json("Departments added successfully!");
                        })
                        .catch((err) => {
                            res.status(504).json('Something went wrong!')
                        })
                }
            } else {
                const department = new Department({
                    department: req.body.department,
                    organization: organizationId._id
                });
                if (checkDepartmentExist(department, organizationId)) {
                    res.status(504).send("Department already exists");
                } else {
                    department.save((err, department) => {
                        if (err) {
                            logger.error(`Error in addDepartment ${err}`);
                            res.status(504).json('Something went wrong!')
                        }
                        res.status(200).json(department.department + " added successfully!");
                    });
                }
            }
        }
    } catch (error) {
        logger.error(`Error in addDepartment ${error}`);
        res.status(504).json('Something went wrong!')
    }
}

module.exports = { addDepartment };