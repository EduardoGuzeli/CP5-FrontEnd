// ---------- elementos ----------
const sidebar = document.getElementById('sidebar')
const overlay = document.getElementById('overlay')
const botaoAbrirSidebar = document.getElementById('abrirSidebar')
const botaoFecharSidebar = document.getElementById('fecharSidebar')

const botaoUsuario = document.getElementById('botaoUsuario')
const menuUsuario = document.getElementById('menuUsuario')

const modal = document.getElementById('modal')
const form = document.getElementById('formProjeto')
const botaoSalvar = document.getElementById('botaoSalvar')
const msgSucesso = document.getElementById('msgSucesso')

const campoBusca = document.getElementById('busca')
const grid = document.getElementById('gridProjetos')


// ---------- sidebar (mobile) ----------
function abrirSidebar() {
  sidebar.classList.remove('-translate-x-full')
  overlay.classList.remove('hidden')
}

function fecharSidebar() {
  sidebar.classList.add('-translate-x-full')
  overlay.classList.add('hidden')
}

botaoAbrirSidebar.addEventListener('click', abrirSidebar)
botaoFecharSidebar.addEventListener('click', fecharSidebar)
overlay.addEventListener('click', fecharSidebar)

// fecha o menu quando clica em algum link dele
sidebar.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', fecharSidebar)
})

// se aumentar a tela, garante que o overlay some
window.addEventListener('resize', function () {
  if (window.innerWidth >= 1024) {
    overlay.classList.add('hidden')
  }
})


// ---------- dropdown do usuário ----------
function toggleMenuUsuario() {
  const abrindo = menuUsuario.classList.contains('hidden')
  menuUsuario.classList.toggle('hidden')
  botaoUsuario.setAttribute('aria-expanded', abrindo)
}

botaoUsuario.addEventListener('click', function (e) {
  e.stopPropagation()
  toggleMenuUsuario()
})

// clicar fora fecha
document.addEventListener('click', function (e) {
  if (!menuUsuario.classList.contains('hidden') && !menuUsuario.contains(e.target)) {
    menuUsuario.classList.add('hidden')
    botaoUsuario.setAttribute('aria-expanded', false)
  }
})


// ---------- tema (light / dark / system) ----------
const CHAVE_TEMA = 'techflow-tema'
const botoesTema = document.querySelectorAll('.tema-btn')
const prefereEscuro = window.matchMedia('(prefers-color-scheme: dark)')

function aplicarTema(tema) {
  const escuro = tema === 'dark' || (tema === 'system' && prefereEscuro.matches)
  document.documentElement.classList.toggle('dark', escuro)

  botoesTema.forEach(function (btn) {
    btn.setAttribute('aria-pressed', btn.dataset.theme === tema)
  })
}

function trocarTema(tema) {
  localStorage.setItem(CHAVE_TEMA, tema)
  aplicarTema(tema)
}

botoesTema.forEach(function (btn) {
  btn.addEventListener('click', function () {
    trocarTema(btn.dataset.theme)
  })
})

// se o usuário mudar o tema do sistema com o modo System ligado, acompanha
prefereEscuro.addEventListener('change', function () {
  if ((localStorage.getItem(CHAVE_TEMA) || 'system') === 'system') {
    aplicarTema('system')
  }
})

aplicarTema(localStorage.getItem(CHAVE_TEMA) || 'system')


// ---------- modal ----------
function abrirModal() {
  modal.classList.remove('hidden')
  modal.classList.add('flex')
  document.getElementById('nome').focus()
}

function fecharModal() {
  modal.classList.add('hidden')
  modal.classList.remove('flex')
  limparFormulario()
}

document.getElementById('abrirModal').addEventListener('click', abrirModal)
document.getElementById('fecharModal').addEventListener('click', fecharModal)
document.getElementById('cancelarModal').addEventListener('click', fecharModal)

// clicar no fundo escuro fecha
modal.addEventListener('click', function (e) {
  if (e.target === modal) fecharModal()
})

document.addEventListener('keydown', function (e) {
  if (e.key !== 'Escape') return
  if (!modal.classList.contains('hidden')) fecharModal()
  menuUsuario.classList.add('hidden')
  fecharSidebar()
})


// ---------- validação do formulário ----------
const regras = {
  nome: function (v) {
    return v.trim().length < 3 ? 'O nome precisa ter pelo menos 3 caracteres.' : ''
  },
  responsavel: function (v) {
    return v.trim().length < 3 ? 'Informe o nome do responsável.' : ''
  },
  categoria: function (v) {
    return v === '' ? 'Escolha uma categoria.' : ''
  },
  prazo: function (v) {
    if (!v) return 'Defina um prazo.'
    // sv-SE devolve a data local no formato yyyy-mm-dd, igual ao input date
    const hoje = new Date().toLocaleDateString('sv-SE')
    return v < hoje ? 'O prazo não pode ser uma data passada.' : ''
  },
  descricao: function (v) {
    return v.trim().length < 10 ? 'Descreva o projeto com pelo menos 10 caracteres.' : ''
  },
}

function mostrarErro(nome, mensagem) {
  const p = form.querySelector('[data-erro="' + nome + '"]')
  p.textContent = mensagem
  p.classList.toggle('hidden', !mensagem)
}

function validarCampo(nome) {
  const campo = form.elements[nome]
  const mensagem = regras[nome](campo.value)

  campo.dataset.estado = mensagem ? 'erro' : 'ok'
  mostrarErro(nome, mensagem)
  return !mensagem
}

function validarPrioridade() {
  const marcada = form.querySelector('input[name="prioridade"]:checked')
  mostrarErro('prioridade', marcada ? '' : 'Selecione uma prioridade.')
  return !!marcada
}

// valida ao sair do campo e, depois disso, a cada tecla
Object.keys(regras).forEach(function (nome) {
  const campo = form.elements[nome]

  campo.addEventListener('blur', function () {
    validarCampo(nome)
  })
  campo.addEventListener('input', function () {
    if (campo.dataset.estado) validarCampo(nome)
  })
  campo.addEventListener('change', function () {
    validarCampo(nome)
  })
})

form.querySelectorAll('input[name="prioridade"]').forEach(function (radio) {
  radio.addEventListener('change', validarPrioridade)
})

function limparFormulario() {
  form.reset()
  msgSucesso.classList.add('hidden')
  botaoSalvar.disabled = false
  botaoSalvar.textContent = 'Salvar projeto'

  Object.keys(regras).forEach(function (nome) {
    delete form.elements[nome].dataset.estado
    mostrarErro(nome, '')
  })
  mostrarErro('prioridade', '')
}

form.addEventListener('submit', function (e) {
  e.preventDefault()

  // valida todos (sem parar no primeiro erro, pra mostrar tudo de uma vez)
  const resultados = Object.keys(regras).map(validarCampo)
  resultados.push(validarPrioridade())

  if (resultados.includes(false)) {
    const primeiroErro = form.querySelector('[data-estado="erro"]')
    if (primeiroErro) primeiroErro.focus()
    return
  }

  // simula o "salvar" (não tem banco de dados)
  botaoSalvar.disabled = true
  botaoSalvar.textContent = 'Salvando...'

  setTimeout(function () {
    adicionarCard({
      nome: form.elements.nome.value.trim(),
      responsavel: form.elements.responsavel.value.trim(),
      categoria: form.elements.categoria.value,
      prioridade: form.elements.prioridade.value,
      prazo: form.elements.prazo.value,
      descricao: form.elements.descricao.value.trim(),
    })

    msgSucesso.classList.remove('hidden')
    botaoSalvar.textContent = 'Salvo!'

    setTimeout(fecharModal, 1200)
  }, 800)
})


// ---------- novo card no grid ----------
const coresPrioridade = {
  Alta: 'text-red-600',
  Média: 'text-amber-600',
  Baixa: 'text-emerald-600',
}

function formatarData(iso) {
  const partes = iso.split('-')
  return partes[2] + '/' + partes[1] + '/' + partes[0]
}

function pegarIniciais(nome) {
  const palavras = nome.split(' ').filter(Boolean)
  const primeira = palavras[0][0]
  const ultima = palavras.length > 1 ? palavras[palavras.length - 1][0] : ''
  return (primeira + ultima).toUpperCase()
}

function adicionarCard(projeto) {
  const card = document.createElement('article')
  card.className =
    'projeto-card group flex flex-col justify-between rounded-xl border-2 border-indigo-400 bg-white p-5 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg dark:bg-slate-800'

  card.innerHTML =
    '<div>' +
      '<div class="flex items-center justify-between gap-2">' +
        '<span class="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"></span>' +
        '<span class="text-xs font-semibold ' + coresPrioridade[projeto.prioridade] + '">' + projeto.prioridade + '</span>' +
      '</div>' +
      '<h3 class="mt-3 flex items-center justify-between font-semibold transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400"></h3>' +
      '<p class="mt-1 text-sm text-slate-500 dark:text-slate-400"></p>' +
    '</div>' +
    '<div class="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">' +
      '<span>📅 ' + formatarData(projeto.prazo) + '</span>' +
      '<span class="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-semibold text-white" title=""></span>' +
    '</div>'

  // textContent nos campos digitados pra não injetar html
  card.querySelector('span').textContent = projeto.categoria
  card.querySelector('h3').textContent = projeto.nome
  card.querySelector('p').textContent = projeto.descricao
  const avatar = card.querySelector('.rounded-full.bg-indigo-500')
  avatar.textContent = pegarIniciais(projeto.responsavel)
  avatar.title = projeto.responsavel

  grid.prepend(card)
  atualizarContadores(1)
  filtrarProjetos()
}

function atualizarContadores(somar) {
  const indicador = document.getElementById('indAtivos')
  indicador.textContent = Number(indicador.textContent) + somar

  const total = grid.querySelectorAll('.projeto-card').length
  document.getElementById('totalProjetos').textContent = total + (total === 1 ? ' projeto' : ' projetos')
}


// ---------- busca ----------
function filtrarProjetos() {
  const termo = campoBusca.value.trim().toLowerCase()
  const cards = grid.querySelectorAll('.projeto-card')
  let visiveis = 0

  cards.forEach(function (card) {
    const bate = card.textContent.toLowerCase().includes(termo)
    card.classList.toggle('hidden', !bate)
    if (bate) visiveis++
  })

  document.getElementById('semResultados').classList.toggle('hidden', visiveis > 0)
}

campoBusca.addEventListener('input', filtrarProjetos)