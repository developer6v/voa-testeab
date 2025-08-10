
        document.getElementById('validationForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const submitBtn = document.getElementById('submitBtn');
            const loading = document.getElementById('loading');
            const errorMessage = document.getElementById('errorMessage');
            
            // Limpar mensagens de erro anteriores
            errorMessage.style.display = 'none';
            
            // Validar email
            if (!email || !isValidEmail(email)) {
                showError('Por favor, insira um email válido.');
                return;
            }
            
            // Mostrar loading
            submitBtn.disabled = true;
            submitBtn.textContent = 'Verificando...';
            loading.style.display = 'block';
            
            try {
                const formData = new FormData();
                formData.append('email', email);
                
                // Fazer requisição POST para a API
                const response = await fetch('https://script.google.com/macros/s/AKfycbzjCaODfmxJ9MfiND3vykaOuMGlle8-_iy4Fbk7mkqMLJhefiFSD6u77wLfNh2nMPW2Fg/exec', {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify({ email })
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.text();
                const resultTrimmed = result.trim().toLowerCase();
                
                console.log('Resposta da API:', result); 
                
                if (resultTrimmed === 'true') {
                    submitBtn.textContent = 'Compra encontrada! Redirecionando...';
                    setTimeout(() => {
                        window.location.href = 'https://pay.hotmart.com/M8281500Q?checkoutMode=10&off=kb6qqz1g&offDiscount=CUPOMVOA'; // Substituir pela URL real do checkout
                    }, 1500);
                } else if (resultTrimmed === 'false') {
                    submitBtn.textContent = 'Compra não encontrada. Redirecionando...';
                    setTimeout(() => {
                        window.location.href = 'fabiocostaonline.com/voa/compra-naoencontrada'; 
                    }, 1500);
                } else {
                    throw new Error('Resposta inesperada da API: ' + result);
                }
                
            } catch (error) {
                console.error('Erro na requisição:', error);
                showError('Erro ao verificar compra. Verifique sua conexão e tente novamente.');
                
                // Restaurar estado do botão em caso de erro
                submitBtn.disabled = false;
                submitBtn.textContent = 'Verificar Compra';
                loading.style.display = 'none';
            }
        });
        
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        
        function showError(message) {
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        }
        
        // Limpar erro quando usuário começar a digitar
        document.getElementById('email').addEventListener('input', function() {
            document.getElementById('errorMessage').style.display = 'none';
        });
        
        // Adicionar Enter key support
        document.getElementById('email').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                document.getElementById('validationForm').dispatchEvent(new Event('submit'));
            }
        });