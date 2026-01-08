#!/bin/bash

# ROS2 Web Server 실행 스크립트

# 워크스페이스 루트로 이동
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$SCRIPT_DIR/../.."

# ROS2 환경 설정
if [ -f "$WORKSPACE_ROOT/install/setup.bash" ]; then
    echo "🔧 ROS2 환경 설정 중..."
    source "$WORKSPACE_ROOT/install/setup.bash"
else
    echo "⚠️  경고: install/setup.bash를 찾을 수 없습니다."
    echo "먼저 'colcon build'를 실행하세요."
    exit 1
fi

# 웹 서버 디렉토리로 이동
cd "$SCRIPT_DIR"

# Node.js 서버 실행
echo "🚀 웹 서버 시작 중..."
echo "📍 브라우저에서 http://localhost:8080 접속"
echo ""
node server.js
