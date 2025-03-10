document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const colorBtns = document.querySelectorAll('.color-btn');
    const clearBtn = document.getElementById('clearBtn');
    const saveBtn = document.getElementById('saveBtn');
    
    // Настройка размера холста
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 100; // Учитываем высоту палитры и кнопок
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Переменные для рисования
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let currentColor = '#FF0000'; // Красный по умолчанию
    let brushSize = 5;
    let longPressTimer = null;
    let isSmearing = false;
    let smearRadius = 10;
    
    // Обработчики событий для рисования
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);
    
    // Выбор цвета
    colorBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currentColor = this.getAttribute('data-color');
            colorBtns.forEach(b => b.style.borderWidth = '2px');
            this.style.borderWidth = '4px';
        });
    });
    
    // Очистка холста
    clearBtn.addEventListener('click', function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    
    // Сохранение изображения
    saveBtn.addEventListener('click', function() {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'rainbow-drawing.png';
        link.click();
    });
    
    function handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        isDrawing = true;
        
        // Получаем координаты касания относительно холста
        const rect = canvas.getBoundingClientRect();
        lastX = touch.clientX - rect.left;
        lastY = touch.clientY - rect.top;
        
        // Запускаем таймер для определения длительного нажатия
        longPressTimer = setTimeout(() => {
            isSmearing = true;
        }, 500); // 500мс для определения длительного нажатия
    }
    
    function handleTouchMove(e) {
        e.preventDefault();
        if (!isDrawing) return;
        
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const currentX = touch.clientX - rect.left;
        const currentY = touch.clientY - rect.top;
        
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        
        if (isSmearing) {
            // Эффект размазывания
            smear(currentX, currentY);
        } else {
            // Обычное рисование
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(currentX, currentY);
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = brushSize;
            ctx.stroke();
        }
        
        lastX = currentX;
        lastY = currentY;
    }
    
    function handleTouchEnd() {
        isDrawing = false;
        isSmearing = false;
        clearTimeout(longPressTimer);
    }
    
    function smear(x, y) {
        // Создаем эффект размазывания
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, smearRadius);
        gradient.addColorStop(0, currentColor);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.2; // Прозрачность для эффекта размазывания
        ctx.beginPath();
        ctx.arc(x, y, smearRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
    
    // Выбираем первый цвет по умолчанию
    colorBtns[0].style.borderWidth = '4px';
});
