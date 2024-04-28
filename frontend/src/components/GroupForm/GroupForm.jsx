import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { csrfFetch } from "../../store/csrf";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import "./GroupForm.css";

function GroupForm({ update }) {
    const [location, setLocation] = useState("");
    const [name, setName] = useState("");
    const [about, setAbout] = useState("");
    const [type, setType] = useState("");
    const [isPrivate, setPrivate] = useState("");
    const [image, setImage] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const group = useSelector((state) => state.groups.groupDetails);
    useEffect(() => {
        if (group && update) {
            setName(group.name);
            setLocation([group.city, group.state].join(", "));
            setAbout(group.about);
            setType(group.type);
            setPrivate(group.private ? "Private" : "Public");
            const prevImg = group.GroupImages.find((img) => img.preview);
            if (prevImg) setImage(prevImg.url);
        }
    }, [update, group]);

    async function onSubmit(e) {
        e.preventDefault();
        const error = {}; // note: NOT the same as 'errors' controlled variable
        const locationArr = location.split(", ");

        if (location === "") error.location = "Location is required";
        else if (locationArr.length !== 2)
            error.location =
                "Incorrect location format (City, STATE) e.g. Los Angeles, CA";
        if (name === "") error.name = "Name is required";
        if (about.length < 50)
            error.about = "Description must be at least 50 characters long";
        if (type === "") error.groupType = "Group Type is required";
        if (isPrivate === "") error.visType = "Visibility Type is required";

        const fileExt = image.slice(image.lastIndexOf("."));
        if (!update) {
            if (fileExt !== ".jpg" && fileExt !== ".jpeg" && fileExt !== ".png")
                error.image = "Image URL must end in .png, .jpg, or .jpeg";
        } else if (
            image !== "" &&
            fileExt !== ".jpg" &&
            fileExt !== ".jpeg" &&
            fileExt !== ".png"
        )
            error.image = "Image URL must end in .png, .jpg, or .jpeg";

        setErrors(error); // 'sync' current scoped error to controlled var
        if (!Object.keys(error).length) {
            const method = update ? "PUT" : "POST";

            const res = await csrfFetch(
                `/api/groups${update ? `/${group.id}` : ""}`,
                {
                    method,
                    body: JSON.stringify({
                        name,
                        about,
                        type,
                        private: isPrivate === "Private",
                        city: locationArr[0],
                        state: locationArr[1],
                    }),
                }
            );

            const newGroup = await res.json();

            if (update) {
                const getRes = await csrfFetch(`/api/groups/${newGroup.id}`);
                const getGroup = await getRes.json();
                if (getGroup.id !== group.id) {
                    const prevImg = getGroup?.GroupImages.find(
                        (img) => img.preview
                    );
                    if (prevImg)
                        await csrfFetch(`/api/group-images/${prevImg.id}`, {
                            method: "DELETE",
                        });
                }
            }

            await csrfFetch(`/api/groups/${newGroup.id}/images`, {
                method: "POST",
                body: JSON.stringify({
                    url: image,
                    preview: true,
                }),
            });

            navigate(`/groups/${newGroup.id}`);
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
            <Helmet>
                <title>Start a new Group</title>
            </Helmet>
            <form onSubmit={onSubmit} id="group-form">
                <span style={{ color: "teal", fontWeight: "600" }}>
                    BECOME AN ORGANIZER
                </span>
                <h2>
                    We&apos;ll walk you through a few steps to build your local
                    meat community.
                </h2>
                <hr />
                <h2>Set your group&apos;s location.</h2>
                <label>
                    meatup groups meet locally, in person, and online.
                    We&apos;ll connect you with people in your area.
                    <br />
                    <input
                        type="text"
                        name="location"
                        placeholder="City, STATE"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    {errors.location && (
                        <p
                            style={{
                                color: "rgb(242, 97, 78)",
                                marginTop: "10px",
                            }}
                        >
                            {errors.location}
                        </p>
                    )}
                </label>
                <hr />
                <h2>What will your group&apos;s name be?</h2>
                <label>
                    Choose a name that will give people a clear idea of what the
                    group is about. Feel free to get creative! You can edit this
                    later if you change your mind.
                    <br />
                    <input
                        type="text"
                        name="name"
                        placeholder="What is your group name?"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && (
                        <p
                            style={{
                                color: "rgb(242, 97, 78)",
                                marginTop: "10px",
                            }}
                        >
                            {errors.name}
                        </p>
                    )}
                </label>
                <hr />
                <h2>Describe the purpose of your group.</h2>
                <label>
                    People will see this when we promote your group, but
                    you&apos;ll be able to add to it later, too.
                    <ol style={{ marginBottom: "0" }}>
                        <li>What&apos;s the purpose of the group?</li>
                        <li>Who should join?</li>
                        <li>What will you do at your events?</li>
                    </ol>
                    <br />
                    <textarea
                        type="text"
                        rows="6"
                        cols="52"
                        name="about"
                        placeholder="Please write at least 50 characters"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                    />
                    {errors.about && (
                        <p
                            style={{
                                color: "rgb(242, 97, 78)",
                                marginBottom: "0",
                            }}
                        >
                            {errors.about}
                        </p>
                    )}
                </label>

                <hr />
                <h2>Final Steps...</h2>
                <div id="final-steps">
                    <label>Is this an in-person or online group?</label>
                    <br />
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option>{""}</option>
                        <option>{"In person"}</option>
                        <option>{"Online"}</option>
                    </select>
                    {errors.groupType && (
                        <p
                            style={{
                                color: "rgb(242, 97, 78)",
                                marginTop: "0",
                            }}
                        >
                            {errors.groupType}
                        </p>
                    )}
                    <br />

                    <label>Is this group private or public?</label>
                    <br />
                    <select
                        value={isPrivate}
                        onChange={(e) => setPrivate(e.target.value)}
                    >
                        <option>{""}</option>
                        <option>{"Private"}</option>
                        <option>{"Public"}</option>
                    </select>
                    {errors.visType && (
                        <p
                            style={{
                                color: "rgb(242, 97, 78)",
                                marginTop: "0",
                            }}
                        >
                            {errors.visType}
                        </p>
                    )}
                    <br />

                    <label>Please add an image url for your group below:</label>
                    <br />
                    <input
                        type="text"
                        name="previewImage"
                        placeholder="Image Url"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                    />
                    {errors.image && (
                        <p
                            style={{
                                color: "rgb(242, 97, 78)",
                                marginTop: "0",
                            }}
                        >
                            {errors.image}
                        </p>
                    )}
                </div>

                <hr />
                <button type="submit">
                    {update ? "Update" : "Create"} group
                </button>
            </form>
        </div>
    );
}

export default GroupForm;
