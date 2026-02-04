// src/components/groups/GroupSettingsModal.jsx
import React, { useState, useEffect } from 'react';
import {
  FiX, FiEdit2, FiUsers, FiUserPlus, FiUserMinus,
  FiImage, FiSave, FiLogOut, FiShield, FiTrash2
} from 'react-icons/fi';
import './GroupSettingsModal.css';

const GroupSettingsModal = ({ isOpen, onClose, group, onUpdateGroup, onLeaveGroup, availableContacts }) => {
  const [activeTab, setActiveTab] = useState('info'); // 'info', 'members'
  const [isEditing, setIsEditing] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupAvatar, setGroupAvatar] = useState('');
  const [members, setMembers] = useState([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize state when group changes
  useEffect(() => {
    if (group) {
      setGroupName(group.name || '');
      setGroupDescription(group.description || '');
      setGroupAvatar(group.avatar || '');
      setMembers(group.members || []);
    }
  }, [group]);

  // Filter available contacts (exclude current members)
  const availableToAdd = availableContacts?.filter(
    contact => !members.find(m => m.id === contact.id)
  ).filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Handle save changes
  const handleSave = () => {
    if (!groupName.trim()) {
      alert('Vui lòng nhập tên nhóm');
      return;
    }

    const updatedGroup = {
      ...group,
      name: groupName,
      description: groupDescription,
      avatar: groupAvatar,
      members: members
    };

    onUpdateGroup(updatedGroup);
    setIsEditing(false);
    alert('Đã cập nhật thông tin nhóm');
  };

  // Handle add member
  const handleAddMember = (contact) => {
    setMembers([...members, { ...contact, role: 'Thành viên' }]);
    setSearchQuery('');
    setShowAddMember(false);
  };

  // Handle remove member
  const handleRemoveMember = (memberId) => {
    if (window.confirm('Bạn có chắc muốn xóa thành viên này khỏi nhóm?')) {
      setMembers(members.filter(m => m.id !== memberId));
    }
  };

  // Handle leave group
  const handleLeaveGroup = () => {
    if (window.confirm('Bạn có chắc muốn rời khỏi nhóm này?')) {
      onLeaveGroup(group.id);
      onClose();
    }
  };

  // Handle close
  const handleClose = () => {
    setIsEditing(false);
    setShowAddMember(false);
    setSearchQuery('');
    onClose();
  };

  if (!isOpen || !group) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="group-settings-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="group-header-info">
            <div className="group-avatar-large">{group.avatar}</div>
            <div>
              <h2>{group.name}</h2>
              <p>{members.length + 1} thành viên</p>
            </div>
          </div>
          <button className="btn-close" onClick={handleClose}>
            <FiX />
          </button>
        </div>

        {/* Tabs */}
        <div className="settings-tabs">
          <button
            className={`tab ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <FiEdit2 />
            Thông tin
          </button>
          <button
            className={`tab ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => setActiveTab('members')}
          >
            <FiUsers />
            Thành viên
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {activeTab === 'info' ? (
            // Info Tab
            <div className="info-tab">
              {isEditing ? (
                // Edit Mode
                <div className="edit-form">
                  <div className="avatar-edit-section">
                    <div className="group-avatar-preview">{groupAvatar}</div>
                    <button className="btn-change-avatar">
                      <FiImage />
                      Thay đổi ảnh nhóm
                    </button>
                  </div>

                  <div className="form-group">
                    <label>Tên nhóm *</label>
                    <input
                      type="text"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="form-input"
                      maxLength={50}
                    />
                    <span className="char-count">{groupName.length}/50</span>
                  </div>

                  <div className="form-group">
                    <label>Mô tả nhóm</label>
                    <textarea
                      value={groupDescription}
                      onChange={(e) => setGroupDescription(e.target.value)}
                      className="form-textarea"
                      rows="4"
                      maxLength={200}
                    />
                    <span className="char-count">{groupDescription.length}/200</span>
                  </div>

                  <div className="edit-actions">
                    <button className="btn-secondary" onClick={() => setIsEditing(false)}>
                      Hủy
                    </button>
                    <button className="btn-primary" onClick={handleSave}>
                      <FiSave />
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="info-view">
                  <div className="info-item">
                    <label>Tên nhóm</label>
                    <p>{group.name}</p>
                  </div>

                  <div className="info-item">
                    <label>Mô tả</label>
                    <p>{group.description || 'Chưa có mô tả'}</p>
                  </div>

                  <div className="info-item">
                    <label>Ngày tạo</label>
                    <p>{group.createdDate || 'Không rõ'}</p>
                  </div>

                  <div className="info-item">
                    <label>Tổng số thành viên</label>
                    <p>{members.length + 1} người</p>
                  </div>

                  <button className="btn-edit" onClick={() => setIsEditing(true)}>
                    <FiEdit2 />
                    Chỉnh sửa thông tin
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Members Tab
            <div className="members-tab">
              <div className="members-header">
                <h3>
                  <FiUsers /> Danh sách thành viên ({members.length + 1})
                </h3>
                <button
                  className="btn-add-member"
                  onClick={() => setShowAddMember(!showAddMember)}
                >
                  <FiUserPlus />
                  Thêm thành viên
                </button>
              </div>

              {/* Add Member Section */}
              {showAddMember && (
                <div className="add-member-section">
                  <input
                    type="text"
                    placeholder="Tìm kiếm để thêm thành viên..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  {searchQuery && (
                    <div className="search-results">
                      {availableToAdd.length > 0 ? (
                        availableToAdd.map(contact => (
                          <div
                            key={contact.id}
                            className="search-result-item"
                            onClick={() => handleAddMember(contact)}
                          >
                            <div className="result-avatar">{contact.avatar}</div>
                            <div className="result-info">
                              <div className="result-name">{contact.name}</div>
                              <div className="result-role">{contact.role}</div>
                            </div>
                            <button className="btn-add-icon">
                              <FiUserPlus />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="no-results">Không tìm thấy người dùng</div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Members List */}
              <div className="members-list">
                {/* Current User (Admin) */}
                <div className="member-item admin">
                  <div className="member-avatar">Bạn</div>
                  <div className="member-info">
                    <div className="member-name">Bạn</div>
                    <div className="member-role">
                      <FiShield />
                      Quản trị viên
                    </div>
                  </div>
                  <div className="member-badge admin-badge">Admin</div>
                </div>

                {/* Other Members */}
                {members.map(member => (
                  <div key={member.id} className="member-item">
                    <div className="member-avatar">{member.avatar}</div>
                    <div className="member-info">
                      <div className="member-name">{member.name}</div>
                      <div className="member-role">{member.role}</div>
                    </div>
                    <button
                      className="btn-remove-member"
                      onClick={() => handleRemoveMember(member.id)}
                      title="Xóa khỏi nhóm"
                    >
                      <FiUserMinus />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn-leave-group" onClick={handleLeaveGroup}>
            <FiLogOut />
            Rời khỏi nhóm
          </button>
          <button className="btn-delete-group">
            <FiTrash2 />
            Xóa nhóm
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupSettingsModal;
