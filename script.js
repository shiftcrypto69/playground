/* script.js - Logik Editor: Upload, Paste Link, & Text Editor */

document.addEventListener('DOMContentLoaded', () => {
    const canvasArea = document.getElementById('canvasArea');
    const previewList = document.getElementById('previewList');
    const fileInput = document.getElementById('fileInput');
    const uploadZone = document.getElementById('uploadZone');
    const imageLinkInput = document.getElementById('imageLinkInput');
    const placeholderText = document.getElementById('placeholderText');

    // --- 1. FUNGSI MUAT NAIK GAMBAR (UPLOAD) ---
    uploadZone.onclick = () => fileInput.click();

    fileInput.onchange = (e) => {
        const files = e.target.files;
        handleFiles(files);
    };

    function handleFiles(files) {
        for (let file of files) {
            const reader = new FileReader();
            reader.onload = (e) => addImageToSidebar(e.target.result);
            reader.readAsDataURL(file);
        }
    }

    // --- 2. FUNGSI PASTE LINK GAMBAR ---
    imageLinkInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && imageLinkInput.value !== "") {
            addImageToSidebar(imageLinkInput.value);
            imageLinkInput.value = ""; // Kosongkan input
        }
    });

    // --- 3. TAMBAH GAMBAR KE SIDEBAR & FUNGSI BUANG ---
    function addImageToSidebar(src) {
        const item = document.createElement('div');
        item.className = 'file-item';
        item.style.backgroundImage = `url('${src}')`;

        // Butang Buang (X)
        const delBtn = document.createElement('button');
        delBtn.className = 'btn-delete';
        delBtn.innerHTML = '×';
        delBtn.onclick = (e) => {
            e.stopPropagation();
            item.remove();
        };

        // Klik gambar di sidebar untuk letak di kanvas
        item.onclick = () => {
            canvasArea.style.backgroundImage = `url('${src}')`;
            canvasArea.style.backgroundSize = 'cover';
            placeholderText.classList.add('hidden');
        };

        item.appendChild(delBtn);
        previewList.appendChild(item);
    }

    // --- 4. FUNGSI EDITOR TEKS ---
    const btnAddText = document.getElementById('btnAddText');
    const textInput = document.getElementById('textInput');
    const fontFamily = document.getElementById('fontFamily');
    const fontSize = document.getElementById('fontSize');
    const textColor = document.getElementById('textColor');

    btnAddText.onclick = () => {
        if (textInput.value.trim() === "") return;

        const textLayer = document.createElement('div');
        textLayer.className = 'text-layer';
        textLayer.innerText = textInput.value;
        
        // Tetapan Gaya Awal
        textLayer.style.fontFamily = fontFamily.value;
        textLayer.style.fontSize = fontSize.value + 'px';
        textLayer.style.color = textColor.value;
        textLayer.style.left = '50px';
        textLayer.style.top = '50px';

        // Fungsi Drag (Tarik Teks)
        makeElementDraggable(textLayer);

        // Klik untuk edit semula / aktifkan
        textLayer.addEventListener('mousedown', () => {
            document.querySelectorAll('.text-layer').forEach(el => el.classList.remove('active'));
            textLayer.classList.add('active');
            
            // Masukkan balik nilai ke sidebar untuk editing
            textInput.value = textLayer.innerText;
        });

        canvasArea.appendChild(textLayer);
        placeholderText.classList.add('hidden');
        textInput.value = "";
    };

    // --- 5. LOGIK DRAG & DROP UNTUK TEKS ---
    function makeElementDraggable(elmnt) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        elmnt.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
});
