import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGroupDetails } from "../../store/group";
import { csrfFetch } from "../../store/csrf";
import "./EventForm.css";

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
    
    const group = useSelector((state) => state.groups.groupDetails);
    const userId = useSelector((state) => state.session?.user?.id);

    useEffect(() => {
        if (isNaN(groupId)) setIsValidId(false);
        else setIsValidId(true);

        if (isValidId) dispatch(getGroupDetails(groupId));

        if (userId !== group.organizerId) navigate(`/groups/${groupId}`);
    }, [dispatch, groupId, isValidId]);


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
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <form onSubmit={onSubmit} id="event-form">
                {group && <h1>Create a new event for {group.name}</h1>}
                <label>
                    <p>What is the name of your event?</p>
                    <input
                        type="text"
                        name="name"
                        placeholder="Event Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>
                <br />
                {errors.name && (
                    <span className="error-msg">{errors.name}</span>
                )}
                <hr />
                <label>
                    {/* TODO: check if blank first option is OK */}
                    <p>Is this an in-person or online event?</p>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option>{""}</option>
                        <option>{"In person"}</option>
                        <option>{"Online"}</option>
                    </select>
                </label>
                <br />
                {errors.type && (
                    <span className="error-msg">{errors.type}</span>
                )}

                <label>
                    <p>What is the price for your event?</p>
                    <input
                        type="text"
                        name="price"
                        placeholder="0"
                        value={price}
                        id="price-input"
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    <span
                        style={{
                            position: "relative",
                            right: "200px",
                        }}
                    >
                        $
                    </span>
                </label>
                <br />
                {errors.price && (
                    <span className="error-msg">{errors.price}</span>
                )}
                <hr />

                <label>
                    <p>When does your event start?</p>
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
                <br />
                {errors.startDate && (
                    <span className="error-msg">{errors.startDate}</span>
                )}

                <label>
                    <p>When does your event end?</p>
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
                <br />
                {errors.endDate && (
                    <span className="error-msg">{errors.endDate}</span>
                )}
                <hr />

                <label>
                    <p>Please add in image url for your event below:</p>
                    <input
                        type="text"
                        name="previewImage"
                        placeholder="Image URL"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                    />
                </label>
                <br />
                {errors.image && (
                    <span className="error-msg">{errors.image}</span>
                )}
                <hr />

                <label>
                    <p>Please describe your event:</p>
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
                <br />
                {errors.desc && (
                    <span className="error-msg">{errors.desc}</span>
                )}

                <br />
                <button type="submit">Create Event</button>
            </form>
        </div>
    );
}
