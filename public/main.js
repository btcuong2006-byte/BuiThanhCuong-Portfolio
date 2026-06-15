// ==========================================================================
// 1. TƯƠNG TÁC VÀ ĐIỀU HƯỚNG BỘ THẺ XẾP CHỒNG
// ==========================================================================
const $cards = $('.deck-card');

function activateCard(clickedCard) {
    const $clickedCard = $(clickedCard);
    if (!$clickedCard.length) return;
    
    // Tắt kích hoạt thẻ hiện tại
    $cards.removeClass('active');
    
    // Kích hoạt thẻ được chọn
    $clickedCard.addClass('active');
    
    // Sắp xếp lại chỉ số z-index: Thẻ đang hoạt động sẽ cao nhất, các thẻ khác xếp chồng xuống bên dưới
    const clickedIndex = parseInt($clickedCard.attr('data-index'), 10);
    
    $cards.each(function() {
        const $card = $(this);
        const cardIndex = parseInt($card.attr('data-index'), 10);
        let zIndex = 1;
        
        if (cardIndex === clickedIndex) {
            zIndex = $cards.length + 1; // Đưa lên hàng đầu
        } else if (cardIndex > clickedIndex) {
            zIndex = $cards.length - (cardIndex - clickedIndex);
        } else {
            zIndex = clickedIndex - cardIndex;
        }
        
        $card.css('--z-index', zIndex);
    });

    // Cập nhật trạng thái kích hoạt trên các liên kết nav
    const targetId = $clickedCard.attr('id');
    $('.nav-link').each(function() {
        const $link = $(this);
        $link.toggleClass('active', $link.attr('data-target') === targetId);
    });

    // Nếu chọn Thẻ 3 (Kỹ năng công nghệ), kích hoạt hoạt ảnh tự động chẩn đoán hệ thống
    if (targetId === 'card-tech') {
        triggerSkillsDiagnostics();
    }
}

// Gắn sự kiện click cho các thẻ
$cards.on('click', function() {
    activateCard(this);
});

// ==========================================================================
// 2. BỘ TẢI CHẨN ĐOÁN KỸ NÀNG TRÊN THẺ
// ==========================================================================
let diagTimeout1 = null;
let diagTimeout2 = null;

function triggerSkillsDiagnostics() {
    const $diagStatus = $('#diag-status');
    const $diagAction = $('#diag-action');
    
    if (!$diagStatus.length || !$diagAction.length) return;

    // Xóa mọi bộ đếm thời gian đang hoạt động để tránh chồng chéo
    clearTimeout(diagTimeout1);
    clearTimeout(diagTimeout2);

    // Giai đoạn 1: Biên dịch hệ thống chẩn đoán
    $diagStatus.text('STATUS // COMPILING...');
    $diagAction.text('[ RUNNING DIAGNOSTIC SYSTEM CHECK ]');

    // Giai đoạn 2: Hoàn thành
    diagTimeout1 = setTimeout(() => {
        $diagStatus.text('STATUS // SECURE');
        $diagAction.text('[ ANALYSIS COMPLETE // ALL SYSTEMS NOMINAL ]');
    }, 1200);
}

// ==========================================================================
// 3. BỘ TRÌNH CHIẾU DỰ ÁN CAROUSEL
// ==========================================================================
const projectsData = [
    {
        index: "PROJECT 01 // 03",
        title: "SKETCH PORTFOLIO ENGINE",
        desc: "This modular HTML5/CSS3 portfolio using hand-drawn ink doodles, SVG filters, and keyboard terminal listeners.",
        image: "public/image/project_sketch_index.png",
        gitLink: "https://github.com/cuongbui/sketch-portfolio",
        tags: ["HTML5 Canvas", "SVG Filters", "Parchment UI"]
    },
    {
        index: "PROJECT 02 // 03",
        title: "AURA STYLES STOREFRONT",
        desc: "Minimalist, premium ecommerce front-end layout featuring strict grid structures, fine borders, and custom CSS page transitions.",
        image: "public/image/project_aura_index.png",
        gitLink: "https://github.com/cuongbui/aura-storefront",
        tags: ["HTML5", "Vanilla CSS", "Grid Layout"]
    },
    {
        index: "PROJECT 03 // 03",
        title: "SYNAPSE CANVAS ENGINE",
        desc: "Lightweight HTML5 Canvas simulation drawing algorithmic particle networks responding to mouse force-fields.",
        image: "public/image/project_canvas_index.png",
        gitLink: "https://github.com/cuongbui/synapse-engine",
        tags: ["JS Canvas", "Vector Math", "Optimized"]
    }
];

let currentProjectIndex = 0;

const $dialImg = $('#dial-project-img');
const $dialGitLink = $('#project-git-link');
const $dialIndex = $('#dial-meta-index');
const $dialTitle = $('#dial-project-title');
const $dialDesc = $('#dial-project-desc');
const $dialTags = $('#dial-project-tags');

const $dialWheel = $('#dial-wheel-spin');
const $rectFrame = $('#project-rect-frame');

function updateProject(index) {
    if (index < 0) index = projectsData.length - 1;
    if (index >= projectsData.length) index = 0;
    
    currentProjectIndex = index;
    const proj = projectsData[index];
    
    // 1. Quay vòng xoay HUD điều khiển (120 độ cho mỗi dự án)
    if ($dialWheel.length) {
        $dialWheel.css('transform', `rotate(${-currentProjectIndex * 120}deg)`);
    }

    // 2. Kích hoạt hiệu ứng chuyển đổi thẻ theo quỹ đạo tròn
    if ($rectFrame.length) {
        $rectFrame.removeClass('orbit-out orbit-in');
        void $rectFrame[0].offsetWidth; // Buộc trình duyệt reflow để reset keyframes CSS
        
        $rectFrame.addClass('orbit-out');
        
        // Điểm giữa của hoạt ảnh: Đổi ảnh/chữ và đưa thẻ mới xoay vào
        setTimeout(() => {
            if ($dialImg.length) $dialImg.attr('src', proj.image);
            if ($dialGitLink.length) $dialGitLink.attr('href', proj.gitLink);
            if ($dialIndex.length) $dialIndex.text(proj.index);
            if ($dialTitle.length) $dialTitle.text(proj.title);
            if ($dialDesc.length) $dialDesc.text(proj.desc);
            
            if ($dialTags.length) {
                $dialTags.empty();
                proj.tags.forEach(tag => {
                    $('<span>').addClass('p-tag').text(tag).appendTo($dialTags);
                });
            }
            
            $rectFrame.removeClass('orbit-out').addClass('orbit-in');
        }, 180);

        // Dọn dẹp các lớp hoạt ảnh khi hoàn tất
        setTimeout(() => {
            $rectFrame.removeClass('orbit-in');
        }, 550);
    }
}

$('#dial-prev').on('click', (e) => {
    e.stopPropagation(); // Ngăn chặn kích hoạt tiêu điểm bộ thẻ
    updateProject(currentProjectIndex - 1);
});

$('#dial-next').on('click', (e) => {
    e.stopPropagation(); // Ngăn chặn kích hoạt tiêu điểm bộ thẻ
    updateProject(currentProjectIndex + 1);
});

// ==========================================================================
// 4. BỘ CHUYỂN ĐỔI CHỦ ĐỀ SÁNG/TỐI
// ==========================================================================
const $themeToggle = $('#theme-toggle');
const $themeIcon = $themeToggle.find('.toggle-icon');

// Kiểm tra cài đặt đã lưu
const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
if (savedTheme === 'dark') {
    $('body').removeClass('light-mode').addClass('dark-mode');
    $themeIcon.text('☼');
} else {
    $('body').removeClass('dark-mode').addClass('light-mode');
    $themeIcon.text('◐');
}

$themeToggle.on('click', () => {
    const isLight = $('body').hasClass('light-mode');
    $('body').toggleClass('light-mode dark-mode');
    $themeIcon.text(isLight ? '☼' : '◐');
    localStorage.setItem('portfolio-theme', isLight ? 'dark' : 'light');
    addTerminalLine(isLight ? 'Theme switched to DARK mode.' : 'Theme switched to LIGHT mode.', 'green');
});

// ==========================================================================
// 5. LIÊN KẾT ĐIỀU HƯỚNG THANH HUD HEADER
// ==========================================================================
$('.nav-link').on('click', function(e) {
    e.preventDefault();
    const $link = $(this);
    const targetId = $link.attr('data-target');
    
    $('.nav-link').removeClass('active');
    $link.addClass('active');
    
    if (targetId === 'hero') {
        $('#hero')[0].scrollIntoView({ behavior: 'smooth' });
    } else {
        const $targetCard = $('#' + targetId);
        if ($targetCard.length) {
            activateCard($targetCard);
            // Cuộn bộ thẻ vào vùng hiển thị
            $('.stack-section')[0].scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// ==========================================================================
// 6. ĐỒNG HỒ SỐ CHẠY TRỰC TIẾP
// ==========================================================================
function updateTime() {
    const $liveTime = $('#live-time');
    if (!$liveTime.length) return;
    const now = new Date();
    const options = {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    const timeStr = now.toLocaleTimeString('en-US', options);
    $liveTime.text(`${timeStr} GMT+7`);
}
setInterval(updateTime, 1000);
updateTime();

// ==========================================================================
// 7. TERMINAL HỆ THỐNG TƯƠNG TÁC (Ngăn kéo Terminal)
// ==========================================================================
const $termToggle = $('#term-toggle');
const $termWindow = $('#terminal-window');
const $termForm = $('#terminal-form');
const $termInput = $('#terminal-input');
const $termOutput = $('#terminal-output');

$termToggle.on('click', () => {
    $termWindow.toggleClass('expanded');
    const isExpanded = $termWindow.hasClass('expanded');
    $termToggle.text(isExpanded ? 'COLLAPSE [v]' : 'EXPAND [^]');
    if (isExpanded) $termInput.focus();
});

function addTerminalLine(text, className = '') {
    $('<div>')
        .addClass(`term-line ${className}`)
        .text(text)
        .appendTo($termOutput);
    $termOutput.scrollTop($termOutput[0].scrollHeight);
}

$termForm.on('submit', (e) => {
    e.preventDefault();
    const cmd = $termInput.val().trim().toLowerCase();
    $termInput.val('');
    
    if (!cmd) return;
    
    // In dòng lệnh do người dùng nhập
    addTerminalLine(`guest@cuongbui:~# ${cmd}`, 'orange');
    
    // Trình phân tích lệnh
    setTimeout(() => {
        if (cmd === '/help') {
            addTerminalLine('Available commands list:', 'green');
            addTerminalLine('  /about       - Focus Identity stats Card [01]');
            addTerminalLine('  /process     - Focus Work Process Card [02]');
            addTerminalLine('  /skills      - Focus & Run diagnostics on Tech Card [03]');
            addTerminalLine('  /projects    - Focus Selected Works Card [04]');
            addTerminalLine('  /theme       - Toggles system colors (Light/Dark)');
            addTerminalLine('  /clear       - Flush console log outputs');
            addTerminalLine('  /ping        - Query connection latency');
        } else if (cmd === '/about') {
            addTerminalLine('Locating Subject Identity card...', 'green');
            const $card = $('#card-identity');
            activateCard($card);
            $('.stack-section')[0].scrollIntoView({ behavior: 'smooth' });
            addTerminalLine('Identity Card focused.', 'green');
        } else if (cmd === '/process') {
            addTerminalLine('Locating Process Methodology card...', 'green');
            const $card = $('#card-process');
            activateCard($card);
            $('.stack-section')[0].scrollIntoView({ behavior: 'smooth' });
            addTerminalLine('Process Card focused.', 'green');
        } else if (cmd === '/skills' || cmd === '/skill') {
            addTerminalLine('Focusing Tech Stack Card [03] and running diagnostics...', 'green');
            const $card = $('#card-tech');
            activateCard($card);
            $('.stack-section')[0].scrollIntoView({ behavior: 'smooth' });
            addTerminalLine('Check Card [03] for output progress.', 'green');
        } else if (cmd === '/projects') {
            addTerminalLine('Locating Projects repositories card...', 'green');
            const $card = $('#card-projects');
            activateCard($card);
            $('.stack-section')[0].scrollIntoView({ behavior: 'smooth' });
            addTerminalLine('Works Card focused.', 'green');
        } else if (cmd === '/theme') {
            $themeToggle.click();
        } else if (cmd === '/clear') {
            $termOutput.empty();
            addTerminalLine('Console logs flushed.', 'gray');
        } else if (cmd === '/ping') {
            addTerminalLine('echo.response() // pong. Latency: 16ms. Connection secure.', 'green');
        } else {
            addTerminalLine(`Error // Command not compiled: '${cmd}'. Type '/help' for assistance.`, 'red');
        }
    }, 100);
});

// Tự động mở rộng terminal nếu người dùng gõ vào khi nó đang thu nhỏ
$termInput.on('focus', () => {
    if (!$termWindow.hasClass('expanded')) {
        $termToggle.click();
    }
});