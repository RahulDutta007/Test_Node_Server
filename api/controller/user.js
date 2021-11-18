exports.test = async (req, res, next) => {
    console.log("Test API is successfully called!");

    return res.status(200).json({
        message: "Test API is Successfully called!"
    });
};