(function () {
  // Só ativa em localhost
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    var btn = document.querySelector('.edit-btn');
    if (btn) btn.style.display = 'none';
    return;
  }

  var editBtn = document.querySelector('.edit-btn');
  var postContent = document.querySelector('.post-content');
  var article = document.querySelector('.post-single');
  if (!editBtn || !postContent || !article) return;

  var filepath = article.getAttribute('data-filepath');
  var originalHTML = '';
  var toolbar = null;

  editBtn.addEventListener('click', enterEditMode);

  function enterEditMode() {
    originalHTML = postContent.innerHTML;
    postContent.setAttribute('contenteditable', 'true');
    postContent.focus();
    editBtn.style.display = 'none';
    showToolbar();
  }

  function exitEditMode() {
    postContent.removeAttribute('contenteditable');
    editBtn.style.display = '';
    hideToolbar();
  }

  function showToolbar() {
    if (toolbar) {
      toolbar.style.display = 'flex';
      return;
    }

    toolbar = document.createElement('div');
    toolbar.className = 'edit-toolbar';

    var buttons = [
      { cmd: 'bold', icon: 'B', title: 'Negrito' },
      { cmd: 'italic', icon: 'I', title: 'Itálico' },
      { cmd: 'underline', icon: 'U', title: 'Sublinhado' },
      { type: 'sep' },
      { cmd: 'formatBlock', value: 'H2', icon: 'H2', title: 'Título 2' },
      { cmd: 'formatBlock', value: 'H3', icon: 'H3', title: 'Título 3' },
      { cmd: 'formatBlock', value: 'P', icon: '¶', title: 'Parágrafo' },
      { type: 'sep' },
      { cmd: 'formatBlock', value: 'BLOCKQUOTE', icon: '"', title: 'Citação' },
      { cmd: 'insertUnorderedList', icon: '•', title: 'Lista' },
      { cmd: 'createLink', icon: '🔗', title: 'Link' },
      { type: 'sep' },
      { cmd: 'undo', icon: '↩', title: 'Desfazer' },
      { cmd: 'redo', icon: '↪', title: 'Refazer' },
      { type: 'sep' },
      { action: 'save', icon: '✓ Salvar', title: 'Salvar alterações', cls: 'edit-toolbar-save' },
      { action: 'cancel', icon: '✕ Cancelar', title: 'Cancelar edição', cls: 'edit-toolbar-cancel' }
    ];

    buttons.forEach(function (b) {
      if (b.type === 'sep') {
        var sep = document.createElement('span');
        sep.className = 'edit-toolbar-sep';
        toolbar.appendChild(sep);
        return;
      }

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.innerHTML = b.icon;
      btn.title = b.title;
      btn.className = 'edit-toolbar-btn' + (b.cls ? ' ' + b.cls : '');

      if (b.action === 'save') {
        btn.addEventListener('click', saveContent);
      } else if (b.action === 'cancel') {
        btn.addEventListener('click', cancelEdit);
      } else if (b.cmd === 'createLink') {
        btn.addEventListener('click', function () {
          var url = prompt('URL do link:');
          if (url) document.execCommand('createLink', false, url);
        });
      } else if (b.cmd === 'formatBlock') {
        btn.addEventListener('click', function () {
          document.execCommand('formatBlock', false, '<' + b.value + '>');
        });
      } else {
        btn.addEventListener('click', function () {
          document.execCommand(b.cmd, false, null);
        });
      }

      toolbar.appendChild(btn);
    });

    document.body.appendChild(toolbar);
  }

  function hideToolbar() {
    if (toolbar) toolbar.style.display = 'none';
  }

  function cancelEdit() {
    postContent.innerHTML = originalHTML;
    exitEditMode();
  }

  function saveContent() {
    var content = postContent.innerHTML;
    var saveBtn = toolbar.querySelector('.edit-toolbar-save');
    saveBtn.innerHTML = '⏳ Salvando...';
    saveBtn.disabled = true;

    fetch('http://localhost:8080/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filepath: filepath,
        content: content
      })
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Erro ao salvar: ' + res.status);
        return res.json();
      })
      .then(function () {
        saveBtn.innerHTML = '✓ Salvo!';
        setTimeout(function () {
          saveBtn.innerHTML = '✓ Salvar';
          saveBtn.disabled = false;
          exitEditMode();
        }, 1200);
      })
      .catch(function (err) {
        alert('Erro ao salvar: ' + err.message + '\n\nVerifique se o edit-server.py está rodando (python3 edit-server.py)');
        saveBtn.innerHTML = '✓ Salvar';
        saveBtn.disabled = false;
      });
  }
})();
