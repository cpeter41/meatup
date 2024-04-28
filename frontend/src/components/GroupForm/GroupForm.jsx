import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { csrfFetch } from "../../store/csrf";
import { useSelector } from "react-redux";

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
        if (about.length < 30)
            error.about = "Description must be at least 30 characters long";
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
            console.log("update: ", update);
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
        <form onSubmit={onSubmit}>
            <span>BECOME AN ORGANIZER</span>
            <h2>
                We&apos;ll walk you through a few steps to build your local
                community
            </h2>

            <h2>First, set up your group&apos;s location.</h2>
            <label>
                Meetup groups meet locally, in person and online. We&apos;ll
                connect you with people in your area, and more can join you
                online.
                <br />
                <input
                    type="text"
                    name="location"
                    placeholder="City, STATE"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
            </label>
            {errors.location && <span>{errors.location}</span>}

            <h2>What will your group&apos;s name be?</h2>
            <label>
                Choose a name that will give people a clear idea of what the
                group is type. Feel free to get creative! You can edit this
                later if you change your mind.
                <br />
                <input
                    type="text"
                    name="name"
                    placeholder="What is your group name?"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </label>
            {errors.name && <span>{errors.name}</span>}

            <h2> Now describe what your group will be about</h2>
            <label>
                People will see this when we promote your group, but you&apos;ll
                be able to add to it later, too.
                <ol>
                    <li>What&apos;s the purpose of the group?</li>
                    <li>Who should join?</li>
                    <li>What will you do at your events?</li>
                </ol>
                <br />
                <textarea
                    type="text"
                    rows="6"
                    cols="50"
                    name="about"
                    placeholder="Please write at least 30 characters"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                />
            </label>
            {errors.about && <span>{errors.about}</span>}

            <h2>Final Steps...</h2>
            <label>
                Is this an in person or online group?
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option>{""}</option>
                    <option>{"In person"}</option>
                    <option>{"Online"}</option>
                </select>
            </label>
            {errors.groupType && <span>{errors.groupType}</span>}
            <br />

            <label>
                Is this group private or public?
                <select
                    value={isPrivate}
                    onChange={(e) => setPrivate(e.target.value)}
                >
                    <option>{""}</option>
                    <option>{"Private"}</option>
                    <option>{"Public"}</option>
                </select>
            </label>
            {errors.visType && <span>{errors.visType}</span>}
            <br />

            <label>
                Please add in image url for your group below:
                <input
                    type="text"
                    name="previewImage"
                    placeholder="Image Url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                />
            </label>
            {errors.image && <span>{errors.image}</span>}

            <br />
            <button type="submit">{update ? "Update" : "Create"} group</button>
        </form>
    );
}

export default GroupForm;
