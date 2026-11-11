export function filterCandidates(candidates, category, searchTerm) {
  const term = searchTerm.trim().toLowerCase();
  if (!term) return candidates;

  return candidates.filter((candidate) => { // ffuncino filter para todos los valores de candidates
    const json = candidate.payload || {};

    switch (category) { //  uso de swtiches
      case "puesto":
        return candidate.puesto.toLowerCase().includes(term);

      case "edad":
        return candidate.edad.toString() === term;

      case "tecnologias": {
        const techs = json.tecnologias || json.skills || [];
        if (Array.isArray(techs)) {
          return techs.some((t) => String(t).toLowerCase().includes(term));
        }
        return false;
      }

      case "experiencia": {
        const exp = json.experiencia || json.anios_experiencia || "";
        return JSON.stringify(exp).toLowerCase().includes(term);
      }

      case "all":
      default: {
        const identityMatch =
          candidate.nombre.toLowerCase().includes(term) ||
          candidate.apellidos.toLowerCase().includes(term) ||
          candidate.puesto.toLowerCase().includes(term) ||
          candidate.edad.toString().includes(term);

        const jsonMatch = JSON.stringify(json).toLowerCase().includes(term);

        return identityMatch || jsonMatch;
      }
    }
  });
}
