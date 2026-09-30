// Subida de fotos optimizadas desde formularios con data-upload.
// Reduce cada imagen a máx. 1920 px en WebP antes de enviarla y luego sigue la
// respuesta del servidor (redirección a la página de confirmación o de error).
(function () {
  var MAX_SIDE = 1920;

  function shrink(file) {
    if (!window.createImageBitmap || !/^image\//.test(file.type)) return Promise.resolve(file);
    return createImageBitmap(file)
      .then(function (bmp) {
        var s = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
        var c = document.createElement('canvas');
        c.width = Math.round(bmp.width * s);
        c.height = Math.round(bmp.height * s);
        c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
        return new Promise(function (res) {
          c.toBlob(function (b) { res(b || file); }, 'image/webp', 0.82);
        });
      })
      .catch(function () { return file; });
  }

  function setup(form) {
    var input = form.querySelector('input[type=file]');
    var msg = form.querySelector('[data-upload-msg]');
    var preview = form.querySelector('[data-upload-preview]');
    var max = Number(input.getAttribute('data-max') || 10);
    var say = function (t) { if (msg) msg.textContent = t; };

    input.addEventListener('change', function () {
      var files = Array.prototype.slice.call(input.files);
      if (files.length > max) {
        say('Puede subir hasta ' + max + ' fotografías. Seleccione menos.');
        input.value = '';
        if (preview) preview.innerHTML = '';
        return;
      }
      say(files.length ? files.length + (files.length === 1 ? ' fotografía seleccionada' : ' fotografías seleccionadas') : '');
      if (!preview) return;
      preview.innerHTML = '';
      files.forEach(function (f) {
        var img = document.createElement('img');
        img.alt = '';
        img.src = URL.createObjectURL(f);
        preview.appendChild(img);
      });
    });

    form.addEventListener('submit', async function (e) {
      if (!window.fetch || !window.FormData) return; // sin JS moderno: envío normal
      e.preventDefault();
      if (!form.reportValidity()) return;
      var button = form.querySelector('button[type=submit]');
      if (button) button.disabled = true;
      var fd = new FormData(form);
      var files = Array.prototype.slice.call(input.files);
      fd.delete(input.name);
      for (var i = 0; i < files.length; i++) {
        say('Optimizando fotografía ' + (i + 1) + ' de ' + files.length + '…');
        fd.append(input.name, await shrink(files[i]), files[i].name.replace(/\.[^.]+$/, '') + '.webp');
      }
      say('Enviando…');
      try {
        var r = await fetch(form.action, { method: 'POST', body: fd, credentials: 'same-origin' });
        var type = r.headers.get('Content-Type') || '';
        if (r.ok) { location.href = r.url; return; }
        if (type.indexOf('text/html') === 0) { document.open(); document.write(await r.text()); document.close(); return; }
        say(await r.text());
      } catch (err) {
        say('No se pudo enviar. Revise su conexión e intente de nuevo.');
      }
      if (button) button.disabled = false;
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll('form[data-upload]'), setup);
})();
