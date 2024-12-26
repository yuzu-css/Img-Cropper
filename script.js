    <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js"></script>
        let cropper;
        let isCircle = false;

        // 크기 동기화
        const sizeRange = document.getElementById('sizeRange');
        const sizeInput = document.getElementById('sizeInput');

        sizeRange.addEventListener('input', (e) => {
            sizeInput.value = e.target.value;
        });

        sizeInput.addEventListener('input', (e) => {
            sizeRange.value = e.target.value;
        });

        // 드래그 앤 드롭 설정
        const dropZone = document.getElementById('dropZone');
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = 'var(--primary)';
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.style.borderColor = 'var(--border)';
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = 'var(--border)';
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                handleImage(file);
            }
        });

        // 파일 입력 처리
        document.getElementById('fileInput').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                handleImage(file);
            }
        });

        function handleImage(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.getElementById('preview');
                preview.src = e.target.result;
                document.querySelector('.image-container').style.display = 'block';
                document.querySelector('.result-container').style.display = 'none';
                
                if (cropper) {
                    cropper.destroy();
                }

                cropper = new Cropper(preview, {
                    aspectRatio: 1,
                    viewMode: 1,
                    dragMode: 'move',
                    autoCropArea: 1,
                    responsive: true
                });
            };
            reader.readAsDataURL(file);
        }

        // 줌 컨트롤
        document.getElementById('zoomRange').addEventListener('input', (e) => {
            if (cropper) {
                cropper.zoomTo(e.target.value);
            }
        });

        // 모양 토글
        document.getElementById('squareBtn').addEventListener('click', () => {
            isCircle = false;
            document.getElementById('result').style.borderRadius = '0';
            document.getElementById('squareBtn').classList.add('active');
            document.getElementById('circleBtn').classList.remove('active');
        });

        document.getElementById('circleBtn').addEventListener('click', () => {
            isCircle = true;
            document.getElementById('result').style.borderRadius = '50%';
            document.getElementById('circleBtn').classList.add('active');
            document.getElementById('squareBtn').classList.remove('active');
        });

        // 크롭 처리
        document.getElementById('cropBtn').addEventListener('click', () => {
            if (!cropper) return;
            
            const size = document.getElementById('sizeInput').value;
            const canvas = cropper.getCroppedCanvas({
                width: size,
                height: size
            });

            const result = document.getElementById('result');
            result.src = canvas.toDataURL();
            result.style.width = size + 'px';
            result.style.height = size + 'px';
            result.style.borderRadius = isCircle ? '50%' : '0';
            
            document.querySelector('.result-container').style.display = 'block';
        });

        // 다운로드 처리
        document.getElementById('downloadBtn').addEventListener('click', () => {
            const result = document.getElementById('result');
            const link = document.createElement('a');
            link.download = 'cropped-image.png';
            link.href = result.src;
            link.click();
        });
