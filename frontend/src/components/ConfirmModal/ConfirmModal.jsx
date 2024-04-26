import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { csrfFetch } from "../../store/csrf";

export default function ConfirmModal({ mode, id }) {
    const { closeModal } = useModal();
    const navigate = useNavigate();

    const confirmDelete = async () => {
        const res = await csrfFetch(`/api/groups/${id}`, {
            method: "DELETE",
        });

        const message = await res.json().then(closeModal);
        navigate("/groups");
        return message;
    };

    return (
        mode === "delete" && (
            <>
                <h1>Confirm Delete</h1>
                <p>Are you sure you want to remove this group?</p>
                <button onClick={confirmDelete}>{"Yes (Delete Group)"}</button>
                <button onClick={closeModal}>{"No (Keep Group)"}</button>
            </>
        )
    );
}
