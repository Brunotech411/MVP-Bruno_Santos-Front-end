const API_URL = 'http://localhost:5000';

// Cria botão on/off para exibir lista
let listaVisivel = false;

function toggleLista() {
  const container = document.getElementById("tabela-container");
  const botao = document.getElementById("toggle-btn");

  if (listaVisivel) {
    container.style.display = "none";
    botao.innerText = "Exibir Lista";
    listaVisivel = false;
  } else {
    listarInstrumentos();
    container.style.display = "block";
    botao.innerText = "Ocultar Lista";
    listaVisivel = true;
  }
}

// Buscar e mostrar instrumentos na tabela
async function listarInstrumentos() {
  const response = await fetch(`${API_URL}/instrumentos`);
  const data = await response.json();
  const tbody = document.querySelector('#tabela tbody');
  tbody.innerHTML = '';

  data.instrumentos.forEach(inst => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${inst.tag}</td>
      <td>${inst.lrv}</td>
      <td>${inst.urv}</td>
      <td>${inst.span}</td>
      <td>${inst.data_loop}</td>
      <td><button onclick="removerInstrumento('${inst.tag}')">Remover</button></td>
    `;
    tbody.appendChild(row);
  });
}

// Adicionar instrumento
async function adicionarInstrumento() {
  const tag = document.getElementById('tag').value;
  const lrv = parseFloat(document.getElementById('lrv').value);
  const urv = parseFloat(document.getElementById('urv').value);
  const data_loop = document.getElementById('data_loop').value;

  const body = { tag, lrv, urv, data_loop };

  const response = await fetch(`${API_URL}/instrumento`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (response.ok) {
    alert("Instrumento adicionado!");
    listarInstrumentos();
  } else {
    alert("Erro ao adicionar.");
  }
}

// Remover instrumento
async function removerInstrumento(tag) {
  const confirmacao = confirm(`Deseja remover o instrumento ${tag}?`);
  if (!confirmacao) return;

  const response = await fetch(`${API_URL}/instrumento?tag=${encodeURIComponent(tag)}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    alert("Removido!");
    listarInstrumentos();
  } else {
    alert("Erro ao remover.");
  }
}

// Iniciar listagem ao abrir
listarInstrumentos();
