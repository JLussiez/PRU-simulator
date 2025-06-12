function calculer() {
    const nom = document.getElementById('nomActif').value;
    const nombreActions = parseFloat(document.getElementById('nombreActions').value);
    const pru = parseFloat(document.getElementById('pru').value);
    const prixActuel = parseFloat(document.getElementById('prixActuel').value);

    if (!nom || isNaN(nombreActions) || isNaN(pru) || isNaN(prixActuel)) {
        alert('Veuillez remplir tous les champs avec des valeurs valides.');
        return;
    }

    const investissementInitial = nombreActions * pru;
    const valeurActuelle = nombreActions * prixActuel;
    const gainTotal = valeurActuelle - investissementInitial;
    const pourcentage = (gainTotal / investissementInitial) * 100;
    const plusValueParAction = prixActuel - pru;

    // Affichage des résultats
    document.getElementById('investissementInitial').textContent = formatCurrency(investissementInitial);
    document.getElementById('valeurActuelle').textContent = formatCurrency(valeurActuelle);
    document.getElementById('plusValueParAction').textContent = formatCurrency(plusValueParAction);
    document.getElementById('plusValueParAction').className = plusValueParAction >= 0 ? 'text-lg font-semibold text-gain' : 'text-lg font-semibold text-loss';
    
    document.getElementById('gainTotal').textContent = formatCurrency(gainTotal);
    document.getElementById('gainTotal').className = gainTotal >= 0 ? 'text-2xl font-bold text-gain' : 'text-2xl font-bold text-loss';
    
    document.getElementById('pourcentage').textContent = formatPercentage(pourcentage);
    document.getElementById('pourcentage').className = pourcentage >= 0 ? 'text-2xl font-bold text-gain' : 'text-2xl font-bold text-loss';

    // Pré-remplir la simulation avec les valeurs actuelles
    document.getElementById('simNombreActions').value = nombreActions;
    document.getElementById('simPru').value = pru;
    document.getElementById('simPrixActuel').value = prixActuel;

    // Afficher les sections résultats et simulation
    document.getElementById('resultats').style.display = 'block';
    document.getElementById('simulation').style.display = 'block';

    // Ajouter les listeners pour la simulation en temps réel
    addSimulationListeners();
}

function calculerSimulation() {
    const nombreActions = parseFloat(document.getElementById('simNombreActions').value);
    const pru = parseFloat(document.getElementById('simPru').value);
    const prixActuel = parseFloat(document.getElementById('simPrixActuel').value);

    if (isNaN(nombreActions) || isNaN(pru) || isNaN(prixActuel)) {
        alert('Veuillez remplir tous les champs de simulation avec des valeurs valides.');
        return;
    }

    const investissementInitial = nombreActions * pru;
    const valeurActuelle = nombreActions * prixActuel;
    const gainTotal = valeurActuelle - investissementInitial;
    const pourcentage = (gainTotal / investissementInitial) * 100;

    document.getElementById('gainSimule').textContent = formatCurrency(gainTotal);
    document.getElementById('gainSimule').className = gainTotal >= 0 ? 'text-2xl font-bold text-gain' : 'text-2xl font-bold text-loss';
    
    document.getElementById('pourcentageSimule').textContent = formatPercentage(pourcentage);
    document.getElementById('pourcentageSimule').className = pourcentage >= 0 ? 'text-2xl font-bold text-gain' : 'text-2xl font-bold text-loss';
}

function addSimulationListeners() {
    const inputs = ['simNombreActions', 'simPru', 'simPrixActuel'];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('input', calculerSimulation);
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

function formatPercentage(percentage) {
    return (percentage >= 0 ? '+' : '') + percentage.toFixed(2) + '%';
}

// Variables pour le calculateur de PRU
let achats = [];

function ajouterAchat() {
    const nombre = parseFloat(document.getElementById('achatNombre').value);
    const prix = parseFloat(document.getElementById('achatPrix').value);

    if (isNaN(nombre) || isNaN(prix) || nombre <= 0 || prix <= 0) {
        alert('Veuillez saisir des valeurs valides et positives.');
        return;
    }

    const montantTotal = nombre * prix;
    const achat = {
        id: Date.now(),
        nombre: nombre,
        prix: prix,
        montantTotal: montantTotal
    };

    achats.push(achat);
    mettreAJourTableauAchats();
    calculerPRU();
    
    // Vider les champs
    document.getElementById('achatNombre').value = '';
    document.getElementById('achatPrix').value = '';
}

function supprimerAchat(id) {
    achats = achats.filter(achat => achat.id !== id);
    mettreAJourTableauAchats();
    calculerPRU();
    
    if (achats.length === 0) {
        document.getElementById('listeAchats').style.display = 'none';
        document.getElementById('resultatsPRU').style.display = 'none';
        document.getElementById('btnReinitialiser').style.display = 'none';
    }
}

function mettreAJourTableauAchats() {
    const tableau = document.getElementById('tableauAchats');
    tableau.innerHTML = '';

    achats.forEach(achat => {
        const ligne = document.createElement('tr');
        ligne.className = 'border-t border-gray-200';
        ligne.innerHTML = `
            <td class="px-4 py-2 text-sm">${achat.nombre}</td>
            <td class="px-4 py-2 text-sm">${formatCurrency(achat.prix)}</td>
            <td class="px-4 py-2 text-sm font-medium">${formatCurrency(achat.montantTotal)}</td>
            <td class="px-4 py-2">
                <button onclick="supprimerAchat(${achat.id})" class="text-red-600 hover:text-red-800 text-sm">
                    Supprimer
                </button>
            </td>
        `;
        tableau.appendChild(ligne);
    });

    document.getElementById('listeAchats').style.display = achats.length > 0 ? 'block' : 'none';
}

function calculerPRU() {
    if (achats.length === 0) return;

    const totalActions = achats.reduce((sum, achat) => sum + achat.nombre, 0);
    const investissementTotal = achats.reduce((sum, achat) => sum + achat.montantTotal, 0);
    const pruMoyen = investissementTotal / totalActions;

    document.getElementById('totalActions').textContent = totalActions.toFixed(2);
    document.getElementById('investissementTotalPRU').textContent = formatCurrency(investissementTotal);
    document.getElementById('pruMoyen').textContent = formatCurrency(pruMoyen);

    document.getElementById('resultatsPRU').style.display = 'grid';
    document.getElementById('btnReinitialiser').style.display = 'block';
}

function reinitialiserPRU() {
    achats = [];
    document.getElementById('listeAchats').style.display = 'none';
    document.getElementById('resultatsPRU').style.display = 'none';
    document.getElementById('btnReinitialiser').style.display = 'none';
    document.getElementById('achatNombre').value = '';
    document.getElementById('achatPrix').value = '';
} 