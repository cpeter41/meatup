import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { csrfFetch } from "../../store/csrf";
import "./ConfirmModal.css";

export default function ConfirmModal({ method, type, id }) {
    const { closeModal } = useModal();
    const navigate = useNavigate();

    const confirmDelete = async () => {
        const res = await csrfFetch(
            `/api/${type === "group" ? "groups" : "events"}/${id}`,
            {
                method,
            }
        );

        const message = await res.json().then(closeModal);
        navigate(`/${type === "group" ? "groups" : "events"}`);
        return message;
    };

    return (
        <div id="confirm-modal">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this {type}?</p>
            <button
                id="modal-confirm-button"
                onClick={confirmDelete}
            >{`Yes (Delete ${type === "group" ? "Group" : "Event"})`}</button>
            <button id="modal-cancel-button" onClick={closeModal}>{`No (Keep ${
                type === "group" ? "Group" : "Event"
            })`}</button>
        </div>
    );
}
