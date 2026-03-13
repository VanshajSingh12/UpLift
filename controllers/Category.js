const Category = require("../models/Category");

//create tag handler function
exports.createCategory = async (requestAnimationFrame, res) => {
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
        const CategoryDetails = await Category.create({
            name: name,
            description: description,
            //not entered courses here, will do that while creating course
        });
        console.log(tagDetails);

        return res.status(200).json({
            success: true,
            message: "Category created successfully",
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
exports.showAllCategory = async (req, res) => {
    try {
        const allCategories = await Category.find({}, { name: true, description: true });
        res.status(200).json({
            success: true,
            message: "All categories are returned successfully",
            allCategories,
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
