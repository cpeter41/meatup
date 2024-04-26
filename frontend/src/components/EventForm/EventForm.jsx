import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGroupDetails } from "../../store/group";
import { csrfFetch } from "../../store/csrf";

// placeholder values for POST req since venues dont exist as a feature yet
const DEFAULT_VENUE_ID = 1;
const DEFAULT_CAPACITY = 20;

export default function EventForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { groupId } = useParams();
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [price, setPrice] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [image, setImage] = useState("");
    const [desc, setDesc] = useState("");
    const [isValidId, setIsValidId] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isNaN(groupId)) setIsValidId(false);
        else setIsValidId(true);

        if (isValidId) dispatch(getGroupDetails(groupId));
    }, [dispatch, groupId, isValidId]);

    const group = useSelector((state) => state.groups.groupDetails);
    // const userId = useSelector((state) => state.session.user.id);

    async function onSubmit(e) {
        e.preventDefault();
        const error = {}; // note: NOT the same as 'errors' controlled variable
        if (name === "") error.name = "Name is required";
        if (type === "") error.type = "Type is required";
        if (price === "") error.price = "Price is required";
        if (startDate === "") error.startDate = "Event start is required";
        if (endDate === "") error.endDate = "Event end is required";
        if (name === "") error.name = "Name is required";

        const fileExt = image.slice(image.lastIndexOf("."));
        if (fileExt !== ".jpg" && fileExt !== ".jpeg" && fileExt !== ".png")
            error.image = "Image URL must end in .png, .jpg, or .jpeg";

        if (desc.length < 30)
            error.desc = "Description must be at least 30 characters long";

        setErrors(error);
        if (!Object.keys(error).length) {
            // skip redux, send directly
            console.log({
                name,
                type,
                price,
                description: desc,
                startDate,
                endDate,
                venueId: DEFAULT_VENUE_ID,
                capacity: DEFAULT_CAPACITY,
            });

            const res = await csrfFetch(`/api/groups/${groupId}/events`, {
                method: "POST",
                body: JSON.stringify({
                    name,
                    type,
                    price,
                    description: desc,
                    startDate,
                    endDate,
                    venueId: DEFAULT_VENUE_ID,
                    capacity: DEFAULT_CAPACITY,
                }),
            });

            const newEvent = await res.json();

            await csrfFetch(`/api/events/${newEvent.id}/images`, {
                method: "POST",
                body: JSON.stringify({
                    url: image,
                    preview: true,
                }),
            });

            navigate(`/events/${newEvent.id}`);
        }
    }

    return (
        <form onSubmit={onSubmit}>
            {group && <h1>Create an event for {group.name}</h1>}
            <label>
                <h2>What is the name of your event?</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Event Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </label>
            {errors.name && <span>{errors.name}</span>}
            <label>
                <h2>Is this an in person or online event?</h2>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option>{""}</option>
                    <option>{"In person"}</option>
                    <option>{"Online"}</option>
                </select>
            </label>
            {errors.type && <span>{errors.type}</span>}

            <label>
                <h2>What is the price for your event?</h2>
                <span>$</span>
                <input
                    type="text"
                    name="price"
                    placeholder="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
            </label>
            {errors.price && <span>{errors.price}</span>}

            <label>
                <h2>When does your event start?</h2>
                <input
                    type="datetime-local"
                    name="startTime"
                    value={startDate}
                    onChange={(e) => {
                        const dateTime = e.target.value.split("T");
                        const newDate = dateTime[0].concat(
                            " ",
                            dateTime[1],
                            ":00"
                        );
                        setStartDate(newDate);
                    }}
                />
            </label>
            {errors.startDate && <span>{errors.startDate}</span>}

            <label>
                <h2>When does your event end?</h2>
                <input
                    type="datetime-local"
                    name="endTime"
                    value={endDate}
                    onChange={(e) => {
                        const dateTime = e.target.value.split("T");
                        const newDate = dateTime[0].concat(
                            " ",
                            dateTime[1],
                            ":00"
                        );
                        setEndDate(newDate);
                    }}
                />
            </label>
            {errors.endDate && <span>{errors.endDate}</span>}

            <label>
                <h2>Please add in image url for your event below:</h2>
                <input
                    type="text"
                    name="previewImage"
                    placeholder="Image URL"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                />
            </label>
            {errors.image && <span>{errors.image}</span>}

            <label>
                <h2>Please describe your event:</h2>
                <textarea
                    type="text"
                    cols="60"
                    rows="8"
                    name="desc"
                    placeholder="Please include at least 30 characters"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                />
            </label>
            {errors.desc && <span>{errors.desc}</span>}

            <br />
            <button type="submit">Create Event</button>
        </form>
    );
}
