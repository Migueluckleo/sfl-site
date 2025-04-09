document.addEventListener('DOMContentLoaded', () => {
    
    const spaceId = '66pvce1phcp9';
    const accessToken = 'xeyWli74_ptoyMDNU_lGleOGGwvXFiuAfE55cLX9m-8';
    const environment = 'master';
  
    fetch(`https://cdn.contentful.com/spaces/${spaceId}/environments/${environment}/entries?access_token=${accessToken}&content_type=heroHome&include=1`)
      .then(response => response.json())
      .then(data => {
        console.log("✅ DATA COMPLETA:", data);
  
        if (!data.items.length) {
          console.error("⚠️ No se encontraron entradas.");
          return;
        }
  
        const entry = data.items[0].fields;
        console.log("📝 ENTRY:", entry);
  
        const heroTitulo = document.getElementById('heroTitulo');
        const heroResaltado = document.getElementById('heroResaltado');
        const heroDescripcion = document.getElementById('heroDescripcion');
        const heroBackground = document.getElementById('heroBackground');
  
        
        if (heroTitulo) {
            heroTitulo.innerHTML = `${entry.heroTitulo || "Sin título"} <span id="heroResaltado" class="font-medium text-sf-blue">${entry.heroTitleBrand || "Sin destacado"}</span>`;
          }
          
        if (heroResaltado) heroResaltado.innerText = entry.heroTitleBrand || "Sin destacado";
  
        if (heroDescripcion) {
          if (entry.heroDescription) {
            heroDescripcion.innerText = extractTextFromRichText(entry.heroDescription);
          } else {
            heroDescripcion.innerText = "Sin descripción";
          }
        }
  
        if (entry.heroBackground && entry.heroBackground.sys) {
          const assetId = entry.heroBackground.sys.id;
          const asset = data.includes.Asset.find(asset => asset.sys.id === assetId);
  
          if (asset && asset.fields.file.url) {
            const imageUrl = `https:${asset.fields.file.url}`;
            if (heroBackground) heroBackground.style.backgroundImage = `url('${imageUrl}')`;
          } else {
            console.error("⚠️ No se encontró la imagen del fondo.");
          }
        } else {
          console.error("⚠️ No hay campo heroBackground en la entry.");
        }
      })
      .catch(error => console.error("❌ ERROR en la petición:", error));
  });
  
  function extractTextFromRichText(richTextField) {
    return richTextField.content
      .map(block => block.content.map(text => text.value).join(''))
      .join('\n');
  }
  