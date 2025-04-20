let registros = [];

// Carrega os registros salvos
window.onload = function () {
  const salvos = localStorage.getItem('registros');
  if (salvos) {
    registros = JSON.parse(salvos);
    ordenarRegistrosPorData();
    renderizarRegistros();
  }
};

// Função para salvar os registros no localStorage
function salvarRegistros() {
  localStorage.setItem('registros', JSON.stringify(registros));
}

// Função para bater ponto
function baterPonto(tipo) {
  const data = document.getElementById('data').value;
  const hora = document.getElementById('hora').value;

  if (!data || !hora) {
    alert('Por favor, selecione data e hora.');
    return;
  }

  const registro = { data, hora, tipo }; // tipo pode ser 'entrada' ou 'saída'
  registros.push(registro);
  ordenarRegistrosPorData(); // Ordenar os registros sempre que um novo for adicionado
  salvarRegistros();
  renderizarRegistros();
}

// Função para ordenar os registros por data
function ordenarRegistrosPorData() {
  registros.sort((a, b) => new Date(a.data) - new Date(b.data));
}

// Função para limpar todos os registros
function limparTodosOsRegistros() {
  registros = [];
  salvarRegistros();
  renderizarRegistros();
}

// Função para agrupar os registros por mês
function agruparRegistrosPorMes() {
  const registrosPorMes = {};

  registros.forEach(registro => {
    const mesAno = new Date(registro.data).toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!registrosPorMes[mesAno]) {
      registrosPorMes[mesAno] = [];
    }
    registrosPorMes[mesAno].push(registro);
  });

  return registrosPorMes;
}

// Função para renderizar os registros
function renderizarRegistros() {
  const registroDiv = document.getElementById('registro');
  registroDiv.innerHTML = '';

  const registrosPorMes = agruparRegistrosPorMes();
  
  let tabelaHTML = '';
  for (const mesAno in registrosPorMes) {
    tabelaHTML += `
      <div class="mes" 
           onmouseover="mostrarRegistros('${mesAno}')" 
           onmouseout="esconderRegistros('${mesAno}')"
           onclick="toggleRegistros('${mesAno}')">
        <h3>${mesAno}</h3>
        <div id="registros-${mesAno}" class="tabela-container" style="display: none;">
          <table class="tabela-registros">
            <thead>
              <tr>
                <th>Data</th>
                <th>Entrada</th>
                <th>Saída</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
    `;
    
    registrosPorMes[mesAno].forEach(registro => {
      tabelaHTML += `
        <tr class="linha-registro">
          <td class="celula">${registro.data}</td>
          <td class="celula">${registro.tipo === 'entrada' ? registro.hora : '--'}</td>
          <td class="celula">${registro.tipo === 'saida' ? registro.hora : '--'}</td>
          <td class="celula">
            <button onclick="removerRegistro('${registro.data}', '${registro.hora}')" class="button-remover">🗑️</button>
          </td>
        </tr>
      `;
    });

    tabelaHTML += `
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  registroDiv.innerHTML = tabelaHTML;
}

// Função para remover um registro
function removerRegistro(data, hora) {
  registros = registros.filter(registro => !(registro.data === data && registro.hora === hora));
  salvarRegistros();
  renderizarRegistros();
}


// Função para alternar a visibilidade dos registros ao clicar
function toggleRegistros(mesAno) {
  const container = document.getElementById(`registros-${mesAno}`);

  // Verifica o estado atual e alterna a visibilidade
  if (container.style.display === 'none' || container.style.display === '') {
    container.style.display = 'block';  // Exibe os registros
  } else {
    container.style.display = 'none';   // Esconde os registros
  }
}


// Exemplo de como adicionar um botão para limpar todos os registros
const btnLimpar = document.createElement('button');
btnLimpar.textContent = 'Limpar todos os registros';
btnLimpar.classList.add('botao-limpar'); // Adicionando a classe para estilizar
btnLimpar.onclick = limparTodosOsRegistros;
document.body.appendChild(btnLimpar);

// Função para limpar todos os registros
function limparTodosOsRegistros() {
  if (confirm("Tem certeza que deseja limpar todos os registros?")) {
    registros = []; // Limpa os registros
    salvarRegistros(); // Atualiza o armazenamento
    renderizarRegistros(); // Atualiza a interface
  }
}

