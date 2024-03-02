function validateVenueData(req, res) {
    const err = { message: "Bad Request", errors: {} };
    const { address, city, state, lat, lng } = req.body;
    if (!address) err.errors.address = "Street address is required";
    if (!city) err.errors.city = "City is required";
    if (!state) err.errors.state = "State is required";
    if (lat < -90 || lat > 90)
        err.errors.lat = "Latitude must be within -90 and 90";
    if (lng < -180 || lng > 180)
        err.errors.lng = "Longitude must be within -180 and 180";

    if (Object.keys(err.errors).length) {
        res.status(400).json(err);
        return false;
    } else return true;
}

function validateGroupData(req, res) {
    const err = { message: "Bad Request", errors: {} };
    const { name, about, type, private, city, state } = req.body;
    if (name.split("").length > 60)
        err.errors.name = "Name must be 60 characters or less";
    if (about.split("").length < 50)
        err.errors.about = "About must be 50 characters or more";
    if (type !== "In person" && type !== "Online")
        err.errors.type = "Type must be 'Online' or 'In person'";
    if (typeof private !== "boolean")
        err.errors.private = "Private must be a boolean";
    if (!city) err.errors.city = "City is required";
    if (!state) err.errors.state = "State is required";

    if (Object.keys(err.errors).length) {
        res.status(400).json(err);
        return false;
    } else return true;
}

function validateEventData(req, res) {
    const err = { message: "Bad Request", errors: {} };
    const { name, type, capacity, price, description, startDate, endDate } =
        req.body;
    if (name.split("").length < 5)
        err.errors.name = "Name must be at least 5 characters";
    if (type !== "In person" && type !== "Online")
        err.errors.type = "Type must be 'Online' or 'In person'";
    if (typeof capacity !== "number" || Math.floor(capacity) !== capacity)
        err.errors.capacity = "Capacity must be an integer";
    if (isNaN(parseFloat(price))) err.errors.price = "Price is invalid";
    if (!description) err.errors.description = "Description is required";
    if (startDate < newFormattedDate())
        err.errors.startDate = "Start date must be in the future";
    if (endDate < startDate)
        err.errors.endDate = "End date is less than start date";

    if (Object.keys(err.errors).length) {
        res.status(400).json(err);
        return false;
    } else return true;
}

function newFormattedDate() {
    const dateTimeParts = new Date()
        .toLocaleString("en-US", { hour12: false })
        .split(",");
    const dateParts = dateTimeParts[0].split("/");
    const newDate = [dateParts[2], dateParts[0], dateParts[1]].join("-");
    return [newDate, dateTimeParts[1]].join("");
};

module.exports = { validateVenueData, validateGroupData, validateEventData };
