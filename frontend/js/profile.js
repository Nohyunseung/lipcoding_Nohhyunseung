// profile.js - Profile management

let currentUserProfile = null;

// Load current user profile
async function loadUserProfile() {
    try {
        showLoading(true);
        
        // Demo mode handling
        if (window.DEMO_MODE) {
            const currentUser = getCurrentUser();
            if (currentUser && window.DEMO_USERS && window.DEMO_USERS[currentUser.email]) {
                const demoUser = window.DEMO_USERS[currentUser.email].user;
                currentUserProfile = demoUser;
                displayUserProfile(demoUser);
                return demoUser;
            }
        }
        
        // Try real API
        try {
            const response = await apiRequest('/me');
            
            if (response.ok) {
                const user = await response.json();
                currentUserProfile = user;
                displayUserProfile(user);
                return user;
            } else {
                const error = await response.json();
                showToast(error.error || '프로필 로드 실패', 'error');
                return null;
            }
        } catch (networkError) {
            // Fallback to demo mode
            console.warn('API unavailable, using demo mode');
            const currentUser = getCurrentUser();
            if (currentUser && window.DEMO_USERS && window.DEMO_USERS[currentUser.email]) {
                const demoUser = window.DEMO_USERS[currentUser.email].user;
                currentUserProfile = demoUser;
                displayUserProfile(demoUser);
                showToast('프로필 로드됨 (오프라인 모드)', 'info');
                return demoUser;
            }
            throw networkError;
        }
    } catch (error) {
        console.error('Load profile error:', error);
        showToast('프로필을 불러올 수 없습니다', 'error');
        return null;
    } finally {
        showLoading(false);
    }
}

// Display skills as tags
function displaySkillTags(skills, container) {
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!skills || skills.length === 0) {
        container.innerHTML = '<span class="no-skills">등록된 스킬이 없습니다</span>';
        return;
    }
    
    skills.forEach(skill => {
        const tag = document.createElement('span');
        tag.className = 'skill-tag';
        tag.textContent = skill;
        container.appendChild(tag);
    });
}

// Display user profile in form
function displayUserProfile(user) {
    const profileForm = document.getElementById('profile-form');
    const nameInput = profileForm.querySelector('#profile-name');
    const bioInput = profileForm.querySelector('#profile-bio');
    const skillsInput = profileForm.querySelector('#profile-skillsets');
    const profilePhoto = document.getElementById('profile-photo');
    const skillsSection = document.getElementById('skills-section');
    
    // Fill form fields
    nameInput.value = user.profile.name || '';
    bioInput.value = user.profile.bio || '';
    
    // Set profile photo
    profilePhoto.src = user.profile.imageUrl;
    profilePhoto.alt = `${user.profile.name} 프로필 사진`;
    
    // Show/hide skills section based on role
    if (user.role === 'mentor') {
        skillsSection.style.display = 'block';
        skillsInput.value = user.profile.skills ? user.profile.skills.join(', ') : '';
        
        // Display skills as tags if container exists
        const skillsDisplay = document.getElementById('skills-display');
        if (skillsDisplay) {
            displaySkillTags(user.profile.skills, skillsDisplay);
        }
    } else {
        skillsSection.style.display = 'none';
    }
}

// Convert file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Validate image file
function validateImageFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 1024 * 1024; // 1MB
    
    if (!validTypes.includes(file.type)) {
        showToast('JPG 또는 PNG 파일만 업로드 가능합니다', 'error');
        return false;
    }
    
    if (file.size > maxSize) {
        showToast('파일 크기는 1MB 이하여야 합니다', 'error');
        return false;
    }
    
    return true;
}

// Update user profile
async function updateProfile(profileData) {
    try {
        showLoading(true);
        
        const response = await apiRequest('/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
        
        if (response.ok) {
            const updatedUser = await response.json();
            currentUserProfile = updatedUser;
            displayUserProfile(updatedUser);
            showToast('프로필이 업데이트되었습니다', 'success');
            return { success: true, user: updatedUser };
        } else {
            const error = await response.json();
            showToast(error.error || '프로필 업데이트 실패', 'error');
            return { success: false, error: error.error };
        }
    } catch (error) {
        console.error('Update profile error:', error);
        showToast('프로필 업데이트 중 오류가 발생했습니다', 'error');
        return { success: false, error: 'Network error' };
    } finally {
        showLoading(false);
    }
}

// Initialize profile page
function initProfile() {
    const profileForm = document.getElementById('profile-form');
    const profileImageInput = document.getElementById('profile');
    const profilePhoto = document.getElementById('profile-photo');
    
    // Handle profile image upload
    profileImageInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!validateImageFile(file)) {
            e.target.value = '';
            return;
        }
        
        try {
            const base64 = await fileToBase64(file);
            profilePhoto.src = base64;
        } catch (error) {
            console.error('Failed to read file:', error);
            showToast('이미지 파일을 읽을 수 없습니다', 'error');
        }
    });
    
    // Handle profile form submission
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!currentUserProfile) {
            showToast('사용자 정보를 불러올 수 없습니다', 'error');
            return;
        }
        
        const formData = new FormData(profileForm);
        const name = formData.get('name');
        const bio = formData.get('bio');
        const skillsInput = formData.get('skills');
        const imageFile = formData.get('image');
        
        // Validation
        if (!name.trim()) {
            showToast('이름을 입력해주세요', 'error');
            return;
        }
        
        const profileData = {
            id: currentUserProfile.id,
            name: name.trim(),
            role: currentUserProfile.role,
            bio: bio.trim(),
            image: ''
        };
        
        // Add skills for mentors
        if (currentUserProfile.role === 'mentor') {
            const skills = skillsInput ? 
                skillsInput.split(',').map(s => s.trim()).filter(s => s.length > 0) : [];
            profileData.skills = skills;
        }
        
        // Handle image upload
        if (imageFile && imageFile.size > 0) {
            if (!validateImageFile(imageFile)) {
                return;
            }
            
            try {
                profileData.image = await fileToBase64(imageFile);
            } catch (error) {
                console.error('Failed to convert image:', error);
                showToast('이미지 처리 중 오류가 발생했습니다', 'error');
                return;
            }
        }
        
        await updateProfile(profileData);
    });
}

// Load profile when page is shown
function onProfilePageShow() {
    if (!currentUserProfile) {
        loadUserProfile();
    }
}
