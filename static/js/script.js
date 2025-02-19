document.addEventListener("DOMContentLoaded", function () {
    const generateBtn = document.getElementById("generate-btn");
    const passwordField = document.getElementById("password-field");
    const copyBtn = document.getElementById("copy-btn");
    const passwordStrength = document.getElementById("password-strength");
    const toggleVisibility = document.getElementById("toggle-visibility");
    const downloadBtn = document.getElementById("download_passwd");
    const lengthInput = document.getElementById("length");

    function updateStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (password.length >= 12) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        let strengthPercent = (strength / 5) * 100;
        passwordStrength.style.width = strengthPercent + "%";
        passwordStrength.style.backgroundColor = strengthPercent < 40 ? "red" : strengthPercent < 70 ? "orange" : "green";
    }
    
    function saveToFile(password) {
        if(password.length === 0){
            Swal.fire({
                title: 'Error!',
                text: 'la contraseña no ha sido generada, por lo que no se descargará el fichero',
                icon: 'error',
                confirmButtonText: 'Volver'
              })
              return;
        }
        
        const blob = new Blob([password], { type: "text/plain" });
        
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        // create a new Date object
    let now = new Date();

    // get the current hour (from 0 to 23)
    let hour = now.getHours();

    // get the current minute (from 0 to 59)
    let minute = now.getMinutes();
    let seconds = now.getSeconds();

    
        a.download = hour+"-" + minute+"-" + seconds + "-" + "password.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    
    function generatePassword() {
        const length = parseInt(lengthInput.value);
        if (isNaN(length) || length < 4 || length > 15) {
            alert("La longitud de la contraseña debe estar entre 4 y 15.");
            return;
        }
        
        const useDigits = document.getElementById("use-digits").checked;
        const useSpecials = document.getElementById("use-specials").checked;
        
        fetch("/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                length: length,
                use_digits: useDigits,
                use_specials: useSpecials
            })
        })
        .then(response => response.json())
        .then(data => {
            passwordField.value = data.password;
            updateStrength(data.password);
            
        })
        .catch(error => console.error("Error al generar la contraseña:", error));
    }
    
    generateBtn.addEventListener("click", generatePassword);
    downloadBtn.addEventListener("click", function () {
        saveToFile(passwordField.value);
    }); 
    
    document.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            generatePassword();
            
        }
    });
    
    copyBtn.addEventListener("click", function () {
        navigator.clipboard.writeText(passwordField.value);
    });
    
    toggleVisibility.addEventListener("click", function () {
        if (passwordField.type === "password") {
            passwordField.type = "text";
            toggleVisibility.textContent = "🙈";
        } else {
            passwordField.type = "password";
            toggleVisibility.textContent = "👁";
        }
    });
    
    lengthInput.addEventListener("input", function () {
        this.value = this.value.replace(/[^0-9]/g, ''); // Permite solo números
        if (this.value > 15) this.value = 15;
        if (this.value < 4 && this.value !== "") this.value = 4;
    });
});
