document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('izracunajBtn').addEventListener('click', izracunajClanarinu);
});

function izracunajClanarinu() {
    const brojMeseci = parseInt(document.getElementById('meseci').value) || 0;
    const cenaMesecne = parseInt(document.getElementById('cena').value) || 0;
    const brojPreporuka = parseInt(document.getElementById('preporuke').value) || 0;
    const meseciClanstva = parseInt(document.getElementById('clanstvo').value) || 0;
    const brojTreninga = parseInt(document.getElementById('treninzi').value) || 0;
    
    const ukupnaCena = brojMeseci * cenaMesecne;
    
    let popustPreporuka = 0;
    if (brojPreporuka >= 4) {
        popustPreporuka = 100;
    } else if (brojPreporuka >= 2) {
        popustPreporuka = 50;
    }
    
    let popustLojalnost = Math.min(meseciClanstva * 0.5, 3);
    
    let popustAktivnost = 0;
    if (brojTreninga >= 20) {
        popustAktivnost = 10;
    } else if (brojTreninga >= 15) {
        popustAktivnost = 5;
    }
    
    let ukupanPopust = popustPreporuka + popustLojalnost + popustAktivnost;
    ukupanPopust = Math.min(ukupanPopust, 100);
    
    const konacnaCena = ukupnaCena * (1 - ukupanPopust / 100);
    
    document.getElementById('ukupnaCena').textContent = ukupnaCena.toLocaleString('sr-RS');
    document.getElementById('ukupanPopust').textContent = ukupanPopust;
    document.getElementById('konacnaCena').textContent = konacnaCena.toLocaleString('sr-RS', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    document.getElementById('popustPreporuka').textContent = `Popust za preporuke: ${popustPreporuka}% (dovedeno ${brojPreporuka} vežbača)`;
    document.getElementById('popustLojalnost').textContent = `Popust za lojalnost: ${popustLojalnost.toFixed(1)}% (članstvo ${meseciClanstva} meseci)`;
    document.getElementById('popustAktivnost').textContent = `Popust za aktivnost: ${popustAktivnost}% (${brojTreninga} treninga)`;
    
    const rezultatElement = document.getElementById('rezultat');
    rezultatElement.classList.remove('d-none');
    
    setTimeout(() => {
        rezultatElement.scrollIntoView({ behavior: 'smooth' });
    }, 100);
}