# ROS2 Web Controller (rclnodejs)
> ⚠️ **주의사항**
> - ROS2 Humble에서만 테스트되었습니다
> - Linux 환경에서만 테스트되었습니다
> - ROS2가 사전에 설치되어 있어야 합니다

## 📋 프로젝트 구조

```
ubisam_ros2_py/
├── src/
│   ├── test_interfaces/          # 커스텀 인터페이스 정의
│   │   ├── msg/Position.msg
│   │   ├── srv/CalculateDistance.srv
│   │   └── action/MoveTo.action
│   └── test_nodes_py/             # ROS2 Python 노드 
│       ├── node_a.py              # Action/Service Client
│       └── node_b.py              # Action/Service Server
├── server.js                      # Node.js 웹서버 (rclnodejs)
├── web_client_rclnodejs.html      # 웹 클라이언트
└── package.json                   # Node.js 의존성
```

## 🚀 빠른 시작

### 1. ROS2 패키지 빌드

```bash
cd ubisam_ros2_py
colcon build
source install/setup.bash
```

### 2. ROS2 노드 실행

```bash
# 터미널 1: NodeA와 NodeB 실행
cd ubisam_ros2_py
source install/setup.bash
ros2 launch test_nodes_py nodes.launch.py
```

### 3. Node.js 웹 서버 실행

```bash
# 터미널 2: 웹 서버 실행
cd ubisam_ros2_py
source install/setup.bash  # 중요!

# 최초 1회만 실행
npm install --force
npx generate-ros-messages

# 서버 실행
node server.js
```

### 4. 브라우저 접속

```http://192.168.189.132:8080```
