const API_URL = 'http://localhost:5000';

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

async function listarInstrumentos() {
  const response = await fetch(`${API_URL}/instrumentos`);
  const data = await response.json();
  const tbody = document.querySelector('#tabela tbody');
  tbody.innerHTML = '';

  data.instrumentos.forEach(inst => {
    inserirInstrumentoNaTabela(inst);
  });
}

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

  // Envia os dados do novo instrumento para a API.
  // Se a resposta for positiva (status 200), atualiza a interface e limpa os campos.
  // Caso contrário, exibe a mensagem de erro retornada pela API.
    if (response.ok) {
    alert("Instrumento adicionado!");
    limparCampos();
    listarInstrumentos();
    document.getElementById("tabela-container").style.display = "block";
    listaVisivel = true;
    document.getElementById("toggle-btn").innerText = "Ocultar Lista";
  } else {
    const erro = await response.json();
    alert("Erro ao adicionar: " + erro.message);
  }
  

function inserirInstrumentoNaTabela(inst) {
  const tbody = document.querySelector('#tabela tbody');
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
}

function limparCampos() {
  document.getElementById('tag').value = "";
  document.getElementById('lrv').value = "";
  document.getElementById('urv').value = "";
  document.getElementById('data_loop').value = "";
}

async function removerInstrumento(tag) {
  const confirmacao = confirm(`Deseja remover o instrumento ${tag}?`);
  if (!confirmacao) return;

  const response = await fetch(`${API_URL}/instrumento?tag=${encodeURIComponent(tag)}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    alert("Removido!");
    if (listaVisivel) listarInstrumentos();
  } else {
    alert("Erro ao remover.");
  }
}

async function buscarPorTag() {
  const tag = document.getElementById("busca-tag").value.trim();
  const container = document.getElementById("resultado-busca");

  container.innerHTML = ""; // limpa o resultado anterior

  if (!tag) {
    container.innerHTML = "<p style='color:white;'>Digite uma TAG para buscar.</p>";
    return;
  }

  const response = await fetch(`${API_URL}/instrumento?tag=${encodeURIComponent(tag)}`);
  const data = await response.json();

  if (response.ok) {
    const card = `
      <div class="card-instrumento">
        <p><strong>TAG:</strong> ${data.tag}</p>
        <p><strong>LRV:</strong> ${data.lrv}</p>
        <p><strong>URV:</strong> ${data.urv}</p>
        <p><strong>SPAN:</strong> ${data.span}</p>
        <p><strong>Data Loop:</strong> ${data.data_loop}</p>
      </div>
    `;
    container.innerHTML = card;
  } else {
    container.innerHTML = "<p style='color:white;'>Instrumento não encontrado.</p>";
  }
}