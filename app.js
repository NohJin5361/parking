// 지도 초기화 (서울 중심)
const map = L.map('map').setView([37.5665, 126.9780], 13);

// OpenStreetMap 타일 레이어 추가
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
}).addTo(map);

// 더미 주차장 데이터 (서울 주요 지역)
const parkingData = [
    {
        id: 1,
        name: '강남역 공영주차장',
        lat: 37.4979,
        lng: 127.0276,
        totalSpaces: 150,
        availableSpaces: 45,
        price: '시간당 3,000원',
        distance: '250m'
    },
    {
        id: 2,
        name: '역삼 타워주차장',
        lat: 37.5004,
        lng: 127.0360,
        totalSpaces: 200,
        availableSpaces: 8,
        price: '시간당 4,000원',
        distance: '450m'
    },
    {
        id: 3,
        name: '삼성역 지하주차장',
        lat: 37.5087,
        lng: 127.0633,
        totalSpaces: 300,
        availableSpaces: 120,
        price: '시간당 2,500원',
        distance: '180m'
    },
    {
        id: 4,
        name: 'COEX 주차장',
        lat: 37.5115,
        lng: 127.0590,
        totalSpaces: 500,
        availableSpaces: 2,
        price: '시간당 5,000원',
        distance: '320m'
    },
    {
        id: 5,
        name: '신논현역 주차장',
        lat: 37.5046,
        lng: 127.0255,
        totalSpaces: 80,
        availableSpaces: 15,
        price: '시간당 3,500원',
        distance: '520m'
    },
    {
        id: 6,
        name: '시청역 공영주차장',
        lat: 37.5663,
        lng: 126.9779,
        totalSpaces: 120,
        availableSpaces: 55,
        price: '시간당 2,000원',
        distance: '150m'
    },
    {
        id: 7,
        name: '명동 중앙주차장',
        lat: 37.5636,
        lng: 126.9826,
        totalSpaces: 180,
        availableSpaces: 3,
        price: '시간당 4,500원',
        distance: '280m'
    },
    {
        id: 8,
        name: '홍대입구역 주차장',
        lat: 37.5572,
        lng: 126.9239,
        totalSpaces: 250,
        availableSpaces: 78,
        price: '시간당 3,000원',
        distance: '400m'
    },
    {
        id: 9,
        name: '이태원 공영주차장',
        lat: 37.5347,
        lng: 126.9946,
        totalSpaces: 100,
        availableSpaces: 6,
        price: '시간당 2,500원',
        distance: '350m'
    },
    {
        id: 10,
        name: '잠실역 대형주차장',
        lat: 37.5133,
        lng: 127.1002,
        totalSpaces: 400,
        availableSpaces: 156,
        price: '시간당 2,000원',
        distance: '200m'
    }
];

// 주차 가능 상태 판단
function getParkingStatus(available) {
    if (available >= 10) return 'available';
    if (available >= 5) return 'limited';
    return 'full';
}

// 커스텀 마커 생성
function createCustomMarker(parking) {
    const status = getParkingStatus(parking.availableSpaces);

    const icon = L.divIcon({
        className: 'custom-div-icon',
        html: `
            <div class="custom-marker ${status}">
                <div class="marker-count">${parking.availableSpaces}</div>
                <div class="marker-label">대</div>
            </div>
        `,
        iconSize: [60, 60],
        iconAnchor: [30, 30]
    });

    return icon;
}

// 팝업 내용 생성
function createPopupContent(parking) {
    const status = getParkingStatus(parking.availableSpaces);
    const statusClass = status === 'available' ? 'high' : status === 'limited' ? 'medium' : 'low';

    return `
        <div class="popup-content">
            <h3>🅿️ ${parking.name}</h3>
            <div class="popup-info">
                <span>📍 거리:</span>
                <strong>${parking.distance}</strong>
            </div>
            <div class="popup-info">
                <span>💰 요금:</span>
                <strong>${parking.price}</strong>
            </div>
            <div class="available-count ${statusClass}">
                주차 가능: ${parking.availableSpaces}/${parking.totalSpaces}대
            </div>
            <div class="popup-info" style="font-size: 0.85rem; color: #999; margin-top: 10px;">
                ${status === 'available' ? '✅ 여유있음' :
                  status === 'limited' ? '⚠️ 보통' : '🚫 거의 만차'}
            </div>
        </div>
    `;
}

// 마커 배열 저장
const markers = [];

// 지도에 주차장 마커 추가
parkingData.forEach(parking => {
    const marker = L.marker([parking.lat, parking.lng], {
        icon: createCustomMarker(parking)
    }).addTo(map);

    marker.bindPopup(createPopupContent(parking), {
        maxWidth: 300,
        className: 'custom-popup'
    });

    // 마커 클릭 시 애니메이션
    marker.on('click', function() {
        this.openPopup();
        // 해당 주차장 리스트 아이템 하이라이트
        highlightParkingItem(parking.id);
    });

    markers.push({ marker, parking });
});

// 주차장 리스트 생성
function updateParkingList() {
    const parkingItems = document.getElementById('parkingItems');

    // 주차 가능 대수 순으로 정렬
    const sortedParking = [...parkingData].sort((a, b) => b.availableSpaces - a.availableSpaces);

    parkingItems.innerHTML = sortedParking.map(parking => {
        const status = getParkingStatus(parking.availableSpaces);
        const statusClass = status === 'available' ? 'high' : status === 'limited' ? 'medium' : 'low';

        return `
            <div class="parking-item" data-id="${parking.id}">
                <div class="parking-name">${parking.name}</div>
                <div class="parking-details">
                    <span>📍 ${parking.distance} | 💰 ${parking.price}</span>
                    <span class="parking-available ${statusClass}">
                        ${parking.availableSpaces}대 가능
                    </span>
                </div>
            </div>
        `;
    }).join('');

    // 리스트 아이템 클릭 이벤트
    document.querySelectorAll('.parking-item').forEach(item => {
        item.addEventListener('click', function() {
            const parkingId = parseInt(this.dataset.id);
            const parkingInfo = parkingData.find(p => p.id === parkingId);

            // 지도 중심 이동 및 마커 팝업 열기
            map.setView([parkingInfo.lat, parkingInfo.lng], 16);

            const markerObj = markers.find(m => m.parking.id === parkingId);
            if (markerObj) {
                markerObj.marker.openPopup();
            }
        });
    });
}

// 주차장 리스트 아이템 하이라이트
function highlightParkingItem(parkingId) {
    document.querySelectorAll('.parking-item').forEach(item => {
        item.style.background = '';
    });

    const item = document.querySelector(`[data-id="${parkingId}"]`);
    if (item) {
        item.style.background = '#f8f9ff';
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// 검색 기능
document.getElementById('searchBtn').addEventListener('click', function() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    if (!searchTerm) {
        alert('목적지를 입력해주세요.');
        return;
    }

    // 검색어와 매칭되는 주차장 찾기
    const matchedParking = parkingData.find(p =>
        p.name.toLowerCase().includes(searchTerm)
    );

    if (matchedParking) {
        map.setView([matchedParking.lat, matchedParking.lng], 16);
        const markerObj = markers.find(m => m.parking.id === matchedParking.id);
        if (markerObj) {
            markerObj.marker.openPopup();
        }
        highlightParkingItem(matchedParking.id);
    } else {
        // 검색어를 기반으로 임의의 위치로 이동 (실제로는 geocoding API 사용)
        alert(`"${searchTerm}" 주변 주차장을 표시합니다.`);

        // 예시: 강남역으로 이동
        if (searchTerm.includes('강남')) {
            map.setView([37.4979, 127.0276], 15);
        } else if (searchTerm.includes('홍대')) {
            map.setView([37.5572, 126.9239], 15);
        } else if (searchTerm.includes('명동')) {
            map.setView([37.5636, 126.9826], 15);
        } else if (searchTerm.includes('잠실')) {
            map.setView([37.5133, 127.1002], 15);
        } else {
            map.setView([37.5665, 126.9780], 13);
        }
    }
});

// Enter 키로 검색
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('searchBtn').click();
    }
});

// 페이지 로드 시 주차장 리스트 업데이트
updateParkingList();

// 실시간 업데이트 시뮬레이션 (5초마다)
setInterval(() => {
    parkingData.forEach(parking => {
        // 랜덤하게 주차 가능 대수 변경 (-3 ~ +3)
        const change = Math.floor(Math.random() * 7) - 3;
        parking.availableSpaces = Math.max(0, Math.min(parking.totalSpaces,
            parking.availableSpaces + change));
    });

    // 마커 업데이트
    markers.forEach(({ marker, parking }) => {
        marker.setIcon(createCustomMarker(parking));
        marker.setPopupContent(createPopupContent(parking));
    });

    // 리스트 업데이트
    updateParkingList();
}, 5000);

console.log('🅿️ 스마트 주차장 찾기 앱이 로드되었습니다!');
console.log(`📍 총 ${parkingData.length}개의 주차장 정보를 표시하고 있습니다.`);
