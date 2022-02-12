const express = require('express');
const router = express.Router();
const { addEmployee, getAllEmployee } = require('../controller/employee');
const { addOrganization, updateOrganization } = require('../controller/organization');
const { addDepartment } = require('../controller/department');

// Create an organization
router.post('/createOrganization', async function (req, res) {
  await addOrganization(req, res);
});

// create departements under an organization
router.post('/createDepartments', async function (req, res) {
  await addDepartment(req, res);
});

// create employees under a department
router.post('/createEmployee', function (req, res, next) {
  addEmployee(req, res);
});

// retrieve employees under a department
router.get('/getAllEmployees', async function (req, res, next) {
  const employees = await getAllEmployee(req, res).catch (error => {
    console.log('Error in get all employees', error)
    res.status(504).json('Something went wrong!')
  })
  res.status(200).json(employees);
});

// Updates the name of the organization
router.put('/renameOrganization', async function(req, res) {
  await updateOrganization(req, res);
})
module.exports = router;
