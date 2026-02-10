/* script.js - Logik Editor: Upload, Paste Link, Text Editor & Canvas Ratio */

document.addEventListener('DOMContentLoaded', () => {
    const canvasArea = document.getElementById('canvasArea');
    const previewList = document.getElementById('previewList');
    const fileInput = document.getElementById('fileInput');
    const uploadZone = document.getElementById('uploadZone');
    const imageLinkInput = document.getElementById('imageLinkInput');
    const placeholderText = document.getElementById('placeholderText');
    
    // Elemen Kawalan Teks
    const btnAddText = document.getElementById('btnAddText');
    const textInput = document.getElementById('textInput');
    const fontFamily = document.getElementById('fontFamily');
    const fontSize = document.getElementById('fontSize');
    const textColor = document.getElementById('textColor');

    let activeTextLayer = null;

    // --- 1. FUNGSI MUAT NAIK GAMBAR (UPLOAD) ---
    if (uploadZone) {
        uploadZone.onclick = () => fileInput.click();
    }

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
            imageLinkInput.value = ""; 
        }
    });

    // --- 3. TAMBAH GAMBAR KE SIDEBAR & FUNGSI BUANG ---
    function addImageToSidebar(src) {
        const item = document.createElement('div');
        item.className = 'file-item';
        item.style.backgroundImage = `url('${src}')`;

        const delBtn = document.createElement('button');
        delBtn.className = 'btn-delete';
        delBtn.innerHTML = '×';
        delBtn.onclick = (e) => {
            e.stopPropagation();
            item.remove();
        };

        item.onclick = () => {
            canvasArea.style.backgroundImage = `url('${src}')`;
            canvasArea.style.backgroundSize = 'cover';
            canvasArea.style.backgroundPosition = 'center';
            if (placeholderText) placeholderText.classList.add('hidden');
        };

        item.appendChild(delBtn);
        previewList.appendChild(item);
    }

    // --- 4. FUNGSI EDITOR TEKS ---
    btnAddText.onclick = () => {
        if (textInput.value.trim() === "") return;

        const textLayer = document.createElement('div');
        textLayer.className = 'text-layer';
        textLayer.innerText = textInput.value;
        
        // Tetapan Gaya Awal
        textLayer.style.fontFamily = fontFamily.value;
        textLayer.style.fontSize = fontSize.value + 'px';
        textLayer.style.color = textColor.value;
        textLayer.style.left = '20px';
        textLayer.style.top = '20px';
        textLayer.style.position = 'absolute';
        textLayer.style.cursor = 'move';

        makeElementDraggable(textLayer);

        textLayer.addEventListener('mousedown', () => {
            setActiveLayer(textLayer);
        });

        canvasArea.appendChild(textLayer);
        if (placeholderText) placeholderText.classList.add('hidden');
        textInput.value = "";
        setActiveLayer(textLayer);
    };

    // Fungsi Set Aktif (Sync Sidebar & Kanvas)
    function setActiveLayer(layer) {
        document.querySelectorAll('.text-layer').forEach(el => el.classList.remove('active'));
        activeTextLayer = layer;
        activeTextLayer.classList.add('active');
        
        // Sync nilai sidebar dengan lapisan yang dipilih
        textInput.value = activeTextLayer.innerText;
        fontFamily.value = activeTextLayer.style.fontFamily;
        fontSize.value = parseInt(activeTextLayer.style.fontSize);
        textColor.value = rgbToHex(activeTextLayer.style.color);
    }

    // Kemaskini Teks Secara Real-time
    textInput.oninput = () => { if (activeTextLayer) activeTextLayer.innerText = textInput.value; };
    fontFamily.onchange = () => { if (activeTextLayer) activeTextLayer.style.fontFamily = fontFamily.value; };
    fontSize.oninput = () => { if (activeTextLayer) activeTextLayer.style.fontSize = fontSize.value + 'px'; };
    textColor.oninput = () => { if (activeTextLayer) activeTextLayer.style.color = textColor.value; };

    // --- 5. LOGIK DRAG & DROP ---
    function makeElementDraggable(elmnt) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        elmnt.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
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

    // --- 6. FUNGSI ADJUST RATIO KANVAS ---
    const ratioButtons = document.querySelectorAll('.btn-ratio');

    ratioButtons.forEach(btn => {
        btn.onclick = () => {
            const ratio = btn.getAttribute('data-ratio');
            
            // Buang kelas aktif dari butang lain
            ratioButtons.forEach(b => b.classList.remove('active-ratio'));
            btn.classList.add('active-ratio');

            // Tukar saiz kanvas berdasarkan nisbah
            if (ratio === '1/1') {
                canvasArea.style.aspectRatio = "1 / 1";
                canvasArea.style.width = "100%";
                canvasArea.style.maxWidth = "500px";
            } else if (ratio === '4/3') {
                canvasArea.style.aspectRatio = "4 / 3";
                canvasArea.style.width = "100%";
                canvasArea.style.maxWidth = "600px";
            } else if (ratio === '16/9') {
                canvasArea.style.aspectRatio = "16 / 9";
                canvasArea.style.width = "100%";
                canvasArea.style.maxWidth = "700px";
            }
        };
    });

    // Helper: Tukar RGB ke HEX untuk input color
    function rgbToHex(rgb) {
        if (!rgb || rgb.startsWith('#')) return rgb;
        const rgbValues = rgb.match(/\d+/g);
        if (!rgbValues) return '#000000';
        return "#" + rgbValues.map(x => {
            const hex = parseInt(x).toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }).join("");
    }

    // Padam Teks dengan butang Delete
    document.addEventListener('keydown', (e) => {
        if ((e.key === 'Delete' || e.key === 'Backspace') && activeTextLayer && 
            document.activeElement !== textInput && 
            document.activeElement !== imageLinkInput) {
            activeTextLayer.remove();
            activeTextLayer = null;
            textInput.value = "";
        }
    });
});
