// requests.js - Match requests management

let incomingRequests = [];
let outgoingRequests = [];

// Demo data for requests
const DEMO_REQUESTS = {
    incoming: [
        {
            id: 1,
            menteeId: 2,
            menteeName: '이멘티',
            menteeEmail: 'mentee@test.com',
            message: '안녕하세요! React 개발을 배우고 있는 신입 개발자입니다. 실무 경험을 쌓고 싶어서 멘토링을 요청드립니다. 특히 컴포넌트 설계와 상태 관리에 대해 배우고 싶습니다.',
            status: 'pending',
            createdAt: '2024-01-15T10:30:00Z'
        }
    ],
    outgoing: [
        {
            id: 1,
            mentorId: 1,
            mentorName: '김멘토',
            mentorEmail: 'mentor@test.com',
            message: '안녕하세요! React 개발을 배우고 있는 신입 개발자입니다. 실무 경험을 쌓고 싶어서 멘토링을 요청드립니다.',
            status: 'pending',
            createdAt: '2024-01-15T10:30:00Z'
        }
    ]
};

// Load incoming requests (for mentors)
async function loadIncomingRequests() {
    try {
        showLoading(true);
        
        // Demo mode handling
        if (window.DEMO_MODE) {
            const currentUser = getCurrentUser();
            if (currentUser && currentUser.role === 'mentor') {
                incomingRequests = DEMO_REQUESTS.incoming;
                return DEMO_REQUESTS.incoming;
            }
            return [];
        }
        
        // Try real API
        try {
            const response = await apiRequest('/match-requests/incoming');
            
            if (response.ok) {
                const requests = await response.json();
                incomingRequests = requests;
                return requests;
            } else {
                const error = await response.json();
                showToast(error.error || '요청 목록 로드 실패', 'error');
                return [];
            }
        } catch (networkError) {
            // Fallback to demo mode
            console.warn('API unavailable, using demo mode');
            const currentUser = getCurrentUser();
            if (currentUser && currentUser.role === 'mentor') {
                incomingRequests = DEMO_REQUESTS.incoming;
                showToast('요청 목록 로드됨 (오프라인 모드)', 'info');
                return DEMO_REQUESTS.incoming;
            }
            return [];
        }
    } catch (error) {
        console.error('Load incoming requests error:', error);
        showToast('요청 목록을 불러올 수 없습니다', 'error');
        return [];
    } finally {
        showLoading(false);
    }
}

// Load outgoing requests (for mentees)
async function loadOutgoingRequests() {
    try {
        showLoading(true);
        
        // Demo mode handling
        if (window.DEMO_MODE) {
            const currentUser = getCurrentUser();
            if (currentUser && currentUser.role === 'mentee') {
                outgoingRequests = DEMO_REQUESTS.outgoing;
                return DEMO_REQUESTS.outgoing;
            }
            return [];
        }
        
        // Try real API
        try {
            const response = await apiRequest('/match-requests/outgoing');
            
            if (response.ok) {
                const requests = await response.json();
                outgoingRequests = requests;
                return requests;
            } else {
                const error = await response.json();
                showToast(error.error || '요청 목록 로드 실패', 'error');
                return [];
            }
        } catch (networkError) {
            // Fallback to demo mode
            console.warn('API unavailable, using demo mode');
            const currentUser = getCurrentUser();
            if (currentUser && currentUser.role === 'mentee') {
                outgoingRequests = DEMO_REQUESTS.outgoing;
                showToast('요청 목록 로드됨 (오프라인 모드)', 'info');
                return DEMO_REQUESTS.outgoing;
            }
            return [];
        }
    } catch (error) {
        console.error('Load outgoing requests error:', error);
        showToast('요청 목록을 불러올 수 없습니다', 'error');
        return [];
    } finally {
        showLoading(false);
    }
}

// Accept match request (mentor only)
async function acceptRequest(requestId) {
    try {
        showLoading(true);
        
        const response = await apiRequest(`/match-requests/${requestId}/accept`, {
            method: 'PUT'
        });
        
        if (response.ok) {
            const updatedRequest = await response.json();
            showToast('요청을 수락했습니다', 'success');
            
            // Update local data
            const index = incomingRequests.findIndex(req => req.id === requestId);
            if (index !== -1) {
                incomingRequests[index] = updatedRequest;
            }
            
            // Refresh display
            displayIncomingRequests(incomingRequests);
            
            return { success: true, request: updatedRequest };
        } else {
            const error = await response.json();
            showToast(error.error || '요청 수락 실패', 'error');
            return { success: false, error: error.error };
        }
    } catch (error) {
        console.error('Accept request error:', error);
        showToast('요청 수락 중 오류가 발생했습니다', 'error');
        return { success: false, error: 'Network error' };
    } finally {
        showLoading(false);
    }
}

// Reject match request (mentor only)
async function rejectRequest(requestId) {
    try {
        showLoading(true);
        
        const response = await apiRequest(`/match-requests/${requestId}/reject`, {
            method: 'PUT'
        });
        
        if (response.ok) {
            const updatedRequest = await response.json();
            showToast('요청을 거절했습니다', 'success');
            
            // Update local data
            const index = incomingRequests.findIndex(req => req.id === requestId);
            if (index !== -1) {
                incomingRequests[index] = updatedRequest;
            }
            
            // Refresh display
            displayIncomingRequests(incomingRequests);
            
            return { success: true, request: updatedRequest };
        } else {
            const error = await response.json();
            showToast(error.error || '요청 거절 실패', 'error');
            return { success: false, error: error.error };
        }
    } catch (error) {
        console.error('Reject request error:', error);
        showToast('요청 거절 중 오류가 발생했습니다', 'error');
        return { success: false, error: 'Network error' };
    } finally {
        showLoading(false);
    }
}

// Cancel match request (mentee only)
async function cancelRequest(requestId) {
    try {
        showLoading(true);
        
        const response = await apiRequest(`/match-requests/${requestId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            const updatedRequest = await response.json();
            showToast('요청을 취소했습니다', 'success');
            
            // Update local data
            const index = outgoingRequests.findIndex(req => req.id === requestId);
            if (index !== -1) {
                outgoingRequests[index] = updatedRequest;
            }
            
            // Refresh display
            displayOutgoingRequests(outgoingRequests);
            
            return { success: true, request: updatedRequest };
        } else {
            const error = await response.json();
            showToast(error.error || '요청 취소 실패', 'error');
            return { success: false, error: error.error };
        }
    } catch (error) {
        console.error('Cancel request error:', error);
        showToast('요청 취소 중 오류가 발생했습니다', 'error');
        return { success: false, error: 'Network error' };
    } finally {
        showLoading(false);
    }
}

// Display incoming requests (for mentors)
function displayIncomingRequests(requests) {
    const container = document.getElementById('requests-content');
    
    if (requests.length === 0) {
        container.innerHTML = `
            <div class="no-requests">
                <p>받은 요청이 없습니다.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="requests-section">
            <h3>받은 요청 (${requests.length}개)</h3>
            ${requests.map(request => `
                <div class="request-item">
                    <div class="request-header">
                        <h4>멘티 ID: ${request.menteeId}</h4>
                        <div class="request-status status-${request.status}">
                            ${getStatusText(request.status)}
                        </div>
                    </div>
                    
                    <div class="request-message" mentee="${request.menteeId}">
                        <strong>메시지:</strong>
                        <p>${request.message}</p>
                    </div>
                    
                    ${request.status === 'pending' ? `
                        <div class="request-actions">
                            <button class="accept-btn" id="accept" data-request-id="${request.id}">
                                수락
                            </button>
                            <button class="reject-btn" id="reject" data-request-id="${request.id}">
                                거절
                            </button>
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    `;
    
    // Add event listeners
    container.querySelectorAll('.accept-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const requestId = parseInt(e.target.dataset.requestId);
            await acceptRequest(requestId);
        });
    });
    
    container.querySelectorAll('.reject-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const requestId = parseInt(e.target.dataset.requestId);
            await rejectRequest(requestId);
        });
    });
}

// Display outgoing requests (for mentees)
function displayOutgoingRequests(requests) {
    const container = document.getElementById('requests-content');
    
    if (requests.length === 0) {
        container.innerHTML = `
            <div class="no-requests">
                <p>보낸 요청이 없습니다.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="requests-section">
            <h3>보낸 요청 (${requests.length}개)</h3>
            ${requests.map(request => `
                <div class="request-item">
                    <div class="request-header">
                        <h4>멘토 ID: ${request.mentorId}</h4>
                        <div class="request-status status-${request.status}">
                            ${getStatusText(request.status)}
                        </div>
                    </div>
                    
                    <div class="request-info">
                        <p><strong>요청 ID:</strong> ${request.id}</p>
                        <p><strong>상태:</strong> ${getStatusText(request.status)}</p>
                    </div>
                    
                    ${request.status === 'pending' ? `
                        <div class="request-actions">
                            <button class="cancel-btn" data-request-id="${request.id}">
                                취소
                            </button>
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    `;
    
    // Add event listeners
    container.querySelectorAll('.cancel-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const requestId = parseInt(e.target.dataset.requestId);
            await cancelRequest(requestId);
        });
    });
}

// Initialize requests page based on user role
function initRequests() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const title = document.getElementById('requests-title');
    
    if (currentUser.role === 'mentor') {
        title.textContent = '받은 요청 관리';
    } else {
        title.textContent = '보낸 요청 관리';
    }
}

// Load requests when page is shown
async function onRequestsPageShow() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    if (currentUser.role === 'mentor') {
        const requests = await loadIncomingRequests();
        displayIncomingRequests(requests);
    } else {
        const requests = await loadOutgoingRequests();
        displayOutgoingRequests(requests);
    }
}
