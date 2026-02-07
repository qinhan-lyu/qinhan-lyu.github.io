document.addEventListener("DOMContentLoaded", function() {
    const slideshows = document.querySelectorAll('.slideshow-container');

    slideshows.forEach(async container => {
        const paperId = container.getAttribute('data-paper');
        const projectId = container.getAttribute('data-project');
        const basePath = paperId
            ? `src/images/papers/${paperId}/`
            : projectId
                ? `src/images/projects/${projectId}/`
                : null;
        const galleryLabel = paperId || projectId;

        if (!basePath) return;
        
        // 定义我们要尝试加载的文件名列表
        // 建议用户将图片命名为 1.png, 2.png, 3.png 等，或者 teaser.png
        const potentialFilenames = [
            'teaser.png', 'teaser.jpg', 'teaser.jpeg',
            '1.png', '1.jpg', '1.jpeg',
            '2.png', '2.jpg', '2.jpeg',
            '3.png', '3.jpg', '3.jpeg',
            '4.png', '4.jpg', '4.jpeg',
            '5.png', '5.jpg', '5.jpeg',
            '6.png', '6.jpg', '6.jpeg'
        ];

        const validImages = [];

        // 检查图片是否存在的辅助函数
        const checkImage = (src) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(true);
                img.onerror = () => resolve(false);
                img.src = src;
            });
        };

        // 并行检查所有可能的图片文件名
        // 注意：这会在控制台产生一些 404 错误，这是正常的探测行为
        const checks = potentialFilenames.map(async (filename) => {
            const src = basePath + filename;
            const exists = await checkImage(src);
            if (exists) {
                return filename;
            }
            return null;
        });

        const results = await Promise.all(checks);
        
        // 过滤出存在的文件名，并按照原列表顺序排序（优先显示 teaser, 然后 1, 2, 3...）
        potentialFilenames.forEach(name => {
            if (results.includes(name)) {
                validImages.push(name);
            }
        });

        // 清空容器（移除 Loading...）
        container.innerHTML = '';

        if (validImages.length === 0) {
             const div = document.createElement('div');
             div.style.cssText = "width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#eee; color:#666; font-size:12px; text-align:center; padding:10px;";
             div.innerHTML = 'Image not found<br>(Rename to 1.png/jpg)';
             container.appendChild(div);
             return;
        }

        // 创建图片元素
        validImages.forEach((filename, index) => {
            const img = document.createElement('img');
            img.src = basePath + filename;
            img.alt = `${galleryLabel} image`;
            
            // 第一张图片默认显示
            if (index === 0) img.classList.add('active');
            
            container.appendChild(img);
        });

        // 如果只有一张图片，不需要轮播
        if (validImages.length <= 1) return;

        // 启动轮播
        let currentIndex = 0;
        const imgElements = container.querySelectorAll('img');
        
        setInterval(() => {
            // 隐藏当前图片
            imgElements[currentIndex].classList.remove('active');
            
            // 计算下一张图片的索引
            currentIndex = (currentIndex + 1) % imgElements.length;
            
            // 显示下一张图片
            imgElements[currentIndex].classList.add('active');
        }, 3000); // 3秒切换一次
    });
});