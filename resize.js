
function extractCoordinatesFromMap(mapElement) {
    
    const coordinates = {};
    const areas = mapElement.querySelectorAll('area');

    areas.forEach(function(area) {
        const areaName = area.getAttribute('alt').toLowerCase();
        const areaCoords = area.getAttribute('coords').split(',').map(coord => parseInt(coord));
        coordinates[areaName] = areaCoords;
    });

    return coordinates;
}

// Fonction pour ajuster les coordonnées de l'ImageMap en fonction de la taille de l'image
function adjustImageMapCoordinates(mapName, originalImageWidth, originalCoordinates) {

    var imageMap = document.querySelector(`map[name="${mapName}"]`);
    var image = imageMap.previousElementSibling; // Récupérer l'élément img précédent (l'image)
    var scale = image.width / originalImageWidth;

    var areas = imageMap.querySelectorAll('area');
    areas.forEach(function(area) {
        
        var areaName = area.getAttribute('alt').toLowerCase(); // Utiliser le nom comme clé pour les coordonnées d'origine
        var originalCoords = originalCoordinates[areaName];
        
        var updatedCoords = [];

        originalCoords.forEach(function(coord) {
            updatedCoords.push(Math.round(coord * scale));
        });

        area.setAttribute('coords', updatedCoords.join(','));
    });
}

// Fonction pour appeler la fonction d'ajustement lors de l'initialisation et du redimensionnement
function initializeAndAdjust(mapName) {
    var imageMap = document.querySelector('map[name="image_map"]');
    var imageOrigin = imageMap.previousElementSibling; // Récupérer l'élément img précédent (l'image)
    
    const originalImageWidth = imageOrigin.width;
    const originalCoordinates = extractCoordinatesFromMap(imageMap);
    
    imageOrigin.classList.add('image');
    
    window.listeMap[mapName] = [originalImageWidth, originalCoordinates];
    
    // Appelez la fonction d'initialisation au chargement de la page
    window.addEventListener('load', function() {
        adjustImageMapCoordinates(mapName, window.listeMap[mapName][0], window.listeMap[mapName][1]);
    });
    
    // Appelez la fonction d'ajustement lors du redimensionnement de la fenêtre
    window.addEventListener('resize', function() {
        adjustImageMapCoordinates(mapName, window.listeMap[mapName][0], window.listeMap[mapName][1])
    });
}

var listeMap = {};
