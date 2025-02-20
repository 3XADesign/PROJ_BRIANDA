document.addEventListener("DOMContentLoaded", function () {
    // Referencias a elementos del DOM
    const passwordField         = document.getElementById("password-field");
    const passwordStrengthBar   = document.getElementById("password-strength");
    const passwordStrengthText  = document.getElementById("password-strength-text");
    const lengthRange           = document.getElementById("lengthRange");
    const rangeValue            = document.getElementById("rangeValue");
  
    const easyReadRadio         = document.getElementById("easyRead");
    const easySayRadio          = document.getElementById("easySay");
    const allCharsRadio         = document.getElementById("allChars");
  
    const useUppercase          = document.getElementById("use-uppercase");
    const useLowercase          = document.getElementById("use-lowercase");
    const useNumbers            = document.getElementById("use-numbers");
    const useSymbols            = document.getElementById("use-symbols");
  
    const refreshBtn            = document.getElementById("refresh-btn");
    const saveBtn               = document.getElementById("save-btn");
    const copyBtn               = document.getElementById("copy-btn");
    const copyMessage           = document.getElementById("copy-message");
  
    const togglePasswordBtn     = document.getElementById("toggle-password-btn");
    const toggleThemeBtn        = document.getElementById("toggle-theme-btn");
  
    /**
     * Ajustamos el contenido de los botones con íconos de Font Awesome
     */
    refreshBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Refrescar';
    saveBtn.innerHTML    = '<i class="fa-solid fa-save"></i> Guardar';
    copyBtn.innerHTML    = '<i class="fa-solid fa-copy"></i> Copiar';
  
    /**
     * Alterna modo claro/oscuro al hacer clic en el botón del sol/luna
     * Cambia la clase .dark-mode en <body>, y el icono de sol/luna
     */
    toggleThemeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode"); 
      const icon = toggleThemeBtn.querySelector("i"); // icono <i> dentro del botón
      if (document.body.classList.contains("dark-mode")) {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
      } else {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
      }
    });
  
    /**
     * Botón para mostrar/ocultar la contraseña (iconos ojo/ojo tachado)
     */
    togglePasswordBtn.addEventListener("click", () => {
      if (passwordField.type === "password") {
        passwordField.type = "text";
        togglePasswordBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
      } else {
        passwordField.type = "password";
        togglePasswordBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
      }
    });
  
    /**
     * Actualiza el color de fondo del rango según la longitud elegida
     */
    function updateRangeColor(value) {
      if (value < 8) {
        lengthRange.style.background = "red";
      } else if (value < 12) {
        lengthRange.style.background = "orange";
      } else {
        lengthRange.style.background = "green";
      }
    }
  
    /**
     * Ajusta la disponibilidad de checkboxes según el modo de legibilidad
     */
    function updateCheckboxState() {
      if (easySayRadio.checked) {
        // En fácil de decir: sin números ni símbolos (desmarcados y bloqueados)
        useNumbers.checked = false;
        useNumbers.disabled = true;
        useSymbols.checked = false;
        useSymbols.disabled = true;
      } else {
        // Volvemos a habilitar
        useNumbers.disabled = false;
        useSymbols.disabled = false;
  
        if (easyReadRadio.checked) {
          // En fácil de leer: por defecto desactivados, pero el usuario puede reactivarlos si quiere
          useNumbers.checked = false;
          useSymbols.checked = false;
        }
        // En "Todos los caracteres" no forzamos cambios
      }
      // Generamos una nueva contraseña inmediatamente para reflejar los cambios
      generarPassword();
    }
  
    // Vinculamos la actualización de checkboxes a los cambios en los radios
    easyReadRadio.addEventListener("change", updateCheckboxState);
    easySayRadio.addEventListener("change", updateCheckboxState);
    allCharsRadio.addEventListener("change", updateCheckboxState);
  
    /**
     * Mide la fortaleza de la contraseña y actualiza la barra + texto
     */
    function medirFortaleza(password) {
      let strength = 0;
  
      if (password.length >= 8)  strength++;
      if (password.length >= 12) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[^A-Za-z0-9]/.test(password)) strength++;
  
      const strengthPercent = (strength / 5) * 100;
      passwordStrengthBar.style.width = strengthPercent + "%";
  
      if (strengthPercent < 40) {
        passwordStrengthBar.style.backgroundColor = "red";
        passwordStrengthText.textContent = "Débil";
      } else if (strengthPercent < 70) {
        passwordStrengthBar.style.backgroundColor = "orange";
        passwordStrengthText.textContent = "Media";
      } else {
        passwordStrengthBar.style.backgroundColor = "green";
        passwordStrengthText.textContent = "Muy robusta";
      }
    }
  
    /**
     * Genera la contraseña en función de los checks y radios
     */
    function generarPassword() {
      const length = parseInt(lengthRange.value, 10);
  
      // Conjuntos de caracteres básicos
      let uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
      let numberChars    = "0123456789";
      let symbolChars    = "!@#$%^&*()-_=+[]{};:,.<>?/~`|\\";
  
      // "Fácil de leer": quitar confusos
      if (easyReadRadio.checked) {
        uppercaseChars = uppercaseChars.replace(/[OI]/g, "");
        lowercaseChars = lowercaseChars.replace(/[l1i]/g, "");
        numberChars    = numberChars.replace(/[0]/g, "");
      }
      // "Fácil de decir": quitar vocales
      if (easySayRadio.checked) {
        uppercaseChars = uppercaseChars.replace(/[AEIOU]/g, "");
        lowercaseChars = lowercaseChars.replace(/[aeiou]/g, "");
        // Y se deshabilitan numberChars y symbolChars
      }
  
      // Construcción del pool de caracteres
      let charsDisponibles = "";
      if (useUppercase.checked) charsDisponibles += uppercaseChars;
      if (useLowercase.checked) charsDisponibles += lowercaseChars;
      if (useNumbers.checked)   charsDisponibles += numberChars;
      if (useSymbols.checked)   charsDisponibles += symbolChars;
  
      if (!charsDisponibles) {
        // Evita un password vacío
        console.warn("No se ha seleccionado ningún tipo de carácter.");
        passwordField.value = "";
        return;
      }
  
      let password = "";
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charsDisponibles.length);
        password += charsDisponibles[randomIndex];
      }
  
      passwordField.value = password;
      medirFortaleza(password);
    }
  
    /**
     * Genera y muestra una contraseña por defecto al cargar la página
     */
    function generarPasswordPorDefecto() {
      useUppercase.checked = true;
      useLowercase.checked = true;
      useNumbers.checked   = true;
      useSymbols.checked   = true;
      allCharsRadio.checked = true; 
      lengthRange.value    = 12;
      rangeValue.textContent = "12";
      updateRangeColor(12);
  
      generarPassword();
    }
  
    /**
     * Guarda en un TXT usando la fecha/hora como nombre
     */
    function saveToFile(password) {
      const now = new Date();
      const YYYY = now.getFullYear();
      const MM   = String(now.getMonth() + 1).padStart(2, "0");
      const DD   = String(now.getDate()).padStart(2, "0");
      const hh   = String(now.getHours()).padStart(2, "0");
      const mm   = String(now.getMinutes()).padStart(2, "0");
      const ss   = String(now.getSeconds()).padStart(2, "0");
      const fileName = `${YYYY}${MM}${DD}${hh}${mm}${ss}_Password.txt`;
  
      const blob = new Blob([password], { type: "text/plain" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  
    /**
     * Eventos de botones
     */
    refreshBtn.addEventListener("click", generarPassword);
  
    saveBtn.addEventListener("click", function () {
      if (!passwordField.value) {
        console.warn("No hay contraseña para guardar");
        return;
      }
      saveToFile(passwordField.value);
    });
  
    copyBtn.addEventListener("click", function () {
      if (!passwordField.value) {
        copyMessage.textContent = "No hay contraseña para copiar";
        setTimeout(() => { copyMessage.textContent = ""; }, 2000);
        return;
      }
      navigator.clipboard.writeText(passwordField.value)
        .then(() => {
          // Mostramos “¡Copiado!” por un par de segundos
          copyMessage.textContent = "¡Copiado!";
          setTimeout(() => {
            copyMessage.textContent = "";
          }, 2000);
        })
        .catch(err => {
          console.error("Error al copiar:", err);
          copyMessage.textContent = "Error al copiar";
          setTimeout(() => {
            copyMessage.textContent = "";
          }, 2000);
        });
    });
  
    /**
     * Actualiza valor del range en tiempo real, su color y regenera la contraseña
     */
    lengthRange.addEventListener("input", function () {
      const val = parseInt(lengthRange.value, 10);
      rangeValue.textContent = val;
      updateRangeColor(val);
      generarPassword();
    });
  
    // Asignamos la función que se ejecuta al cargar la página 
    window.generarPasswordPorDefecto = generarPasswordPorDefecto;
  });