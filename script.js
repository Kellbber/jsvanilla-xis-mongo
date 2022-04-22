const baseURL = "http://localhost:3000/xis";
const msgAlert = document.querySelector(".msg-alert");

const findAllXis = async () => {
  const response = await fetch(`${baseURL}/all-xis`);

  const xis = await response.json();

  console.log(xis);

  xis.forEach((xis) => {
    document.querySelector("#xisList").insertAdjacentHTML(
      "beforeend",
      `
    <div class="XisListaItem" id="XisListaItem_${xis._id}">
        <div>
      <div class="XisListaItem__sabor">${xis.sabor}</div>
      <div class="XisListaItem__preco">${xis.preco}</div>
      <div class="XisListaItem__descricao">${xis.descricao}

      <div class="XisListaItem__acoes Acoes">
      <button id="btn__editar" class="acoes__editar btn" onclick="abrirModal('${xis._id}')">EDITAR</button>
      <button onclick="abrirModalDelete('${xis._id}')" class="acoes__apagar btn">DELETAR</button>
        </div>

      </div>
    </div>
    <img class="XisListaItem__foto" src= ${xis.foto} alt="${xis.sabor}" />

  </div>
    `
    );
  });
};
findAllXis();

const findByIdXis = async () => {
  const id = document.querySelector("#search-input-xis").value;

  if (id == "") {
    localStorage.setItem("message", "Digite o ID para pesquisar!");
    localStorage.setItem("type", "danger");

    msgAlert.innerText = localStorage.getItem("message");
    msgAlert.classList.add(localStorage.getItem("type"));
    closeMessageAlert();
    return;
  }
  const response = await fetch(`${baseURL}/one-xis/${id}`);
  const xis = await response.json();

  if (xis.message != undefined) {
    localStorage.setItem("message", xis.message);
    localStorage.setItem("type", "danger");

    msgAlert.innerText = localStorage.getItem("message");
    msgAlert.classList.add(localStorage.getItem("type"));
    closeMessageAlert();
    return;
  }
  document.querySelector(".list-all").style.display = "block"
  document.querySelector(".xisLista").style.display = "none"
  const XisEscolhidoDiv = document.querySelector("#XisEscolhido");

  XisEscolhidoDiv.innerHTML = `
  <div class="XisListaItem" id="XisListaItem_${xis._id}">
        <div>
      <div class="XisListaItem__sabor">${xis.sabor}</div>
      <div class="XisListaItem__preco">${xis.preco}</div>
      <div class="XisListaItem__descricao">${xis.descricao}
      </div>
      <div class="XisListaItem__acoes Acoes">
      <button id="btn__editar" class="acoes__editar btn" onclick="abrirModal('${xis._id}')">EDITAR</button>
      <button onclick="abrirModalDelete('${xis._id}')" class="acoes__apagar btn">DELETAR</button>
        </div>
    </div>
    <img class="XisListaItem__foto" src= ${xis.foto} alt="${xis.sabor}" />

  </div>
  `;
};

async function abrirModal(id = "") {
  if (id != "") {
    document.querySelector("#titulo-header-modal").innerText =
      "ATUALIZAR O XIS";
    document.querySelector("#button-form-modal").innerText = "ATUALIZAR";

    const response = await fetch(`${baseURL}/one-xis/${id}`);

    const xis = await response.json();

    document.querySelector("#id").value = xis._id;

    document.querySelector("#sabor").value = xis.sabor;

    document.querySelector("#preco").value = xis.preco;

    document.querySelector("#descricao").value = xis.descricao;

    document.querySelector("#foto").value = xis.foto;
  } else {
    document.querySelector("#titulo-header-modal").innerText =
      "CADASTRAR NOVO XIS";
    document.querySelector("#button-form-modal").innerText = "CADASTRAR";
  }
  document.querySelector("#overlay").style.display = "flex";
}

function fecharModal() {
  document.querySelector(".modal-overlay").style.display = "none";

  document.querySelector("#id").value = "";

  document.querySelector("#sabor").value = "";

  document.querySelector("#preco").value = "";

  document.querySelector("#descricao").value = "";

  document.querySelector("#foto").value = "";
}

async function submitXis() {
  const id = document.querySelector("#id").value;

  const sabor = document.querySelector("#sabor").value;

  const preco = document.querySelector("#preco").value;

  const descricao = document.querySelector("#descricao").value;

  const foto = document.querySelector("#foto").value;

  const xis = {
    id,
    sabor,
    preco,
    descricao,
    foto,
  };

  const modoAtivado = id != "";

  const endpoint =
    baseURL + (modoAtivado ? `/update-xis/${id}` : `/create-xis`);

  const response = await fetch(endpoint, {
    method: modoAtivado ? "put" : "post",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(xis),
  });

  const novoXis = await response.json();

  if (novoXis.message != undefined) {
    localStorage.setItem("message", novoXis.message);
    localStorage.setItem("type", "danger");

    showMessageAlert();
    return;
  }

  if (modoAtivado) {
    localStorage.setItem("message", "Xis atualizado!");
    localStorage.setItem("type", "success");
  } else {
    localStorage.setItem("message", "Xis criado com sucesso");
    localStorage.setItem("type", "success");
  }

  document.location.reload(true);
  fecharModal();
}
function abrirModalDelete(id) {
  document.querySelector("#overlay-delete").style.display = "flex";
  const btnSim = document.querySelector(".btn_delete_yes");
  btnSim.addEventListener("click", function () {
    deleteXis(id);
  });
}
function fecharModalDelete() {
  document.querySelector("#overlay-delete").style.display = "none";
}

async function deleteXis(id) {
  const response = await fetch(`${baseURL}/delete-xis/${id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
  });
  console.log(response);
  const result = await response.json();

  localStorage.setItem("message", result.message);
  localStorage.setItem("type", "success");
  document.location.reload(true);

  fecharModalDelete();
}

function closeMessageAlert() {
  setTimeout(function () {
    msgAlert.innerText = "";
    msgAlert.classList.remove(localStorage.getItem("type"));
    localStorage.clear();
  }, 3000);
}

function showMessageAlert() {
  msgAlert.innerText = localStorage.getItem("message");
  msgAlert.classList.add(localStorage.getItem("type"));
  closeMessageAlert();
}

showMessageAlert();
