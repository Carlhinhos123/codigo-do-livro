if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

// PWA install prompt
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const installBtn = document.getElementById('installBtn');
  if (installBtn) installBtn.classList.remove('hidden');
});

// Normalize user input to compare against correct word
function normalizeString(s){
  return s.trim().toUpperCase().normalize('NFD').replace(/\p{Diacritic}/gu,'').replace(/[^A-Z]/g,'');
}

const CORRECT = 'MONTANHA'; // normalized correct answer

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('answerForm');
  const input = document.getElementById('answerInput');
  const hintBtn = document.getElementById('hintBtn');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalCancel = document.getElementById('modalCancel');
  const modalAccept = document.getElementById('modalAccept');
  const installBtn = document.getElementById('installBtn');
  const successOverlay = document.getElementById('successOverlay');
  const restartBtn = document.getElementById('restartBtn');
  const leaveBtn = document.getElementById('leaveBtn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = normalizeString(input.value || '');
    if(!val){ showToast('Escreva uma resposta antes de enviar.'); return; }
    if(val === CORRECT){
      showToast('Resposta correta! Parabéns.', true);
      // reveal link in a nicer way
      setTimeout(()=>{
        window.open('https://digital.bbm.usp.br/view/?45000025743&bbm/7950#page/10/mode/2up','_blank');
      },700);
      // show success overlay with options
      setTimeout(()=>{ successOverlay.classList.remove('hidden'); }, 850);
    } else {
      showToast('Resposta incorreta. Tente novamente.');
    }
  });

  hintBtn.addEventListener('click', ()=>{
    modalOverlay.classList.remove('hidden');
  });

  modalCancel.addEventListener('click', ()=>{
    modalOverlay.classList.add('hidden');
  });

  modalAccept.addEventListener('click', ()=>{
    // show full hint text
    const content = document.getElementById('modalContent');
    content.innerHTML = `<p>Dica: Passo a passo é simples, primeiro você segue sua intuição, logo após você poderá seguir as intruções a seguir para ficar mais fácil...</p>
    <ol>
    <li>Em primeiro numero revela posição</li>
    <li>O Segundo revela a posição também porém dentro da posição anterior</li>
    <li>Como visto no site você precisa de uma senha, e citado anteriormente a senha será encontrada de acordo com a sua pesquisa, o segundo mostra o que deseja encontrar, EX: | 1:4 ojhAplsf | LETRA: A</li>
    </ol>
    <p>obs: se não entendeu, eu sinto muito, isso é um enigma, quebre a cabeça e "L'amor che muove il sole e l'altre stelle" Dante Alighieri.</p>`;
    // change buttons to only close
    modalCancel.textContent = 'Fechar';
    modalAccept.classList.add('hidden');
  });

  // Install button behavior
  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredPrompt) {
        // fallback: show instruction if install not available
        showToast('Instalação não disponível: use o menu do navegador (Adicionar à tela inicial).');
        return;
      }
      deferredPrompt.prompt();
      try { const choice = await deferredPrompt.userChoice; } catch (e) {}
      deferredPrompt = null;
      installBtn.classList.add('hidden');
    });
  }

  // Success overlay actions
  if (restartBtn) restartBtn.addEventListener('click', ()=>{
    // reset input and close overlay
    input.value = '';
    successOverlay.classList.add('hidden');
    showToast('Pronto — tente novamente.');
  });
  if (leaveBtn) leaveBtn.addEventListener('click', ()=>{
    successOverlay.classList.add('hidden');
  });
});

function showToast(msg, success=false){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  if(success) t.style.background = 'linear-gradient(90deg,#38b2ac,#63b3ed)';
  setTimeout(()=>{ t.classList.add('hidden'); t.style.background=''; }, 3000);
}

