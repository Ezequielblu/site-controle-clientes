// Função para calcular o tempo em anos e dias desde uma data
function calculateTimeSince(date) {
    const startDate = new Date(date);
    const today = new Date();
    const diffTime = today - startDate;
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Calcular anos e dias
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
    const warrantyDuration = 365; // Duração da garantia em dias
    const diffTime = today - startWarrantyDate;
    const daysSinceWarrantyStart = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const daysLeft = warrantyDuration - daysSinceWarrantyStart;

    if (daysLeft > 0) {
        return { status: 'green', text: `${daysLeft} dia${daysLeft !== 1 ? 's' : ''} restantes` };
    } else {
        return { status: 'red', text: 'Expirada' };
    }
}

// Função para exibir os clientes na página
// Função para exibir os clientes na página
// Formatar datas no padrão dd/mm/yyyy
function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    if (isNaN(date)) return "Data inválida"; // Tratamento de erro
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Função para carregar e exibir os clientes
function displayClients(clients) {
    const clientList = document.getElementById("clientList");
    clientList.innerHTML = ''; // Limpa a lista de clientes

    clients.forEach(client => {
        const timeSinceInstall = calculateTimeSince(client.data_instalacao);
        const warrantyStatus = calculateWarrantyStatus(client.garantia_inicio);

        const clientDiv = document.createElement("div");
        clientDiv.classList.add("client");
        clientDiv.innerHTML = `
        <div class="client-name">${client.nome}</div>
        <div>
            <div class="client-time">Tempo Total da Instalação: ${timeSinceInstall}</div>
            <div class="client-time ${warrantyStatus.status}">Garantia: ${warrantyStatus.text}</div>
            <div>Data de Instalação: ${formatDate(client.data_instalacao)}</div>
        </div>
    `;

        // Adicionar evento de clique
        clientDiv.addEventListener("click", () => showClientDetails(client));
        clientList.appendChild(clientDiv);
    });
}

// Carregar os dados do JSON
fetch('dados.json')
    .then(response => response.json())
    .then(data => {
        clients = data;
        filteredClients = data; // Inicializar lista de filtrados
        displayClients(clients); // Exibir clientes
    })
    .catch(error => {
        console.error('Erro ao carregar os dados:', error);
    });



// Função para exibir os detalhes do cliente abaixo do cliente clicado
// Função para exibir os detalhes do cliente sobre o cliente clicado
// Função para exibir os detalhes do cliente sobre o cliente clicado
// Função para exibir os detalhes do cliente
function showClientDetails(client) {
    // Criar o overlay
    const clientDetailsOverlay = document.createElement("div");
    clientDetailsOverlay.classList.add("client-details-overlay");

    // Criar o conteúdo do cliente
    const detailsContent = `
    <div class="client-details-content">
        <h2>Detalhes de ${client.nome}</h2>
        <p><strong>Data de Instalação:</strong> ${formatDate(client.data_instalacao)}</p>
        <p><strong>Início da Garantia:</strong> ${formatDate(client.garantia_inicio)}</p>
        <p><strong>Endereço:</strong> ${client.endereco}</p>
        <p><strong>Contrato:</strong> <a href="${client.contrato_url}" target="_blank">Visualizar Contrato</a></p>
        <p><strong>Tempo de Instalação:</strong> ${calculateTimeSince(client.data_instalacao)}</p>
        <p><strong>Status da Garantia:</strong> ${calculateWarrantyStatus(client.garantia_inicio).text}</p>
        <p><strong>Valor Bruto:</strong> ${client.valor_bruto}</p>
        <p><strong>Valor Limpo:</strong> ${client.valor_limpo}</p>
        <button class="close-button" onclick="closeClientDetails()">Fechar</button>
    </div>
`;


    clientDetailsOverlay.innerHTML = detailsContent;
    document.body.appendChild(clientDetailsOverlay);
    document.body.style.overflow = "hidden"; // Desativar scroll ao abrir os detalhes
}

function closeClientDetails() {
    const clientDetailsOverlay = document.querySelector(".client-details-overlay");
    if (clientDetailsOverlay) {
        clientDetailsOverlay.remove();
        document.body.style.overflow = "auto"; // Restaurar scroll
    }
}









// Função para filtrar clientes pelo nome
function filterClients() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    filteredClients = clients.filter(client => client.nome.toLowerCase().includes(searchInput));
    applyFilters();
}

// Função para aplicar filtros de data ou garantia
function applyFilters() {
    const filterOption = document.getElementById("filterSelect").value;

    let sortedClients = [...filteredClients]; // Copiar a lista filtrada

    if (filterOption === 'newest') {
        // Ordenar pela data de instalação (mais recentes primeiro)
        sortedClients.sort((a, b) => new Date(b.data_instalacao) - new Date(a.data_instalacao));
    } else if (filterOption === 'warranty') {
        // Ordenar pelo tempo restante da garantia (mais próximo de vencer primeiro)
        sortedClients.sort((a, b) => {
            const warrantyA = calculateWarrantyStatus(a.garantia_inicio).text.includes('restantes')
                ? parseInt(calculateWarrantyStatus(a.garantia_inicio).text.split(' ')[0])
                : Infinity;
            const warrantyB = calculateWarrantyStatus(b.garantia_inicio).text.includes('restantes')
                ? parseInt(calculateWarrantyStatus(b.garantia_inicio).text.split(' ')[0])
                : Infinity;

            return warrantyA - warrantyB; // Garantias mais próximas de vencer vêm primeiro
        });
    }

    displayClients(sortedClients);
}


// Carregar dados dos clientes do JSON
fetch('dados.json')
    .then(response => response.json())
    .then(data => {
        clients = data;
        filteredClients = data; // Inicialmente, todos os clientes estão disponíveis
        displayClients(clients);
    })
    .catch(error => {
        console.error('Erro ao carregar os dados:', error);
    });

    function calculateTotals(clients) {
        let totalBruto = 0;
        let totalLimpo = 0;
    
        clients.forEach(client => {
            const bruto = parseFloat(client.valor_bruto.replace('R$', '').replace('.', '').replace(',', '.'));
            const limpo = parseFloat(client.valor_limpo.replace('R$', '').replace('.', '').replace(',', '.'));
    
            totalBruto += bruto;
            totalLimpo += limpo;
        });
    
        // Formatar valores para moeda brasileira
        const formattedBruto = totalBruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const formattedLimpo = totalLimpo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
        // Atualizar os elementos no header
        document.getElementById('totalBruto').textContent = `Valor Bruto: ${formattedBruto}`;
        document.getElementById('totalLimpo').textContent = `Valor Limpo: ${formattedLimpo}`;
    }
    
    // Carregar os dados do JSON e calcular totais
    fetch('dados.json')
        .then(response => response.json())
        .then(data => {
            clients = data;
            filteredClients = data; // Inicializar lista de filtrados
            displayClients(clients); // Exibir clientes
            calculateTotals(clients); // Calcular e exibir os totais
        })
        .catch(error => {
            console.error('Erro ao carregar os dados:', error);
        });
    