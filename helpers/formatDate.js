export const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
  
    // Extraer componentes de la fecha
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    // Formatear la fecha
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };