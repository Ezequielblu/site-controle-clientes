let clients = [];  // Armazenar os clientes carregados

// Função para calcular o tempo em anos e dias desde uma data
function calculateTimeSince(date) {
    const startDate = new Date(date);
    const today = new Date();

    if (isNaN(startDate)) return "Data inválida";

    const diffTime = today - startDate;
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const years = Math.floor(totalDays / 365); 
    const days = totalDays % 365;
    
    let result = `${years} ano${years !== 1 ? 's' : ''}`;
    if (days > 0) {
        result += ` e ${days} dia${days !== 1 ? 's' : ''}`;
    }
    
    return result;
}

// Função para calcular o status da garantia
function calculateWarrantyStatus(garantiaInicio) {
    const today = new Date();
    const startWarrantyDate = new Date(garantiaInicio);

    if (isNaN(startWarrantyDate)) return { status: 'red', text: 'Data inválida' };

    const warrantyDuration = 365; // Garantia em dias
    const diffTime = today - startWarrantyDate;
    const daysSinceWarrantyStart = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const daysLeft = warrantyDuration - daysSinceWarrantyStart;

    if (daysLeft > 0) {
        return { status: 'green', text: `${daysLeft} dia${daysLeft !== 1 ? 's' : ''} restantes` };
    } else {
        return { status: 'red', text: 'Expirada' };
    }
}

// Função para formatar datas no padrão dd/mm/yyyy
function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    if (isNaN(date)) return "Data inválida";

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

// Função para calcular e exibir os totais bruto e limpo
function updateTotals(clients) {
    let totalBruto = 0;
    let totalLimpo = 0;

    clients.forEach(client => {
        const bruto = parseFloat(client.valor_bruto.replace("R$", "").replace(".", "").replace(",", ".").trim());
        const limpo = parseFloat(client.valor_limpo.replace("R$", "").replace(".", "").replace(",", ".").trim());

        totalBruto += bruto;
        totalLimpo += limpo;
    });

    document.getElementById("totalBruto").textContent = `Valor Bruto Total: R$ ${totalBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    document.getElementById("totalLimpo").textContent = `Valor Limpo Total: R$ ${totalLimpo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

// Função para carregar e exibir os clientes
function displayClients(clients) {
    const clientList = document.getElementById("clientList");
    clientList.innerHTML = '';

    clients.forEach(client => {
        const timeSinceInstall = calculateTimeSince(client.data_instalacao);
        const warrantyStatus = calculateWarrantyStatus(client.garantia_inicio);

        const clientDiv = document.createElement("div");
        clientDiv.classList.add("client");
        clientDiv.innerHTML = 
        `<div class="client-name">${client.nome}</div>
        <div>
            <div class="client-time">Tempo Total da Instalação: ${timeSinceInstall}</div>
            <div class="client-time ${warrantyStatus.status}">Garantia: ${warrantyStatus.text}</div>
            <div>Data de Instalação: ${formatDate(client.data_instalacao)}</div>
        </div>`;

        clientDiv.addEventListener("click", () => showClientDetails(client));
        clientList.appendChild(clientDiv);
    });

    // Atualizar os totais
    updateTotals(clients);
}

// Função para exibir os detalhes de um cliente
function showClientDetails(client) {
    const clientDetails = document.getElementById("clientDetails");
    const clientDetailsContent = document.getElementById("clientDetailsContent");

    clientDetailsContent.innerHTML = 
    `<h2>Detalhes de ${client.nome}</h2>
    <p><strong>Data de Instalação:</strong> ${formatDate(client.data_instalacao)}</p>
    <p><strong>Início da Garantia:</strong> ${formatDate(client.garantia_inicio)}</p>
    <p><strong>Endereço:</strong> ${client.endereco}</p>
    <p><strong>Contrato:</strong> <a href="${client.contrato_url}" target="_blank">Visualizar Contrato</a></p>
    <p><strong>Tempo de Instalação:</strong> ${calculateTimeSince(client.data_instalacao)}</p>
    <p><strong>Status da Garantia:</strong> ${calculateWarrantyStatus(client.garantia_inicio).text}</p>
    <p><strong>Valor Bruto:</strong> ${client.valor_bruto}</p>
    <p><strong>Valor Limpo:</strong> ${client.valor_limpo}</p>
    <p><strong>WhatsApp:</strong> <a href="${client.WhatsApp}" target="_blank">Clique aqui para abrir no WhatsApp</a></p>`;

    clientDetails.classList.add("show");
    document.body.style.overflow = "hidden";
}

// Fechar o modal clicando fora dele (opcional)
document.getElementById("clientDetails").addEventListener("click", (event) => {
    if (event.target === document.getElementById("clientDetails")) {
        closeClientDetails();
    }
});

// Função para fechar o modal
function closeClientDetails() {
    const clientDetails = document.getElementById("clientDetails");
    clientDetails.classList.remove("show");
    document.body.style.overflow = "auto";
}

// Função para filtrar e ordenar os dados
function filterClients() {
    const filterValue = document.getElementById("filterSelect").value;

    let filteredClients = [...clients];  // Copiar a lista original de clientes

    if (filterValue === 'installationRecent') {
        // Ordenar pela instalação mais recente
        filteredClients.sort((a, b) => new Date(b.data_instalacao) - new Date(a.data_instalacao));
    } else if (filterValue === 'warrantyExpiring') {
        // Organizar garantia
        filteredClients.sort((a, b) => {
            const warrantyA = calculateWarrantyStatus(a.garantia_inicio);
            const warrantyB = calculateWarrantyStatus(b.garantia_inicio);
            
            // Garantias válidas primeiro
            if (warrantyA.status === 'green' && warrantyB.status === 'red') return -1;
            if (warrantyA.status === 'red' && warrantyB.status === 'green') return 1;
            
            // Se ambos são válidos ou expirados, ordenar por data de vencimento da garantia
            return new Date(a.garantia_inicio) - new Date(b.garantia_inicio);
        });
    }

    displayClients(filteredClients);
}
// Função para buscar clientes pelo nome
function searchClients() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase().trim();

    // Filtrar clientes com base no termo de busca
    const filteredClients = clients.filter(client =>
        client.nome.toLowerCase().includes(searchTerm)
    );

    // Exibir os clientes filtrados
    displayClients(filteredClients);
}

// Adicionar evento ao campo de pesquisa
document.getElementById("searchInput").addEventListener("input", searchClients);
// Função para inicializar a página
function initializePage() {
    fetch('dados.json')
        .then(response => response.json())
        .then(data => {
            clients = data;  // Armazenar dados no array global
            displayClients(clients);
        })
        .catch(error => {
            console.error('Erro ao carregar os dados:', error);
        });
}

// Eventos
document.getElementById("filterSelect").addEventListener("change", filterClients);

// Inicializar a página
initializePage();
