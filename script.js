document.addEventListener('DOMContentLoaded', function () {
    const tilesContainer = document.getElementById('tiles-container');
    const addUrlForm = document.getElementById('add-url-form');
    const urlTitleInput = document.getElementById('url-title');
    const urlAddressInput = document.getElementById('url-address');

    function saveTiles(tiles) {
        localStorage.setItem('tilesData', JSON.stringify(tiles));
    }

    function loadTiles() {
        const tilesData = localStorage.getItem('tilesData');
        if (tilesData) {
            return JSON.parse(tilesData);
        } else {
            return [];
        }
    }

    function createTile(title, url, index) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.dataset.index = index;

        const checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        checkBox.classList.add('tile-checkbox');
        tile.appendChild(checkBox);

        const link = document.createElement('a');
        link.href = url;
        link.textContent = title;
        tile.appendChild(link);

        tilesContainer.appendChild(tile);
    }

    addUrlForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const title = urlTitleInput.value.trim();
        const url = urlAddressInput.value.trim();
        if (title && url) {
            const tiles = loadTiles();
            tiles.push({ title, url });
            saveTiles(tiles);

            createTile(title, url, tiles.length - 1);

            urlTitleInput.value = '';
            urlAddressInput.value = '';
        }
    });

    const tiles = loadTiles();
    tiles.forEach((tile, index) => createTile(tile.title, tile.url, index));

    function exportTiles() {
        const tilesData = JSON.stringify(loadTiles());
        const dataBlob = new Blob([tilesData], { type: 'application/json' });
        const dataUrl = URL.createObjectURL(dataBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = dataUrl;
        downloadLink.download = 'tiles-data.json';
        downloadLink.click();
    }

    function importTiles(event) {
        const file = event.target.files[0];
        const fileReader = new FileReader();

        fileReader.onload = function (e) {
            const importedTiles = JSON.parse(e.target.result);

            tilesContainer.innerHTML = '';

            importedTiles.forEach((tile, index) => createTile(tile.title, tile.url, index));

            saveTiles(importedTiles);
        };

        fileReader.readAsText(file);
    }

    const exportButton = document.getElementById('export-tiles');
    const importButton = document.getElementById('import-tiles');
    const importFileInput = document.getElementById('import-file');

    exportButton.addEventListener('click', exportTiles);
    importButton.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', importTiles);

    const toggleThemeButton = document.getElementById('toggle-theme');
    const htmlElement = document.documentElement;

    toggleThemeButton.addEventListener('click', function () {
        if (htmlElement.getAttribute('data-theme') === 'dark') {
            htmlElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            htmlElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    }

    function deleteSelectedTiles() {
        const checkBoxes = document.querySelectorAll('.tile-checkbox:checked');
        const tilesToDelete = Array.from(checkBoxes).map(checkBox => checkBox.parentElement);
        tilesToDelete.forEach(tile => tilesContainer.removeChild(tile));

        const updatedTiles = loadTiles().filter((_, index) => !tilesToDelete.some(tile => tile.dataset.index == index));
        saveTiles(updatedTiles);
    }

    const deleteSelectedTilesButton = document.getElementById('delete-selected-tiles');
    deleteSelectedTilesButton.addEventListener('click', deleteSelectedTiles);
});

   
