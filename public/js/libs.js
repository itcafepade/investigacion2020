// LOADER
export function closeLoader() {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('loader-toggle').classList.remove('active');
}

export function openLoader() {
    document.getElementById('loader-toggle').classList.add('active');
}
// END LOADER
