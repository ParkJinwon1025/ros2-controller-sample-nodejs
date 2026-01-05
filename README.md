# ros2-controller-sample-python
> ⚠️ **주의: 이 노드는 반드시 ROS2 Humble에서만 테스트되었습니다.**  
> ⚠️ **주의: 이 프로젝트는 리눅스 환경에서만 테스트 되었습니다.**  
> ⚠️ **주의: 이 README.md에서 ros2 설치 방법은 나오지 않습니다.**

## 1. ros2 초기 설정

## 2. ros2 빌드

### 1. 터미널 열기

### 2. 빌드 명령어 입력
```bash
cd ros2-controller-sample-cpp # 디렉토리 이동
colcon build # 패키지 빌드
```

### 3. 노드 실행 및 테스트

```bash
# 첫번째 터미널 ( NodeA, NodeB 실행 )
cd ubisam_ros2_py
source install/setup.bash # 환경 설정
ros2 launch test_nodes_py nodes.launch.py
```

```bash
# 두번째 터미널 ( Ros2 WebSocket 서버 실행 )
cd ubisam_ros2_py
sudo apt update
sudo apt install ros-humble-rosbridge-suite # 패키지 설치 
source install/setup.bash
ros2 launch rosbridge_server  rosbridge_websocket_launch.xml # 서버 실행
```

## 3. 웹 브라우저에서 확인

### 방식 1: rosbridge 사용 (기본)

```bash
# 두번째 터미널 ( Ros2 WebSocket 서버 실행 )
cd ubisam_ros2_py
sudo apt update
sudo apt install ros-humble-rosbridge-suite # 패키지 설치
source install/setup.bash
ros2 launch rosbridge_server rosbridge_websocket_launch.xml # 서버 실행
```

```bash
# 세번째 터미널 ( HTTP 서버 실행 )
cd ubisam_ros2_py
python3 -m http.server 8000
```

**브라우저 접속:**
```
http://192.168.189.132:8000/web_client.html
```

**지원 기능:**
- ✅ Topic (완전 지원)
- ✅ Service (완전 지원)
- ⚠️ Action (제한적 - 저수준 API 사용)

---

### 방식 2: rclnodejs 사용 (권장) ⭐

**장점:**
- ✅ Action 완벽 지원
- ✅ 더 빠른 성능
- ✅ rosbridge 불필요
- ✅ 단일 서버 프로세스

```bash
# 두번째 터미널 ( Node.js 서버 실행 )
cd ubisam_ros2_py

# 최초 1회만 실행
npm install --force

# 서버 실행
source install/setup.bash  # 중요!
node server.js
```

**브라우저 접속:**
```
http://localhost:8080
또는
http://192.168.189.132:8080
```

**지원 기능:**
- ✅ Topic (완전 지원)
- ✅ Service (완전 지원)
- ✅ Action (완전 지원 - 네이티브 API)

**개발 모드 (자동 재시작):**
```bash
npm run dev
```

**트러블슈팅:**
- rclnodejs 설치 실패 시: `sudo apt install python3-dev`
- 서버가 ROS2 노드를 찾지 못할 시: `source install/setup.bash` 후 실행

