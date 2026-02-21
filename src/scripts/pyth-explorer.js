// Dropdowny - univerzální otvírač
const setupDropdown = (btnId, menuId) => {
  const btn = document.getElementById(btnId);
  const menu = document.getElementById(menuId);
  if (!btn || !menu) return;
  
  btn.onclick = (e) => {
    e.stopPropagation();
    const isShowing = menu.classList.contains('show');
    document.querySelectorAll('.dropdown-content').forEach(d => d.classList.remove('show'));
    if (!isShowing) menu.classList.add('show');
  };
};

setupDropdown('catBtn', 'catMenu');
setupDropdown('viewBtn', 'viewMenu');
setupDropdown('dlBtn', 'dlMenu');

// Přepínání View (Table/Grid)
document.getElementById('viewMenu')?.addEventListener('click', (e) => {
  const btn = e.target.closest('.view-item');
  if (btn) {
    document.querySelectorAll('.view-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const view = btn.dataset.view;
    console.log("Switching view to:", view); // Zde pak přidáš logiku pro změnu CSS třídy kontejneru
  }
});