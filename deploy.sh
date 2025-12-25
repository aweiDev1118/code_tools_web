#!/bin/bash

# ============================================
# 开发工具箱 - Docker 一键部署脚本
# 说明: 将本地 dist 文件夹映射到 Nginx 容器
# ============================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 配置
IMAGE_NAME="tools-web"
CONTAINER_NAME="tools-web"
PORT="${PORT:-8080}"
DIST_DIR="./dist"

# 打印函数
print_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 打印 Banner
print_banner() {
    echo -e "${BLUE}"
    echo "╔═══════════════════════════════════════════╗"
    echo "║       开发工具箱 Docker 部署脚本          ║"
    echo "╚═══════════════════════════════════════════╝"
    echo -e "${NC}"
}

# 检查 Docker
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker 未安装，请先安装 Docker"
        exit 1
    fi
    print_success "Docker 已安装: $(docker --version)"
}

# 检查 dist 文件夹
check_dist() {
    if [ ! -d "$DIST_DIR" ]; then
        print_error "dist 文件夹不存在！"
        print_info "请先在本地执行 npm run build 生成 dist 文件夹"
        exit 1
    fi
    if [ ! -f "$DIST_DIR/index.html" ]; then
        print_error "dist 文件夹中没有 index.html！"
        exit 1
    fi
    print_success "dist 文件夹检查通过"
}

# 检查 Docker Compose
check_docker_compose() {
    if command -v docker-compose &> /dev/null; then
        return 0
    elif docker compose version &> /dev/null; then
        return 0
    else
        return 1
    fi
}

# 停止并删除旧容器
cleanup() {
    print_info "清理旧容器..."
    if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        docker stop ${CONTAINER_NAME} 2>/dev/null || true
        docker rm ${CONTAINER_NAME} 2>/dev/null || true
        print_success "旧容器已清理"
    else
        print_info "没有发现旧容器"
    fi
}

# 构建镜像
build_image() {
    print_info "构建 Docker 镜像..."
    docker build -t ${IMAGE_NAME}:latest .
    print_success "镜像构建完成"
}

# 使用纯 Docker 运行
run_with_docker() {
    cleanup
    build_image
    print_info "启动容器..."
    docker run -d \
        --name ${CONTAINER_NAME} \
        -p ${PORT}:80 \
        -v "$(pwd)/dist:/usr/share/nginx/html:ro" \
        --restart unless-stopped \
        ${IMAGE_NAME}:latest
    print_success "容器启动成功"
}

# 使用 Docker Compose 运行
run_with_compose() {
    print_info "使用 Docker Compose 部署..."
    if command -v docker-compose &> /dev/null; then
        docker-compose down 2>/dev/null || true
        docker-compose up -d --build
    else
        docker compose down 2>/dev/null || true
        docker compose up -d --build
    fi
    print_success "部署完成"
}

# 显示结果
show_result() {
    echo ""
    echo -e "${GREEN}╔═══════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║            部署成功!                      ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════╝${NC}"
    echo ""
    print_info "访问地址: http://localhost:${PORT}"
    print_info "容器名称: ${CONTAINER_NAME}"
    print_info "映射目录: $(pwd)/dist -> /usr/share/nginx/html"
    echo ""
    print_info "常用命令:"
    echo "  查看日志: docker logs -f ${CONTAINER_NAME}"
    echo "  停止服务: docker stop ${CONTAINER_NAME}"
    echo "  启动服务: docker start ${CONTAINER_NAME}"
    echo "  重启服务: docker restart ${CONTAINER_NAME}"
    echo "  删除容器: docker rm -f ${CONTAINER_NAME}"
    echo ""
    print_info "更新静态文件后，只需重启容器即可生效"
    echo ""
}

# 显示帮助
show_help() {
    echo "用法: $0 [选项]"
    echo ""
    echo "说明: 将本地 dist 文件夹映射到 Nginx 容器中"
    echo ""
    echo "选项:"
    echo "  -h, --help      显示帮助信息"
    echo "  -p, --port      指定端口 (默认: 8080)"
    echo "  -c, --compose   使用 Docker Compose"
    echo "  -d, --docker    使用纯 Docker"
    echo "  --stop          停止服务"
    echo "  --start         启动服务"
    echo "  --restart       重启服务"
    echo "  --logs          查看日志"
    echo "  --clean         清理容器和镜像"
    echo ""
    echo "示例:"
    echo "  $0              # 默认部署"
    echo "  $0 -p 3000      # 使用 3000 端口"
    echo ""
}

# 停止服务
stop_service() {
    print_info "停止服务..."
    docker stop ${CONTAINER_NAME} 2>/dev/null || print_warning "服务未运行"
    print_success "服务已停止"
}

# 启动服务
start_service() {
    print_info "启动服务..."
    docker start ${CONTAINER_NAME} 2>/dev/null || print_error "容器不存在，请先部署"
    print_success "服务已启动"
}

# 重启服务
restart_service() {
    print_info "重启服务..."
    docker restart ${CONTAINER_NAME}
    print_success "服务已重启"
}

# 查看日志
show_logs() {
    docker logs -f ${CONTAINER_NAME}
}

# 清理
clean_all() {
    print_info "清理容器和镜像..."
    docker stop ${CONTAINER_NAME} 2>/dev/null || true
    docker rm ${CONTAINER_NAME} 2>/dev/null || true
    docker rmi ${IMAGE_NAME}:latest 2>/dev/null || true
    print_success "清理完成"
}

# 主函数
main() {
    USE_COMPOSE=""

    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -p|--port)
                PORT="$2"
                shift 2
                ;;
            -c|--compose)
                USE_COMPOSE="yes"
                shift
                ;;
            -d|--docker)
                USE_COMPOSE="no"
                shift
                ;;
            --stop)
                stop_service
                exit 0
                ;;
            --start)
                start_service
                exit 0
                ;;
            --restart)
                restart_service
                exit 0
                ;;
            --logs)
                show_logs
                exit 0
                ;;
            --clean)
                clean_all
                exit 0
                ;;
            *)
                print_error "未知选项: $1"
                show_help
                exit 1
                ;;
        esac
    done

    print_banner
    check_docker
    check_dist

    if [ "$USE_COMPOSE" = "yes" ]; then
        run_with_compose
    elif [ "$USE_COMPOSE" = "no" ]; then
        run_with_docker
    else
        if check_docker_compose; then
            run_with_compose
        else
            run_with_docker
        fi
    fi

    show_result
}

main "$@"
