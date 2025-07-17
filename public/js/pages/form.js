document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const phoneInputField = document.querySelector("#field\\[7\\]");
        let utms = {
        "utm_source": "field[1]",
        "utm_medium": "field[2]",
        "utm_campaign": "field[3]",
        "utm_content": "field[4]"
    };

for (const [utmKey, fieldName] of Object.entries(utms)) {
    const valor = urlParams.get(utmKey);
            console.log(valor);
    if (valor) {
    const inputHidden = document.getElementsByName(fieldName)[0];
    if (inputHidden) inputHidden.value = valor;
    }
}



  const phoneInput = window.intlTelInput(phoneInputField, {
      initialCountry: "auto",
      separateDialCode: true,
      preferredCountries: ["br", "us", "ca", "gb", "de", "fr", "pt", "jp"],
      utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
  });

  function setCountryByIP() {
      fetch("https://ipinfo.io/json?token=bda67caaa3f85b")
          .then(response => response.json())
          .then(data => {
              if (data && data.country) {
                  const countryCode = data.country.toLowerCase();
                  phoneInput.setCountry(countryCode);
              } else {
                  phoneInput.setCountry("br");
              }
          })
          .catch(error => {
              phoneInput.setCountry("br");
          });
  }

  setCountryByIP();

  let maxDigits = 15;
  let lastValue = ""; 



  function applyPhoneMask(event) {
      const countryData = phoneInput.getSelectedCountryData();
      const countryCode = countryData.iso2.toUpperCase();
      let rawNumber = phoneInputField.value.replace(/\D/g, ""); 

      const maxDigits = getMaxDigitsForCountry(countryCode);

      if (rawNumber.length > maxDigits) {
          event.preventDefault();
          rawNumber = rawNumber.substring(0, maxDigits);
      }

      let formattedNumber = "";
      try {
          formattedNumber = new libphonenumber.AsYouType(countryCode).input(rawNumber);
      } catch (error) {
          formattedNumber = rawNumber;
      }

      if (event && event.inputType === "deleteContentBackward") {
          lastValue = phoneInputField.value;
          return;
      }

      phoneInputField.value = formattedNumber;
      lastValue = formattedNumber;
  }


  function getMaxDigitsForCountry(countryCode) {
      const countryMaxDigits = {
          US: 10, 
          CA: 10, 
          BR: 11, 
          GB: 10, 
          FR: 9,  
          DE: 11, 
          IN: 10, 
          MX: 10, 
          AU: 9, 
          JP: 10, 
          PT: 9
      };

      return countryMaxDigits[countryCode] || 15; 
  }



  phoneInputField.addEventListener("keydown", function (event) {
      const rawNumber = phoneInputField.value.replace(/\D/g, "");

      if (rawNumber.length >= maxDigits && event.keyCode >= 48 && event.keyCode <= 57) {
          event.preventDefault();
      }
  });

  phoneInputField.addEventListener("keypress", function (event) {
      const charCode = event.which ? event.which : event.keyCode;
      if (charCode < 48 || charCode > 57) {
          event.preventDefault();
      }
  });

  phoneInputField.addEventListener("paste", function (event) {
      event.preventDefault();
      let pastedText = (event.clipboardData || window.clipboardData).getData("text");
      phoneInputField.value = pastedText.replace(/\D/g, "").substring(0, maxDigits);
      applyPhoneMask();
  });

  phoneInputField.addEventListener("countrychange", function () {
      phoneInputField.value = "";
      lastValue = "";
      applyPhoneMask();
  });

  phoneInputField.addEventListener("input", applyPhoneMask);


 window.clicou_form_pag = function (event) {
    event.preventDefault();

    const email_digitado = document.getElementById("email");
    const zap_digitado = document.getElementById("field[7]");
    let url = document.querySelector(".urlCheckout").getAttribute('data-url');



    if (!zap_digitado.value.trim()) {
        alert("Por favor, preencha o número de WhatsApp.");
        return 0;
    }


    /*
    if (!phoneInput.isValidNumber()) {
      alert("Insira um número de telefone válido!");
      return false;
    }
      */

    // valida e-mail
    const re = /\S+@\S+\.\S+/;
    const check_email = re.test(email_digitado.value);
    if (!check_email) {
      alert("Digite um email válido!");
      return false;
    }


    // preenche field[1] com número completo formatado
    const zap_envio = document.getElementsByName("field[7]")[0];
    const numero_completo = phoneInput.getNumber(); // formato internacional E.164
    zap_envio.value = numero_completo.replace(/[^0-9]/g, ''); // somente números

    // coleta UTMs da URL
    const urlParams = new URLSearchParams(window.location.search);

    let utms = {
      "utm_source": "field[1]",
      "utm_medium": "field[2]",
      "utm_campaign": "field[3]",
      "utm_content": "field[4]"
    };

    for (const [utmKey, fieldName] of Object.entries(utms)) {
      const valor = urlParams.get(utmKey);
              console.log(valor);
      if (valor) {
        const inputHidden = document.getElementsByName(fieldName)[0];
        if (inputHidden) inputHidden.value = valor;
      }
    }


    //document.getElementById("_form_1_").submit();

    const sck = [
        urlParams.get("utm_source"),
        urlParams.get("utm_medium"),
        urlParams.get("utm_campaign"),
        urlParams.get("utm_content"),
        urlParams.get("utm_term")
    ].join('|');

    
    if (!url || url == "") {
        url = "https://pay.hotmart.com/G100576922A?off=6mshjz42&checkoutMode=10";
    } 

    const rastreio = url +
    `&sck=${sck}` +
    `&utm_source=${urlParams.get("utm_source")}` +
    `&utm_medium=${urlParams.get("utm_medium")}` +
    `&utm_campaign=${urlParams.get("utm_campaign")}` +
    `&utm_content=${urlParams.get("utm_content")}` +
    `&utm_term=${urlParams.get("utm_term")}` +
    `&email=${email_digitado.value}` +
    `&phoneac=${numero_completo}`;

    console.log(utms);

    fetch("https://fabiocostaonline.activehosted.com/proc.php", {
        method: "POST",
        body: new FormData(document.getElementById("_form_1_")),
        mode: "no-cors"

    }).then(() => {
        window.location.href = rastreio;
    });
  }
});

function getUTMs() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || '',
    utm_medium: params.get("utm_medium") || '',
    utm_campaign: params.get("utm_campaign") || '',
    utm_content: params.get("utm_content") || '',
    utm_term: params.get("utm_term") || ''
  };
}