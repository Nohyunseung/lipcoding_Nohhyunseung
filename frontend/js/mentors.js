// mentors.js - Mentor listing and requests

let mentorsList = [];
let currentRequests = {};

// Demo data for offline testing
const DEMO_MENTORS = [
    {
        id: 1,
        name: '김멘토',
        email: 'mentor@test.com',
        bio: '10년 경력의 풀스택 개발자입니다. React, Node.js, Python을 전문으로 합니다. 다양한 프로젝트 경험을 바탕으로 실무 중심의 멘토링을 제공합니다.',
        skills: ['React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'MongoDB', 'PostgreSQL'],
        profilePhoto: null
    },
    {
        id: 3,
        name: '박개발',
        email: 'dev@test.com',
        bio: '모바일 앱 개발 전문가입니다. React Native와 Flutter를 이용한 크로스 플랫폼 개발을 전문으로 합니다.',
        skills: ['React Native', 'Flutter', 'Dart', 'Swift', 'Kotlin', 'Firebase'],
        profilePhoto: null
    },
    {
        id: 4,
        name: '이디자인',
        email: 'design@test.com',
        bio: 'UI/UX 디자이너이자 프론트엔드 개발자입니다. 사용자 경험을 중시하는 인터페이스 설계를 도와드립니다.',
        skills: ['UI/UX Design', 'Figma', 'React', 'Vue.js', 'CSS', 'SASS'],
        profilePhoto: null
    }
];

// Load mentors list
async function loadMentors(filters = {}) {
    try {
        showLoading(true);
        
        // Demo mode handling
        if (window.DEMO_MODE) {
            let mentors = [...DEMO_MENTORS];
            
            // Apply filters
            if (filters.skill) {
                const searchTerm = filters.skill.toLowerCase();
                mentors = mentors.filter(mentor => 
                    mentor.skills.some(skill => 
                        skill.toLowerCase().includes(searchTerm)
                    )
                );
            }
            
            // Apply sorting
            if (filters.orderBy === 'name') {
                mentors.sort((a, b) => a.name.localeCompare(b.name));
            } else if (filters.orderBy === 'skill') {
                mentors.sort((a, b) => b.skills.length - a.skills.length);
            }
            
            mentorsList = mentors;
            displayMentors(mentors);
            showToast(`${mentors.length}명의 멘토를 찾았습니다`, 'success');
            return mentors;
        }
        
        const searchParams = new URLSearchParams();
        if (filters.skill) {
            searchParams.append('skill', filters.skill);
        }
        if (filters.orderBy) {
            searchParams.append('orderBy', filters.orderBy);
        }
        
        const url = `/mentors${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
        const response = await apiRequest(url);
        
        if (response.ok) {
            const mentors = await response.json();
            mentorsList = mentors;
            await loadCurrentRequests(); // Load current request status
            displayMentors(mentors);
            return mentors;
        } else {
            const error = await response.json();
            showToast(error.error || '멘토 목록 로드 실패', 'error');
            return [];
        }
    } catch (error) {
        console.error('Load mentors error:', error);
        showToast('멘토 목록을 불러올 수 없습니다', 'error');
        return [];
    } finally {
        showLoading(false);
    }
}

// Load current requests status
async function loadCurrentRequests() {
    try {
        const response = await apiRequest('/match-requests/outgoing');
        
        if (response.ok) {
            const requests = await response.json();
            currentRequests = {};
            requests.forEach(req => {
                currentRequests[req.mentorId] = req;
            });
        }
    } catch (error) {
        console.error('Load current requests error:', error);
    }
}

// Display mentors in grid
function displayMentors(mentors) {
    const mentorsList = document.getElementById('mentors-list');
    
    if (mentors.length === 0) {
        mentorsList.innerHTML = `
            <div class="no-results">
                <p>조건에 맞는 멘토가 없습니다.</p>
            </div>
        `;
        return;
    }
    
    mentorsList.innerHTML = mentors.map(mentor => {
        const request = currentRequests[mentor.id];
        const canRequest = !request || request.status === 'rejected' || request.status === 'cancelled';
        
        return `
            <div class="mentor" data-mentor-id="${mentor.id}">
                <div class="mentor-header">
                    <img src="${mentor.profile.imageUrl}" alt="${mentor.profile.name}" class="mentor-avatar">
                    <div class="mentor-info">
                        <h3>${mentor.profile.name}</h3>
                        <div class="email">${mentor.email}</div>
                    </div>
                </div>
                
                <div class="mentor-bio">
                    ${mentor.profile.bio || '소개가 없습니다.'}
                </div>
                
                <div class="mentor-skills">
                    <strong>기술 스택:</strong>
                    <div class="skills-list">
                        ${mentor.profile.skills.map(skill => 
                            `<span class="skill-tag">${skill}</span>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="mentor-actions">
                    ${request ? 
                        `<div class="request-status status-${request.status}">
                            ${getStatusText(request.status)}
                        </div>` : 
                        ''
                    }
                    
                    <button class="request-btn" 
                            data-mentor-id="${mentor.id}" 
                            ${!canRequest ? 'disabled' : ''}>
                        ${canRequest ? '요청하기' : '요청 불가'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    // Add event listeners to request buttons
    mentorsList.querySelectorAll('.request-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const mentorId = parseInt(e.target.dataset.mentorId);
            openRequestModal(mentorId);
        });
    });
}

// Get status text in Korean
function getStatusText(status) {
    const statusMap = {
        'pending': '대기중',
        'accepted': '수락됨',
        'rejected': '거절됨',
        'cancelled': '취소됨'
    };
    return statusMap[status] || status;
}

// Open request modal
function openRequestModal(mentorId) {
    const mentor = mentorsList.find(m => m.id === mentorId);
    if (!mentor) return;
    
    const modal = document.getElementById('request-modal');
    const mentorIdInput = document.getElementById('mentor-id');
    const messageTextarea = document.getElementById('request-message');
    
    mentorIdInput.value = mentorId;
    messageTextarea.value = '';
    
    // Update modal title
    const modalTitle = modal.querySelector('h2');
    modalTitle.textContent = `${mentor.profile.name}님께 멘토링 요청`;
    
    modal.style.display = 'block';
}

// Close request modal
function closeRequestModal() {
    const modal = document.getElementById('request-modal');
    modal.style.display = 'none';
}

// Send mentor request
async function sendMentorRequest(mentorId, message) {
    try {
        showLoading(true);
        
        const currentUser = getCurrentUser();
        if (!currentUser) {
            throw new Error('User not authenticated');
        }
        
        const requestData = {
            mentorId: mentorId,
            menteeId: parseInt(currentUser.sub),
            message: message
        };
        
        const response = await apiRequest('/match-requests', {
            method: 'POST',
            body: JSON.stringify(requestData)
        });
        
        if (response.ok) {
            const newRequest = await response.json();
            showToast('멘토링 요청을 보냈습니다', 'success');
            closeRequestModal();
            
            // Update current requests and refresh display
            currentRequests[mentorId] = newRequest;
            displayMentors(mentorsList);
            
            return { success: true, request: newRequest };
        } else {
            const error = await response.json();
            showToast(error.error || '요청 전송 실패', 'error');
            return { success: false, error: error.error };
        }
    } catch (error) {
        console.error('Send request error:', error);
        showToast('요청 전송 중 오류가 발생했습니다', 'error');
        return { success: false, error: 'Network error' };
    } finally {
        showLoading(false);
    }
}

// Filter mentors by search
function filterMentors() {
    const searchInput = document.getElementById('search');
    const sortRadios = document.querySelectorAll('input[name="sort"]');
    
    const filters = {
        skill: searchInput.value.trim(),
        orderBy: Array.from(sortRadios).find(r => r.checked)?.value || ''
    };
    
    loadMentors(filters);
}

// Initialize mentors page
function initMentors() {
    const searchInput = document.getElementById('search');
    const sortRadios = document.querySelectorAll('input[name="sort"]');
    const requestModal = document.getElementById('request-modal');
    const requestForm = document.getElementById('request-form');
    const closeBtn = requestModal.querySelector('.close');
    const cancelBtn = requestModal.querySelector('.cancel-btn');
    
    // Search input with debounce
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(filterMentors, 500);
    });
    
    // Sort radio buttons
    sortRadios.forEach(radio => {
        radio.addEventListener('change', filterMentors);
    });
    
    // Request modal close events
    closeBtn.addEventListener('click', closeRequestModal);
    cancelBtn.addEventListener('click', closeRequestModal);
    
    // Close modal when clicking outside
    requestModal.addEventListener('click', (e) => {
        if (e.target === requestModal) {
            closeRequestModal();
        }
    });
    
    // Request form submission
    requestForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const mentorId = parseInt(document.getElementById('mentor-id').value);
        const message = document.getElementById('request-message').value.trim();
        
        if (!message) {
            showToast('메시지를 입력해주세요', 'error');
            return;
        }
        
        await sendMentorRequest(mentorId, message);
    });
}

// Load mentors when page is shown
function onMentorsPageShow() {
    loadMentors();
}
