#!/bin/bash

# ROS2 Web Server 초기 설정 스크립트

# 워크스페이스 루트로 이동
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$SCRIPT_DIR/../.."

# 웹 서버 디렉토리로 이동
cd "$SCRIPT_DIR"

echo "📦 Node.js 패키지 설치 중..."
npm install --force

# ROS2 환경 설정
if [ -f "$WORKSPACE_ROOT/install/setup.bash" ]; then
    echo "🔧 ROS2 환경 설정 중..."
    source "$WORKSPACE_ROOT/install/setup.bash"

    echo "🔨 ROS2 메시지 생성 중..."
    npx generate-ros-messages

    echo ""
    echo "✅ 설정 완료!"
    echo "이제 './run_server.sh' 또는 'npm run server'로 서버를 실행하세요."
else
    echo "⚠️  경고: install/setup.bash를 찾을 수 없습니다."
    echo "먼저 워크스페이스 루트에서 'colcon build'를 실행하세요."
    exit 1
fi
