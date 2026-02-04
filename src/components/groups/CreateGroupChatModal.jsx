// src/components/groups/CreateGroupChatModal.jsx
import React, { useState } from 'react';
import { FiX, FiUsers, FiImage, FiUserPlus, FiCheck } from 'react-icons/fi';
import './CreateGroupChatModal.css';

const CreateGroupChatModal = ({ isOpen, onClose, onCreateGroup, availableContacts }) => {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupAvatar, setGroupAvatar] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [step, setStep] = useState(1); // 1: Members, 2: Group Info

  // Filter contacts based on search
  const filteredContacts = availableContacts?.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Toggle member selection
  const toggleMember = (contact) => {
    if (selectedMembers.find(m => m.id === contact.id)) {
      setSelectedMembers(selectedMembers.filter(m => m.id !== contact.id));
    } else {
      setSelectedMembers([...selectedMembers, contact]);
    }
  };

  // Handle create group
  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      alert('Vui lòng nhập tên nhóm');
      return;
    }

    if (selectedMembers.length < 2) {
      alert('Nhóm phải có ít nhất 2 thành viên (ngoài bạn)');
      return;
    }

    const groupData = {
      name: groupName,
      description: groupDescription,
      avatar: groupAvatar || getDefaultAvatar(groupName),
      members: selectedMembers,
      type: 'group'
    };

    onCreateGroup(groupData);
    handleClose();
  };

  // Get default avatar from group name
  const getDefaultAvatar = (name) => {
    const words = name.split(' ');
    if (words.length >= 2) {
      return words[0][0] + words[1][0];
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Handle close and reset
  const handleClose = () => {
    setGroupName('');
    setGroupDescription('');
    setGroupAvatar('');
    setSelectedMembers([]);
    setSearchQuery('');
    setStep(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="create-group-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <FiUsers className="title-icon" />
            <h2>Tạo nhóm chat mới</h2>
          </div>
          <button className="btn-close" onClick={handleClose}>
            <FiX />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`step ${step === 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Chọn thành viên</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step === 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Thông tin nhóm</div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {step === 1 ? (
            // Step 1: Select Members
            <div className="members-selection">
              <div className="selection-header">
                <h3>Chọn thành viên cho nhóm</h3>
                <span className="member-count">
                  {selectedMembers.length} đã chọn
                </span>
              </div>

              {/* Selected Members Preview */}
              {selectedMembers.length > 0 && (
                <div className="selected-members-preview">
                  <div className="selected-members-list">
                    {selectedMembers.map(member => (
                      <div key={member.id} className="selected-member-chip">
                        <span className="member-avatar">{member.avatar}</span>
                        <span className="member-name">{member.name}</span>
                        <button
                          className="btn-remove-chip"
                          onClick={() => toggleMember(member)}
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Search */}
              <div className="search-section">
                <input
                  type="text"
                  placeholder="Tìm kiếm thành viên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              {/* Contacts List */}
              <div className="contacts-list">
                {filteredContacts.map(contact => {
                  const isSelected = selectedMembers.find(m => m.id === contact.id);
                  return (
                    <div
                      key={contact.id}
                      className={`contact-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleMember(contact)}
                    >
                      <div className="contact-avatar">{contact.avatar}</div>
                      <div className="contact-info">
                        <div className="contact-name">{contact.name}</div>
                        <div className="contact-role">{contact.role}</div>
                      </div>
                      <div className="contact-checkbox">
                        {isSelected && <FiCheck />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            // Step 2: Group Info
            <div className="group-info-form">
              <div className="avatar-section">
                <div className="group-avatar-preview">
                  {groupAvatar || getDefaultAvatar(groupName || 'N')}
                </div>
                <button className="btn-change-avatar">
                  <FiImage />
                  Thay đổi ảnh nhóm
                </button>
              </div>

              <div className="form-group">
                <label>Tên nhóm *</label>
                <input
                  type="text"
                  placeholder="Nhập tên nhóm..."
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="form-input"
                  maxLength={50}
                />
                <span className="char-count">{groupName.length}/50</span>
              </div>

              <div className="form-group">
                <label>Mô tả nhóm (tùy chọn)</label>
                <textarea
                  placeholder="Nhập mô tả về nhóm..."
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  className="form-textarea"
                  rows="3"
                  maxLength={200}
                />
                <span className="char-count">{groupDescription.length}/200</span>
              </div>

              <div className="members-summary">
                <h4>
                  <FiUsers /> Thành viên ({selectedMembers.length + 1})
                </h4>
                <div className="members-grid">
                  <div className="member-card me">
                    <div className="member-card-avatar">Bạn</div>
                    <div className="member-card-name">Bạn</div>
                    <div className="member-card-role">Quản trị viên</div>
                  </div>
                  {selectedMembers.map(member => (
                    <div key={member.id} className="member-card">
                      <div className="member-card-avatar">{member.avatar}</div>
                      <div className="member-card-name">{member.name}</div>
                      <div className="member-card-role">{member.role}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          {step === 1 ? (
            <>
              <button className="btn-secondary" onClick={handleClose}>
                Hủy
              </button>
              <button
                className="btn-primary"
                onClick={() => setStep(2)}
                disabled={selectedMembers.length < 2}
              >
                Tiếp tục
                <span className="btn-badge">{selectedMembers.length}</span>
              </button>
            </>
          ) : (
            <>
              <button className="btn-secondary" onClick={() => setStep(1)}>
                Quay lại
              </button>
              <button
                className="btn-primary"
                onClick={handleCreateGroup}
              >
                <FiUsers />
                Tạo nhóm
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateGroupChatModal;
