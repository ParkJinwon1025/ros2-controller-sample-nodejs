# ROS2 Web Controller (rclnodejs)
> ⚠️ **주의사항**
> - ROS2 Humble에서만 테스트되었습니다
> - Linux 환경에서만 테스트되었습니다
> - ROS2가 사전에 설치되어 있어야 합니다
> - **중요:** `colcon build`는 항상 워크스페이스 루트(`ubisam_ros2_py/`)에서만 실행하세요

## 📋 프로젝트 구조

```
ubisam_ros2_py/
├── src/
│   ├── test_interfaces/          # 커스텀 인터페이스 정의
│   │   ├── msg/Position.msg
│   │   ├── srv/CalculateDistance.srv
│   │   └── action/MoveTo.action
│   ├── test_nodes_py/             # ROS2 Python 노드
│   │   ├── node_a.py              # Action/Service Client
│   │   └── node_b.py              # Action/Service Server
│   └── web_server/                # Node.js 웹 서버 패키지
│       ├── server.js              # Node.js 웹서버 (rclnodejs)
│       ├── web_client.html        # 웹 클라이언트
│       ├── package.json           # Node.js 의존성
│       ├── package.xml            # ROS2 패키지 메타데이터
│       ├── setup.sh               # 초기 설정 스크립트
│       ├── run_server.sh          # 서버 실행 스크립트
│       ├── COLCON_IGNORE          # colcon 빌드에서 제외
│       └── node_modules/          # Node.js 패키지 (자동 생성)
```

## 🚀 빠른 시작 (간편 버전)

### 1. ROS2 패키지 빌드

```bash
cd ubisam_ros2_py
colcon build
```

### 2. 웹 서버 초기 설정 (최초 1회만)

```bash
cd src/web_server
./setup.sh
```

### 3. ROS2 노드 실행

```bash
# 터미널 1: NodeA와 NodeB 실행
cd ubisam_ros2_py
source install/setup.bash
ros2 launch test_nodes_py nodes.launch.py
```

### 4. 웹 서버 실행

```bash
# 터미널 2: 웹 서버 실행
cd ubisam_ros2_py/src/web_server
./run_server.sh
```

**또는 npm 사용:**

```bash
cd ubisam_ros2_py/src/web_server
npm run server
```

### 5. 브라우저 접속

```
http://localhost:8080
```

---

## 📝 상세 실행 방법

<details>
<summary>수동으로 실행하기 (클릭하여 펼치기)</summary>

### 1. ROS2 패키지 빌드

```bash
cd ubisam_ros2_py
colcon build
source install/setup.bash
```

### 2. 웹 서버 초기 설정 (최초 1회만)

```bash
cd ubisam_ros2_py/src/web_server
source ../../install/setup.bash
npm install --force
npx generate-ros-messages
```

### 3. ROS2 노드 실행

```bash
# 터미널 1
cd ubisam_ros2_py
source install/setup.bash
ros2 launch test_nodes_py nodes.launch.py
```

### 4. 웹 서버 실행

```bash
# 터미널 2
cd ubisam_ros2_py/src/web_server
source ../../install/setup.bash
node server.js
```

</details>

---

## 🛠️ NPM 스크립트

웹 서버 디렉토리(`src/web_server/`)에서 사용 가능한 명령어:

- `npm run setup` - 초기 설정 (패키지 설치 + ROS2 메시지 생성)
- `npm run server` - 서버 실행 (ROS2 환경 자동 설정)
- `npm start` - 서버 실행 (수동으로 source 필요)
- `npm run dev` - 개발 모드 (nodemon, 수동으로 source 필요)
