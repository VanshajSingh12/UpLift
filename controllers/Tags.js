const Tag = require("../models/tags");

//create tag handler function
exports.createTag = async (requestAnimationFrame, res) => {
    try {
        //fetch data from req of admin
        const { name, description } = req.body;
        //validation
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required for creating Tag'
            })
        }
        //create entry of tag in DB
        const tagDetails = await Tag.create({
            name: name,
            description: description,
            //not entered courses here, will do that while creating course
        });
        console.log(tagDetails);

        return res.status(200).json({
            success: true,
            message: "Tag created successfully",
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

//getAlltags handler function
exports.showAllTags = async (req, res) => {
    try {
        const allTags = await Tag.find({}, { name: true, description: true });
        res.status(200).json({
            success: true,
            message: "All tags are returned successfully",
            allTags,
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
