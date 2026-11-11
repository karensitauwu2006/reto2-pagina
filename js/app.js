import {
  saveCV,
  getAllCVs,
  deleteCV,
  fileToBase64,
  readJsonFile,
} from "./storage.js";
import { filterCandidates } from "./filters.js";
import { renderCandidateCards, updateCounter } from "./ui.js"; // todos los imports, usando named exports

document.addEventListener("DOMContentLoaded", () => {
  const navTabs = document.querySelectorAll(".nav-tab");
  const viewSections = document.querySelectorAll(".view-section");
  const form = document.getElementById("cv-form");
  const photoInput = document.getElementById("input-photo");
  const photoImg = document.getElementById("photo-img");
  const photoPlaceholder = document.getElementById("photo-placeholder");
  const jsonInput = document.getElementById("input-json");
  const jsonLabel = document.getElementById("json-label");
  const cardsContainer = document.getElementById("cv-cards-container");
  const filterCategory = document.getElementById("filter-category");
  const searchTerm = document.getElementById("search-term"); // esto es para asegurarse de que el html cargo todo antes de trabajar con js

  let currentPhotoBase64 = null;

  navTabs.forEach((tab) => {
    tab.addEventListener("click", () => { //aqui recorre todoas las tabs que hay y a cada uan le pone el evento click, y le pone una funcion flecha a cada una
      navTabs.forEach((t) => t.classList.remove("active"));
      viewSections.forEach((s) => s.classList.remove("active"));

      tab.classList.add("active");
      const targetId = tab.dataset.tab;
      document.getElementById(targetId).classList.add("active");

      if (targetId === "view-list") {
        refreshCandidateList();
      }
    });
  });

  photoInput.addEventListener("change", async (e) => { // pone eevento asincrono 
    const file = e.target.files[0];
    if (file) {
      try {
        currentPhotoBase64 = await fileToBase64(file);
        photoImg.src = currentPhotoBase64;
        photoImg.classList.remove("hidden");
        photoPlaceholder.classList.add("hidden");
      } catch (err) {
        alert("Error cargando la fotografía: " + err.message);
      }
    } else {
      currentPhotoBase64 = null;
      photoImg.classList.add("hidden");
      photoPlaceholder.classList.remove("hidden");
    }
  });

  jsonInput.addEventListener("change", (e) => { // esto es para recoger los archivos, 
    const file = e.target.files[0];
    if (file) {
      jsonLabel.innerHTML = `<span>Archivo cargado:</span> ${file.name}`;
    } else {
      jsonLabel.innerHTML = `<span>Seleccionar archivo</span> o arrástralo aquí`;
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const jsonFile = jsonInput.files[0];
    if (!jsonFile) {
      alert("Por favor selecciona un archivo .json válido.");
      return;
    }

    try {
      const payloadData = await readJsonFile(jsonFile);

      const candidateRecord = {
        id: "cv_" + Date.now() + Math.random().toString(36).substr(2, 4),
        nombre: document.getElementById("input-nombre").value.trim(),
        apellidos: document.getElementById("input-apellidos").value.trim(),
        edad: parseInt(document.getElementById("input-edad").value, 10),
        puesto: document.getElementById("input-puesto").value.trim(),
        foto: currentPhotoBase64,
        payload: payloadData,
        fecha: new Date().toISOString(),
      };

      saveCV(candidateRecord);

      form.reset();
      currentPhotoBase64 = null;
      photoImg.classList.add("hidden");
      photoPlaceholder.classList.remove("hidden");
      jsonLabel.innerHTML = `<span>Seleccionar archivo</span> o arrástralo aquí`;

      updateCounter(getAllCVs().length);
      alert("¡Registro almacenado exitosamente en el sistema!");

      document.querySelector('[data-tab="view-list"]').click();
    } catch (err) {
      alert("Error procesando el currículum: " + err.message);
    }
  });

  function handleDelete(id) {
    if (confirm("¿Confirmar eliminación permanente de este registro?")) {
      deleteCV(id);
      refreshCandidateList();
    }
  }

  function refreshCandidateList() {
    const all = getAllCVs();
    updateCounter(all.length);

    const filtered = filterCandidates(
      all,
      filterCategory.value,
      searchTerm.value,
    );

    renderCandidateCards(filtered, cardsContainer, handleDelete);
  }

  filterCategory.addEventListener("change", refreshCandidateList);
  searchTerm.addEventListener("input", refreshCandidateList);

  updateCounter(getAllCVs().length);
});
