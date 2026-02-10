function handleUpload(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // 1. Tambah ke senarai aset di Sidebar
            const fileList = document.getElementById('file-list');
            const newFile = document.createElement('div');
            newFile.className = 'file-item';
            newFile.style.backgroundImage = `url(${e.target.result})`;
            newFile.onclick = () => useImage(e.target.result);
            fileList.appendChild(newFile);

            // 2. Paparkan terus di ruang imej utama
            useImage(e.target.result);
        };
        
        reader.readAsDataURL(input.files[0]);
    }
}

function useImage(src) {
    const display = document.getElementById('image-display');
    const placeholder = document.getElementById('placeholder-text');
    
    placeholder.classList.add('hidden');
    display.style.backgroundImage = `url(${src})`;
    display.style.backgroundSize = 'cover';
    display.style.backgroundPosition = 'center';
}

// Logik Drag & Drop (Optional tetapi Pro)
const dropArea = document.getElementById('image-display');
const overlay = document.getElementById('drop-overlay');

dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    overlay.style.display = 'flex';
});

dropArea.addEventListener('dragleave', () => {
    overlay.style.display = 'none';
});

dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    overlay.style.display = 'none';
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleUpload({ files: files });
    }
});
