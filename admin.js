document.addEventListener('DOMContentLoaded', () => {
    let clients = [];
    let adminData = {};

    // Carregar dados do JSON
    fetch('dados.json')
        .then(response => response.json())
        .then(data => {
            clients = data;
        })
        .catch(error => {
            console.error('Erro ao carregar os dados:', error);
        });

    // Carregar dados de login
    fetch('loginadm.json')
        .then(response => response.json())
        .then(data => {
            adminData = data;
        })
        .catch(error => {
            console.error('Erro ao carregar os dados do login:', error);
        });

    // Validar login
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === adminData.login && password === adminData.senha) {
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('main-content').style.display = 'block';
        } else {
            alert('Login ou senha inválidos!');
        }
    });

    // Adicionar cliente
    document.getElementById('clientForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const novoCliente = {
            nome: document.getElementById('nome').value,
            data_instalacao: document.getElementById('data_instalacao').value,
            garantia_inicio: document.getElementById('garantia_inicio').value,
            endereco: document.getElementById('endereco').value,
            contrato_url: document.getElementById('contrato_url').value,
            valor_bruto: document.getElementById('valor_bruto').value,
            valor_limpo: document.getElementById('valor_limpo').value
        };

        clients.push(novoCliente);
        alert('Cliente adicionado com sucesso!');
        document.getElementById('downloadJsonButton').style.display = 'block';
        document.getElementById('clientForm').reset();
    });

    // Baixar JSON
    function downloadJson() {
        const jsonBlob = new Blob([JSON.stringify(clients, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(jsonBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'dados.json';
        link.click();
        URL.revokeObjectURL(url);
    }

    window.downloadJson = downloadJson; // Tornar a função global para o botão funcionar
});