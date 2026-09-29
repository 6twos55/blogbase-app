import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  FaUser,
  FaTrash,
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaCrown,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const AccountModal = ({ isOpen, onClose }) => {
  const { user, updateAccount, deleteUserAccount } = useAuth();

  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'danger'
  const [username, setUsername] = useState(user?.username || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const smallScreenQuery = window.matchMedia("(max-width: 480px)");
    const updateScreenSize = () => setIsSmallScreen(smallScreenQuery.matches);

    updateScreenSize();
    smallScreenQuery.addEventListener("change", updateScreenSize);
    return () =>
      smallScreenQuery.removeEventListener("change", updateScreenSize);
  }, []);

  if (!isOpen || !user) return null;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!username.trim()) {
      setErrorMsg("Username cannot be empty.");
      return;
    }

    if (newPassword) {
      if (!currentPassword) {
        setErrorMsg(
          "Please enter your current password to set a new password.",
        );
        return;
      }
      if (newPassword.length < 6) {
        setErrorMsg("New password must be at least 6 characters.");
        return;
      }
      if (newPassword !== confirmNewPassword) {
        setErrorMsg("New passwords do not match.");
        return;
      }
    }

    setIsSubmitting(true);
    const result = await updateAccount({
      username: username.trim(),
      currentPassword: currentPassword || undefined,
      newPassword: newPassword || undefined,
    });
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMsg(result.message || "Account updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setTimeout(() => {
        setSuccessMsg("");
      }, 4000);
    } else {
      setErrorMsg(result.error);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText.trim().toLowerCase() !== "delete") {
      setErrorMsg('Please type "delete" to confirm account deletion.');
      return;
    }

    if (
      !window.confirm(
        "Are you 100% sure? All your published stories will also be deleted.",
      )
    ) {
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    const result = await deleteUserAccount();
    setIsSubmitting(false);

    if (result.success) {
      onClose();
      window.alert("Your account has been deleted successfully.");
    } else {
      setErrorMsg(result.error);
    }
  };

  return (
    <div
      className="modalOverlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="accountModalCard" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <div className="modalUserBadge">
            <div className="avatarCircle">
              {user.username.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3>Account Settings</h3>
              <p className="modalSubtitle">
                {user.username}
                {user.isAdmin && (
                  <span className="adminTag">
                    <FaCrown size={11} style={{ marginRight: 4 }} /> Admin
                  </span>
                )}
              </p>
            </div>
          </div>
          <button
            className="btnCloseModal"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <div className="modalTabs">
          <button
            type="button"
            className={`tabButton ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("profile");
              setErrorMsg("");
              setSuccessMsg("");
            }}
          >
            <FaUser size={13} style={{ marginRight: 6 }} /> Edit Profile
          </button>
          <button
            type="button"
            className={`tabButton dangerTab ${activeTab === "danger" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("danger");
              setErrorMsg("");
              setSuccessMsg("");
            }}
          >
            <FaTrash size={13} style={{ marginRight: 6 }} /> Delete Account
          </button>
        </div>

        {successMsg && (
          <div className="alertSuccess">
            <FaCheckCircle
              size={14}
              style={{ marginRight: 8, flexShrink: 0 }}
            />
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="alertError">
            <FaExclamationTriangle
              size={14}
              style={{ marginRight: 8, flexShrink: 0 }}
            />
            {errorMsg}
          </div>
        )}

        {activeTab === "profile" ? (
          <form onSubmit={handleUpdateProfile} className="modalForm">
            <div className="formField">
              <label htmlFor="modalUsername">Username</label>
              <div className="inputWrapper">
                <input
                  id="modalUsername"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div className="divider">
              <span>Change Password (Optional)</span>
            </div>

            <div className="formField">
              <label htmlFor="modalCurrentPass">Current Password</label>
              <div className="inputWrapper">
                <input
                  id="modalCurrentPass"
                  type={showCurrentPass ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="inputCurrentPass"
                  placeholder={
                    isSmallScreen
                      ? "Optional"
                      : "Required only if changing password"
                  }
                />
                <button
                  type="button"
                  className="btnPasswordEye"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  title={showCurrentPass ? "Hide password" : "Show password"}
                >
                  {showCurrentPass ? (
                    <FaEyeSlash size={14} />
                  ) : (
                    <FaEye size={14} />
                  )}
                </button>
              </div>
            </div>

            <div className="formField">
              <label htmlFor="modalNewPass">New Password</label>
              <div className="inputWrapper">
                <input
                  id="modalNewPass"
                  type={showNewPass ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                />
                <button
                  type="button"
                  className="btnPasswordEye"
                  onClick={() => setShowNewPass(!showNewPass)}
                  title={showNewPass ? "Hide password" : "Show password"}
                >
                  {showNewPass ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
            </div>

            {newPassword.length > 0 && (
              <div className="formField">
                <label htmlFor="modalConfirmNewPass">
                  Confirm New Password
                </label>
                <div className="inputWrapper">
                  <input
                    id="modalConfirmNewPass"
                    type={showNewPass ? "text" : "password"}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Re-enter new password"
                  />
                </div>
              </div>
            )}

            <div className="modalFooterActions">
              {/* Cancel hidden on mobile — the X button serves as cancel */}
              <button
                type="button"
                className="btnCancel"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btnSaveProfile"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        ) : (
          <div className="dangerSection">
            <div className="dangerWarningBox">
              <FaExclamationTriangle size={20} className="warningIcon" />
              <div>
                <h4>Permanent Account Deletion</h4>
                <p>
                  Once you delete your account, there is no going back. All your
                  blog stories, comments, and profile data will be permanently
                  removed.
                </p>
              </div>
            </div>

            <div className="formField">
              <label htmlFor="deleteConfirm">
                Type <strong>delete</strong> to confirm:
              </label>
              <input
                id="deleteConfirm"
                type="text"
                placeholder="Type 'delete'"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
              />
            </div>

            <div className="modalFooterActions">
              {/* Cancel hidden on mobile — the X button serves as cancel */}
              <button
                type="button"
                className="btnCancel"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btnDeleteAccount"
                onClick={handleDeleteAccount}
                disabled={
                  isSubmitting ||
                  deleteConfirmText.trim().toLowerCase() !== "delete"
                }
              >
                <FaTrash size={12} style={{ marginRight: 6, flexShrink: 0 }} />
                <span className="deleteLabelFull">
                  {isSubmitting ? "Deleting..." : "Permanently Delete Account"}
                </span>
                <span className="deleteLabelShort">
                  {isSubmitting ? "Deleting..." : "Delete"}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountModal;
