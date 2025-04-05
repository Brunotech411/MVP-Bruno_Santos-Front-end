// URL base da API Flask (back end)
const API_URL = 'http://localhost:5000';

// Variável de controle para exibir ou ocultar a tabela
let listaVisivel = false;

// Alterna a exibição da lista de instrumentos
function toggleLista() {
  const container = document.getElementById("tabela-container");
  const botao = document.getElementById("toggle-btn");

  if (listaVisivel) {
    // Oculta a tabela se estiver visível
    container.style.display = "none";
    botao.innerText = "Exibir Lista";
    listaVisivel = false;
  } else {
    // Exibe a tabela e carrega os dados
    listarInstrumentos();
    container.style.display = "block";
    botao.innerText = "Ocultar Lista";
    listaVisivel = true;
  }
}

// Faz requisição GET para listar todos os instrumentos
async function listarInstrumentos() {
  const response = await fetch(`${API_URL}/instrumentos`);
  const data = await response.json();

  // Seleciona o corpo da tabela e limpa conteúdo anterior
  const tbody = document.querySelector('#tabela tbody');
  tbody.innerHTML = '';

  // Para cada instrumento, insere uma nova linha na tabela
  data.instrumentos.forEach(inst => {
    inserirInstrumentoNaTabela(inst);
  });
}

// Função para adicionar novo instrumento via POST
async function adicionarInstrumento() {
  // Captura os valores dos campos do formulário
  const tag = document.getElementById('tag').value.trim();
  const lrv = document.getElementById('lrv').value.trim();
  const urv = document.getElementById('urv').value.trim();
  const data_loop = document.getElementById('data_loop').value.trim();

  // Validação simples: impede envio com campos vazios
  if (!tag || !lrv || !urv || !data_loop) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  // Cria objeto FormData para envio no formato multipart/form-data
  const formData = new FormData();
  formData.append("tag", tag);
  formData.append("lrv", lrv);
  formData.append("urv", urv);
  formData.append("data_loop", data_loop);

  console.log("DEBUG - FormData enviado:", [...formData.entries()]);

  try {
    // Envia os dados para a API (POST)
    const response = await fetch(`${API_URL}/instrumento`, {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      alert("Instrumento adicionado com sucesso!");
      limparCampos();          // Limpa os inputs
      listarInstrumentos();    // Atualiza a tabela
      document.getElementById("tabela-container").style.display = "block";
      listaVisivel = true;
      document.getElementById("toggle-btn").innerText = "Ocultar Lista";
    } else {
      // Mostra mensagem de erro com detalhes da resposta
      const erro = await response.json();
      alert("Erro ao adicionar: " + JSON.stringify(erro, null, 2));
    }
  } catch (e) {
    alert("Erro de rede ou servidor: " + e.message);
  }
}

// Insere uma nova linha na tabela com os dados de um instrumento
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

// Limpa todos os campos do formulário
function limparCampos() {
  document.getElementById('tag').value = "";
  document.getElementById('lrv').value = "";
  document.getElementById('urv').value = "";
  document.getElementById('data_loop').value = "";
}

// Remove instrumento via requisição DELETE com base na TAG
async function removerInstrumento(tag) {
  const confirmacao = confirm(`Deseja remover o instrumento ${tag}?`);
  if (!confirmacao) return;

  const response = await fetch(`${API_URL}/instrumento?tag=${encodeURIComponent(tag)}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    alert("Removido!");
    if (listaVisivel) listarInstrumentos(); // Reatualiza a lista se estiver visível
  } else {
    alert("Erro ao remover.");
  }
}

// Busca instrumento específico por TAG via GET
async function buscarPorTag() {
  const tag = document.getElementById("busca-tag").value.trim();
  const container = document.getElementById("resultado-busca");

  container.innerHTML = ""; // Limpa o conteúdo anterior

  if (!tag) {
    container.innerHTML = "<p class='mensagem-erro'>Digite uma TAG para buscar.</p>";
    return;
  }

  const response = await fetch(`${API_URL}/instrumento?tag=${encodeURIComponent(tag)}`);
  const data = await response.json();

  if (response.ok) {
    // Cria um card com os dados do instrumento
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
    container.innerHTML = "<p class='mensagem-erro'>Instrumento não encontrado.</p>";
  }
}