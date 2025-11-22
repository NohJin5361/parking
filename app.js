// 지도 초기화 (순천 중심)
const map = L.map('map').setView([34.9506, 127.4879], 14);

// OpenStreetMap 타일 레이어 추가
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
}).addTo(map);

// 더미 주차장 데이터 (순천 주요 지역)
const parkingData = [
    {
        id: 1,
        name: '순천역 공영주차장',
        lat: 34.9506,
        lng: 127.4879,
        totalSpaces: 180,
        availableSpaces: 45,
        price: '시간당 1,500원',
        distance: '150m'
    },
    {
        id: 2,
        name: '순천만국가정원 주차장',
        lat: 34.8848,
        lng: 127.5050,
        totalSpaces: 500,
        availableSpaces: 8,
        price: '시간당 2,000원',
        distance: '300m'
    },
    {
        id: 3,
        name: '순천시청 지하주차장',
        lat: 34.9506,
        lng: 127.4872,
        totalSpaces: 200,
        availableSpaces: 120,
        price: '시간당 1,000원',
        distance: '100m'
    },
    {
        id: 4,
        name: '팔마역 공영주차장',
        lat: 34.9644,
        lng: 127.4880,
        totalSpaces: 150,
        availableSpaces: 3,
        price: '시간당 1,500원',
        distance: '200m'
    },
    {
        id: 5,
        name: '조례호수공원 주차장',
        lat: 34.9359,
        lng: 127.5115,
        totalSpaces: 120,
        availableSpaces: 65,
        price: '무료',
        distance: '250m'
    },
    {
        id: 6,
        name: '낙안읍성 주차장',
        lat: 34.9686,
        lng: 127.3465,
        totalSpaces: 300,
        availableSpaces: 12,
        price: '시간당 1,000원',
        distance: '180m'
    },
    {
        id: 7,
        name: '순천만습지 주차장',
        lat: 34.8533,
        lng: 127.5134,
        totalSpaces: 400,
        availableSpaces: 156,
        price: '시간당 2,000원',
        distance: '350m'
    },
    {
        id: 8,
        name: '순천향교 주차장',
        lat: 34.9523,
        lng: 127.4905,
        totalSpaces: 80,
        availableSpaces: 6,
        price: '무료',
        distance: '120m'
    },
    {
        id: 9,
        name: '순천문화예술회관 주차장',
        lat: 34.9472,
        lng: 127.4925,
        totalSpaces: 150,
        availableSpaces: 28,
        price: '시간당 1,500원',
        distance: '280m'
    },
    {
        id: 10,
        name: '순천터미널 주차장',
        lat: 34.9550,
        lng: 127.4833,
        totalSpaces: 250,
        availableSpaces: 92,
        price: '시간당 1,500원',
        distance: '220m'
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
            <div class="navigation-buttons">
                <button class="nav-btn tmap-btn" onclick="openTmap(${parking.lat}, ${parking.lng}, '${parking.name}')">
                    <svg class="btn-logo" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/></svg>
                    T맵
                </button>
                <button class="nav-btn kakao-btn" onclick="openKakao(${parking.lat}, ${parking.lng}, '${parking.name}')">
                    <svg class="btn-logo" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-5.5 0-10 3.58-10 8 0 2.89 1.86 5.43 4.65 6.88-.2.77-.74 2.83-.85 3.28-.12.5.17.49.37.36.16-.11 2.42-1.67 3.54-2.43.74.1 1.52.16 2.29.16 5.5 0 10-3.58 10-8s-4.5-8-10-8z"/></svg>
                    카카오맵
                </button>
                <button class="nav-btn naver-btn" onclick="openNaver(${parking.lat}, ${parking.lng}, '${parking.name}')">
                    <svg class="btn-logo" viewBox="0 0 24 24" fill="currentColor"><path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"/></svg>
                    네이버
                </button>
            </div>
        </div>
    `;
}

// T맵 길안내 열기
function openTmap(lat, lng, name) {
    const tmapUrl = `tmap://route?goalname=${encodeURIComponent(name)}&goalx=${lng}&goaly=${lat}`;
    window.location.href = tmapUrl;
}

// 카카오맵 길안내 열기
function openKakao(lat, lng, name) {
    const kakaoUrl = `kakaomap://route?ep=${lat},${lng}&by=CAR`;
    window.location.href = kakaoUrl;
}

// 네이버지도 길안내 열기
function openNaver(lat, lng, name) {
    const naverUrl = `nmap://route/car?dlat=${lat}&dlng=${lng}&dname=${encodeURIComponent(name)}`;
    window.location.href = naverUrl;
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
                <div class="list-navigation-buttons">
                    <button class="list-nav-btn tmap-btn" onclick="event.stopPropagation(); openTmap(${parking.lat}, ${parking.lng}, '${parking.name}')">
                        <svg class="btn-logo-small" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/></svg>
                        T맵
                    </button>
                    <button class="list-nav-btn kakao-btn" onclick="event.stopPropagation(); openKakao(${parking.lat}, ${parking.lng}, '${parking.name}')">
                        <svg class="btn-logo-small" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-5.5 0-10 3.58-10 8 0 2.89 1.86 5.43 4.65 6.88-.2.77-.74 2.83-.85 3.28-.12.5.17.49.37.36.16-.11 2.42-1.67 3.54-2.43.74.1 1.52.16 2.29.16 5.5 0 10-3.58 10-8s-4.5-8-10-8z"/></svg>
                        카카오
                    </button>
                    <button class="list-nav-btn naver-btn" onclick="event.stopPropagation(); openNaver(${parking.lat}, ${parking.lng}, '${parking.name}')">
                        <svg class="btn-logo-small" viewBox="0 0 24 24" fill="currentColor"><path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"/></svg>
                        네이버
                    </button>
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

        // 예시: 순천 주요 지역으로 이동
        if (searchTerm.includes('순천역')) {
            map.setView([34.9506, 127.4879], 15);
        } else if (searchTerm.includes('국가정원') || searchTerm.includes('순천만')) {
            map.setView([34.8848, 127.5050], 15);
        } else if (searchTerm.includes('낙안읍성') || searchTerm.includes('낙안')) {
            map.setView([34.9686, 127.3465], 15);
        } else if (searchTerm.includes('시청')) {
            map.setView([34.9506, 127.4872], 15);
        } else {
            map.setView([34.9506, 127.4879], 14);
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
