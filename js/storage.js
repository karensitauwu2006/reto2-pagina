const STORAGE_KEY = "cv_terminal_registry";  // constante para el nombre de la key

export function getAllCVs() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : []; // ternaria para hacerlo mas facil
}

export function saveCV(cvData) {
  const currentList = getAllCVs();
  currentList.unshift(cvData);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(currentList));
}

export function deleteCV(id) {
  const currentList = getAllCVs();
  const updatedList = currentList.filter((cv) => cv.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
}

export function fileToBase64(file) { // esto es para convertir la imagen a base64 para que el navegador pueda tener una imagen
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export function readJsonFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error("No se proporcionó ningún archivo."));
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        resolve(parsed);
      } catch (err) {
        reject(new Error("El archivo contiene un formato JSON inválido."));
      }
    };
    reader.onerror = () => reject(new Error("Error al leer el archivo."));
    reader.readAsText(file);
  });
}
