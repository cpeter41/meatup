function validateVenueData(req) {
    const err = { message: "Bad Request", errors: [] };
    const { address, city, state, lat, lng } = req.body;
    if (!address)
        err.errors.push(`Street address is required`);
    if (!city)
        err.errors.push(`City is required`);
    if (!state)
        err.errors.push(`State is required`);
    if (lat < -90 || lat > 90)
        err.errors.push(`Latitude must be within -90 and 90`);
    if (lng < -180 || lng > 180)
        err.errors.push(`Longitude must be within -180 and 180`);

    if (err.errors.length) res.status(400).json(err);
};

function validateGroupData(req) {
    const err = { message: "Bad Request", errors: [] };
    const { name, about, type, private, city, state } = req.body;
    if (name.split("").length > 60)
        err.errors.push(`Name must be 60 characters or less`);
    if (about.split("").length < 50)
        err.errors.push(`About must be 50 characters or more`);
    if (type !== "In person" && type !== "Online")
        err.errors.push(`Type must be 'Online' or 'In person'`);
    if (typeof private !== "boolean")
        err.errors.push(`Private must be a boolean`);
    if (!city) err.errors.push(`City is required`);
    if (!state) err.errors.push(`State is required`);

    if (err.errors.length) res.status(400).json(err);
}

module.exports = { validateVenueData, validateGroupData }