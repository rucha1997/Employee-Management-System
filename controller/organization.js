const Organization = require('../models/organization');
const logger = require('../config/logger');

// Create an organization
const addOrganization = async (req, res) => {
    try {
        const organization = new Organization({
            organizationName: req.body.organizationName
        });
        await Organization.findOne({ "organizationName": req.body.organizationName }, (err, existingOrganization) => {
            if (err) {
               logger.error(`Error in addOrganization::findone ${err}`);
                res.status(504).json('Something went wrong!')
            }
            if (existingOrganization) {
                res.status(502).json('Organization already exists.')
            } else {
                organization.save((err, organization) => {
                    if (err) {
                        logger.error(`Error in addOrganization::save ${err}`);
                        res.status(504).json('Something went wrong!')
                    }
                    res.status(200).json(organization.organizationName + " added successfully!");
                });
            }
        }).clone();
    } catch (error) {
        logger.error(`Error in addOrganization ${error}`);
        res.status(504).json('Something went wrong!')
    }
}

// Updates the name of the organization
const updateOrganization = async (req, res) => {
    try {
        await Organization.findOneAndUpdate({ organizationName: req.body.oldName }, { organizationName: req.body.newname }, null, (err, existingOrganization) => {
            if (err) {
                logger.error(`Error in updateOrganization::findOneAndUpdate ${err}`);
                res.status(504).json('Something went wrong!')
            }
            res.status(200).json('Organization created successfully!');
        }).clone();
    } catch (error) {
        logger.error(`Error in updateOrganization ${error}`);
        res.status(504).json('Something went wrong!')
    }
}
module.exports = { addOrganization, updateOrganization };
