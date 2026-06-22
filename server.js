const http = require('http');
const fs = require('fs');
const path = require('path');

// 🛠️ SỬA 1: Dùng PORT động của Render cấp, nếu không có mới dùng 3000
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.gltf': 'model/gltf+json',
    '.bin': 'application/octet-stream',
    '.glb': 'model/gltf-binary',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
    let safeUrl = decodeURIComponent(req.url);
    
    // Loại bỏ các tham số query (vớ vẩn như ?v=1.2) nếu có để tránh lệch đường dẫn file
    if (safeUrl.includes('?')) {
        safeUrl = safeUrl.split('?')[0];
    }

    // 🛠️ SỬA 2: Chuẩn hóa đường dẫn gốc trỏ file chuẩn xác trên Linux
    let filePath;
    if (safeUrl === '/') {
        filePath = path.join(__dirname, 'index.html');
    } else {
        filePath = path.join(__dirname, safeUrl);
    }

    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Access Forbidden');
        return;
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('<h1>404 Not Found</h1><p>Server không tìm thấy file bạn yêu cầu.</p>', 'utf-8');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n🚀 Developer Profile server is active!`);
    console.log(`🔗 Address: http://localhost:${PORT}/`);
});